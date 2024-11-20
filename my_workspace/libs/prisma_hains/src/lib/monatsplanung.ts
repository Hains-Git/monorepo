const railsClass = `
class Dienstplan < ApplicationRecord
  belongs_to :parameterset
  belongs_to :dienstplanstatus
  belongs_to :dienstplanbedarf, optional: true
  has_many :bedarfs_eintrag, through: :dienstplanbedarf
  has_many :schicht, through: :bedarfs_eintrag
  has_many :diensteinteilung, dependent: :delete_all

  ATTRIBUTES = [
    :recompute,
    :bedarfs_eintraege,
    :einteilungen,
    :rotationen,
    :wuensche,
    :dates,
    # :logger,
    :dienst_bedarfeintrag,
    :schichten,
    :bedarf,
    :wochenbilanzen,
    :kws,
    :plantime_anfang,
    :plantime_ende,
    :anfang_frame,
    :ende_frame
  ]

  COMPACT = [
    :bedarfs_eintraege,
    :schichten,
    :einteilungen,
    :rotationen,
    :wuensche,
    :mitarbeiter_dienst,
    :dienst_mitarbeiter,
    :dates,
    :themen
  ]

  CHECK_TEAM_QUERY = "(
    (
      einteilung_rotations.id IS NULL AND (
        (
          funktions.team_id IS NULL AND (
            EXISTS (SELECT t.id FROM teams AS t WHERE t.default IS TRUE AND t.id IN(?) LIMIT 1)
            OR EXISTS (SELECT k.id FROM kontingents AS k WHERE k.default IS TRUE AND k.team_id IN(?) LIMIT 1)
          )
        ) OR funktions.team_id IN (?)
      )
    ) OR (
      einteilung_rotations.id IS NOT NULL AND
      (
        (? >= einteilung_rotations.von AND ? <= einteilung_rotations.bis)
        OR (? >= einteilung_rotations.von AND ? <= einteilung_rotations.bis)
        OR (? <= einteilung_rotations.von AND ? >= einteilung_rotations.bis)
      ) AND (
        kontingents.team_id IN (?)
      )
    )
  )"

  MAX_RATING = 5
  MAX_WOCHENENDEN = 2

  attr_accessor :mitarbeiter, :recompute, :vorschlag, :bedarfs_eintraege, :dienste, :einteilungen, :rotationen, :wuensche, :anfang_frame, :ende_frame
  attr_accessor :ratings, :kontingente, :freigaben, :zeitraumkategorien ,:dienstkategorien, :dates, :bedarf, :themen, :logger, :mitarbeiter_dienst
  attr_accessor :dienst_mitarbeiter, :arbeitszeitverteilungen, :dienst_bedarf, :dienst_bedarfeintrag, :arbeitszeittypen, :kontingent_dienste
  attr_accessor :dienstkategorie_dienste, :schichten, :log_status, :wochenbilanzen, :kws, :mitarbeiter_freigabetypen, :plantime_anfang, :plantime_ende

  def is_date(d)
    if d.respond_to?(:strftime)
      return true
    end
    return false
  end

  def get_dpl_anfang_ende
    check_anfang_ende
    setup_parameters()
    @anfang_frame = @plantime_anfang - self.parameterset.planparameter.relevant_timeframe_size.days
    @ende_frame = @plantime_ende + self.parameterset.planparameter.relevant_timeframe_size.days
    return {
      anfang: @anfang_frame,
      ende: @ende_frame
    }
  end

  #--------------------------------------------------------------------------------
  def init(recompute = false, vorschlag = true)
    measure("init") {
      @recompute = recompute
      @vorschlag = vorschlag
      anfang_ende = get_dpl_anfang_ende
      load_basics(anfang_ende[:anfang], anfang_ende[:ende])
    }
  end

  def check_anfang_ende
    @plantime_anfang = self.anfang
    @plantime_ende = self.ende
    if @plantime_anfang.mday != 1
      @plantime_anfang = @plantime_anfang.next_month.at_beginning_of_month
    end
    @plantime_ende = @plantime_anfang.at_end_of_month
    return {
      anfang: @plantime_anfang,
      ende: @plantime_ende
    }
  end

  def update_bedarfseintraege()
    @recompute = true
    setup_parameters()
    create_date_grid()
    load_bedarf()
    @bedarfs_eintraege
  end

  def get_basic_api_data()
    setup_parameters("log")
    load_dienste(false)
    load_mitarbeiter(false)
    load_freigaben()
    load_dienstkategorien(false)
    load_kontingente(false)
    load_ratings()
    load_themen()
    load_zeitraumkategorien()
    load_arbeitszeitverteilungen()
  end

  def compact_init(recompute= false, vorschlag = true)
    @recompute = recompute
    @vorschlag = vorschlag
    setup_parameters()
    create_date_grid()
    check_dpb()
    load_dienste()
    load_mitarbeiter()
    dienstplan_einteilungen()
    load_themen()
    load_dienstkategorien()#1.
    load_wuensche()#2.
    load_kontingente()#1.
    load_rotationen()#2.
    load_bedarfs_eintraege()#2.
    compute_dates_einteilungen()
  end

  def load_basics(anfang_dpl, ende_dpl)
    log("Getting basics")
    measure("create_date_grid_react") {
      create_date_grid_react(anfang_dpl, ende_dpl)
    }
    measure("check_dpb") {
      check_dpb()
    }
    measure("load_dienste") {
      load_dienste()
    }
    measure("load_mitarbeiter") {
      load_mitarbeiter(true, true)
    }
    measure("load_dienstkategorien") {
      load_dienstkategorien()
    }
    measure("load_kontingente") {
      load_kontingente()
    }
    measure("load_wuensche") {
      load_wuensche()
    }
    measure("load_rotationen") {
      load_rotationen()
    }
    measure("load_bedarf") {
      load_bedarf()
    }
    measure("load_einteilungen") {
      load_einteilungen()
    }
  end

  def setup_parameters(status = nil)
    @log_status = status.nil? ? "Debug" : status
    # Ohne Time.zone = "UTC" werden die Schichten beim respond im controller als falsche Time.zone interpretiert
    Time.zone = "UTC"
    init_logger()
  end

  def init_logger()
    @logger = []
    log("Logger Initialized.")
  end

  def log(text)
    if @log_status == "Debug" && parameterset.planparameter.debugging || @log_status != "Debug"
      @logger << {status: @log_status, msg: text, time: DateTime.now.to_s}
    end
  end

  def load_dienste(compute = true)
    log("Loading Dienste")
    @dienst_mitarbeiter = {}
    @dienst_bedarf = {}
    @dienst_bedarfeintrag = {}
    @dienste = hash_by_key(PoDienst.includes(:dienstratings, :dienstbedarves).all
      .order(:order)) { |dienst|
      id = dienst.id
      @dienst_mitarbeiter[id] = {}
      @dienst_bedarf[id] = []
      @dienst_bedarfeintrag[id] = {}
    }

    if compute
      compute_dienste()
    end
  end

  def compute_dienste()
    log("Compute Dienste")
    @dates.each do |id, date|
      @dates[id].by_dienst = {}
      @dienste.each do |key, value|
        @dates[id].by_dienst[key] = {}
        @dates[id].by_dienst[key][:einteilung_ids] = {}
        @dates[id].by_dienst[key][:wunsch_ids] = []
        @dates[id].by_dienst[key][:rotation_ids] = []
        @dates[id].by_dienst[key][:bedarf_id] = 0
        @dates[id].by_dienst[key][:bereiche_ids] = {}
        @dates[id].by_dienst[key][:id] = key.to_i
      end
    end
  end

  def load_mitarbeiter(compute = true, as_ids = false)
    log("Loading Mitarbeiter")
    @mitarbeiter_ids = []
    @mitarbeiter_dienst = {}
    @mitarbeiter_freigabetypen = {}
    mitarbeiter = []
    if as_ids
      mitarbeiter = Mitarbeiter.select("id")
        .where( platzhalter: false)
        .order(:planname)
    else
      mitarbeiter = Mitarbeiter
      .includes(:accountInfo, :dienstratings, :qualifizierte_freigaben, :vertrags_phases, :vertrags)
      .where( platzhalter: false)
      .order(:planname)
    end
    @mitarbeiter = hash_by_key(mitarbeiter) { |mitarbeiter|
      id = mitarbeiter.id
      @mitarbeiter_dienst[id] = {}
      @mitarbeiter_freigabetypen[id] = []
      @mitarbeiter_ids << id
    }
    if compute
      compute_mitarbeiter()
    end
  end

  def compute_mitarbeiter()
    log("Compute Mitarbeiter")
    get_wochenbilanzen()
    @dates.each do |id, date|
      @dates[id].by_mitarbeiter = {}
      @mitarbeiter.each do |key, value|
        @dates[id].by_mitarbeiter[key] = {}
        @dates[id].by_mitarbeiter[key][:einteilung_ids] = {}
        @dates[id].by_mitarbeiter[key][:wunsch_id] = 0
        @dates[id].by_mitarbeiter[key][:rotation_ids] = []
        @dates[id].by_mitarbeiter[key][:id] = key.to_i
      end
    end
  end

  def get_wochenbilanzen()
    @wochenbilanzen = {}
    @kws = {}
    bilanz_date = check_anfang_ende()[:anfang]
    5.times {
      bilanz_date = bilanz_date - 7
      kw = Kalenderwoche.von_tag(bilanz_date)
      # Aufgrund von Performance beschränkt auf die existierenden Wochenbilanzen
      @wochenbilanzen[kw.kw] = hash_by_key(Wochenbilanz.where(kalenderwoche_id: kw.id, mitarbeiter_id: @mitarbeiter_ids), :mitarbeiter_id)
      @kws[kw.kw] = kw
    }
  end

  def compute_tage_schichten()
    @tage_info = {}
    @arbeitszeittypen = hash_by_key(Arbeitszeittyp.all)
    @arbeitszeitverteilungen = hash_by_key(Arbeitszeitverteilung.all){ |abz|
      @tage_info[abz.id] = abz.compute_schichten(@arbeitszeittypen)
    }
  end

  def create_date_grid_react(anfang_dpl, ende_dpl)
    log("Creating Dates")
    @dates = {}
    week_counter = 0
    # date_grid für jeden Tag mit einem Date-Objekt füllen, bis das Ende erreicht ist
    @window_anfang = anfang_dpl
    @window_ende = ende_dpl
    anfang = @window_anfang
    zeitraumkategorien = Zeitraumkategorie.load_zeitraumkategorien_in(anfang_dpl, ende_dpl)
    until anfang == @window_ende do
      planer_date = PlanerDate.new(anfang, week_counter, zeitraumkategorien)
      @dates[planer_date.id] = planer_date
      anfang = anfang + 1.days
      # week_counter:
      # Wochenden gelten von Fr. Abend, bis Mo. Morgen
      # -> Fr. - Mo. zählen zu einem Wochenende, welches den week_counter nutzt
      if anfang.wday == 2
        week_counter = week_counter + 1
      end
    end
    # Letztes Datum (Ende) hinzufügen
    planer_date = PlanerDate.new(anfang, week_counter, zeitraumkategorien)
    @dates[planer_date.id] = planer_date
  end

  # Erstellen eines Array mit Objekten für jeden Tag von Anfang bis Ende und mit den Feiertagen für die betroffenen Jahre
  def create_date_grid
    window_anfang = self.anfang - self.parameterset.planparameter.relevant_timeframe_size.days
    window_ende = self.ende + self.parameterset.planparameter.relevant_timeframe_size.days
    create_date_grid_react(window_anfang, window_ende)
  end

  def dienstplan_einteilungen()
    log("Loading Einteilungen")
    @einteilungen = hash_by_key(Diensteinteilung.joins(:einteilungsstatus, :mitarbeiter)
      .where("tag >= ? and tag <= ? and (dienstplan_id = ? or counts)", @window_anfang, @window_ende, self[:id])
      .where(:mitarbeiters => { platzhalter: false}))
  end

  # Order ist für den Dienstplaner relevant
  # Einteilungen nach update Datum sortieren
  def load_einteilungen()
    log("Loading Einteilungen")
    @einteilungen = {}
    einteilungen = Diensteinteilung.joins(:einteilungsstatus, :mitarbeiter)
      .includes(:einteilungsstatus)
      .where("diensteinteilungs.tag >= ? AND diensteinteilungs.tag <= ?", @window_anfang, @window_ende)
      .where("(
          (diensteinteilungs.dienstplan_id = ?
            AND einteilungsstatuses.vorschlag = TRUE
            AND ?)
          OR einteilungsstatuses.counts = TRUE
        )", self[:id], @vorschlag)
      .where(:mitarbeiters => { platzhalter: false})
      .order("diensteinteilungs.tag ASC,
        diensteinteilungs.po_dienst_id ASC,
        einteilungsstatuses.public DESC,
        diensteinteilungs.bereich_id ASC,
        diensteinteilungs.updated_at ASC")
      einteilungen.find_in_batches do |batch|
        @einteilungen = hash_by_key(batch, :id, @einteilungen){ |einteilung|
          compute_einteilung(einteilung)
        }
      end
  end

  def compute_dates_einteilungen()
    log("compute Einteilungen to dates")
    @einteilungen.each do |id, einteilung|
      date_id = einteilung.date_id
      # if !@dates[date_id].by_mitarbeiter.key?(einteilung.mitarbeiter_id)
      #     @dates[date_id].by_mitarbeiter[einteilung.mitarbeiter_id] = {}
      #     log("No MitarbeiterId: " + einteilung.mitarbeiter_id.to_s)
      # end
      if @dates[date_id].einteilungen.key?(einteilung.dienstplan_id)
        @dates[date_id].einteilungen[einteilung.dienstplan_id] << einteilung.id
      else
        @dates[date_id].einteilungen[einteilung.dienstplan_id] = [einteilung.id]
      end
      if  @dates[date_id].by_mitarbeiter[einteilung.mitarbeiter_id][:einteilung_ids].key?(einteilung.dienstplan_id)
          @dates[date_id].by_mitarbeiter[einteilung.mitarbeiter_id][:einteilung_ids][einteilung.dienstplan_id] << einteilung.id
      else
        @dates[date_id].by_mitarbeiter[einteilung.mitarbeiter_id][:einteilung_ids][einteilung.dienstplan_id] = [einteilung.id]
      end
      if @dates[date_id].by_dienst[einteilung.po_dienst_id][:einteilung_ids].key?(einteilung.dienstplan_id)
        @dates[date_id].by_dienst[einteilung.po_dienst_id][:einteilung_ids][einteilung.dienstplan_id] << einteilung.id
      else
        @dates[date_id].by_dienst[einteilung.po_dienst_id][:einteilung_ids][einteilung.dienstplan_id] = [einteilung.id]
      end
    end
  end

  def load_rotationen(compute = true)
    log("Loading Rotationen")
    # Anfang oder Ende ist zwischen von und bis oder anfang ist kleiner und ende ist größer
    @rotationen = hash_by_key(
      EinteilungRotation.rotationen_in(@window_anfang, @window_ende)
      .order(:mitarbeiter_id)){ |rot|
        if compute
          compute_rotations_dienste(rot)
        end
      }
  end

  def compute_rotations_dienste(rot)
    @dates.each do |date_id, date|
      if date.full_date <= rot.bis && date.full_date >= rot.von
        @dates[date_id].rotationen << rot.id
        @dates[date_id].by_mitarbeiter[rot.mitarbeiter_id][:rotation_ids] << rot.id
        @kontingent_dienste[rot.kontingent_id].each do |dienst_id|
          @dates[date_id].by_dienst[dienst_id][:rotation_ids] << rot.id
        end
      end
    end
  end

  def load_wuensche()
    log("Loading Wünsche")
    @wuensche = hash_by_key(Dienstwunsch.joins(:mitarbeiter)
      .where("tag >= ? and tag <= ?", @window_anfang, @window_ende)
      .where(:mitarbeiters => { platzhalter: false })
      .order(:dienstkategorie_id)){ |wunsch|
        compute_wunsch_dienste(wunsch)
      }
  end

  def compute_wunsch_dienste(wunsch)
    tag = wunsch.date_id
    @dates[tag].wuensche << wunsch.id
    @dates[tag].by_mitarbeiter[wunsch.mitarbeiter_id][:wunsch_id] = wunsch.id
    @dienstkategorie_dienste[wunsch.dienstkategorie_id].each do |id|
      @dates[tag].by_dienst[id][:wunsch_ids] << wunsch.id
    end
  end

  def load_ratings()
    log("Loading Ratings")
    @ratings = hash_by_key(Dienstrating.includes(:mitarbeiter)
      .where(:mitarbeiters => {:platzhalter => false}))
  end

  def load_kontingente(compute = true)
    log("Loading Kontingente")
    @kontingent_dienste = {}
    @kontingente = hash_by_key(Kontingent.includes(:kontingent_po_dienst).all){ |kon|
      if compute
        compute_kontingent_dienste(kon)
      end
    }
  end

  def compute_kontingent_dienste(kon)
    log("Computing Kontingentdienste")
    kon_id = kon.id
    @kontingent_dienste[kon_id] = []
    @dienste.each do |dienst_id, d|
      #falls dienst und kontingent ein thema teilen
      if d.thema_ids.present? && kon.thema_ids.present? && (d.thema_ids & kon.thema_ids).size > 0
        @kontingent_dienste[kon_id] << dienst_id
      end
    end
  end

  def load_freigaben()
    log("Loading Freigaben")
    @freigaben = hash_by_key(Dienstfreigabe.joins(:mitarbeiter, :freigabestatus)
      .where(:freigabestatuses => {:qualifiziert => true},:mitarbeiters => {:platzhalter => false}))
  end

  def compute_freigaben_dienste()
    log("Computing Freigabetypendienste")
    @freigaben.each do |id, f|
      @mitarbeiter_freigabetypen[f.mitarbeiter_id] << f.freigabetyp_id
    end
    #graph representation
    @dienste.each do |dienst_id , d|
      @mitarbeiter_freigabetypen.each do |mitarbeiter_id, typen|
        #check if qualifiziert
        if (d.freigabetypen_ids & typen).size == d.freigabetypen_ids.size
          @mitarbeiter_dienst[mitarbeiter_id][dienst_id] = {}
          @dienst_mitarbeiter[dienst_id][mitarbeiter_id] = {}
        end
      end
    end
  end

  def compute_ratings_dienste()
    log("Computing RatingsDienste")
    @ratings.each do |rating_id, rating|
      if @mitarbeiter_dienst[rating.mitarbeiter_id].key(rating.po_dienst_id)
        @mitarbeiter_dienst[rating.mitarbeiter_id][rating.po_dienst_id][:rating] = rating_id
        @dienst_mitarbeiter[rating.po_dienst_id][rating.mitarbeiter_id][:rating] = rating_id
      end
    end
  end

  def compute_date_dienst_bedarfseintrag(bedarfeintrag)
    dienst_id = bedarfeintrag.po_dienst_id
    dienstbedarf_id = bedarfeintrag.dienstbedarf_id
    bedarfeintrag_id = bedarfeintrag.id
    tag = bedarfeintrag.date_id
    bedarf = @bedarf[dienstbedarf_id]
    bereich_id = 0
    if bedarf = @bedarf[dienstbedarf_id]
      bereich_id = bedarf.bereich_id
    end

    unless @dienst_bedarf[dienst_id].include?(dienstbedarf_id)
      @dienst_bedarf[dienst_id] << dienstbedarf_id
    end

    if @dienst_bedarfeintrag[dienst_id][tag].nil?
      @dienst_bedarfeintrag[dienst_id][tag] = []
    end

    @dienst_bedarfeintrag[dienst_id][tag] << bedarfeintrag_id
    date = @dates[tag]
    if date
      create_date_dienst_bereich(date, dienst_id, bereich_id, bedarfeintrag_id)
      date.bedarfseintraege << bedarfeintrag_id
      date.bedarf << dienstbedarf_id
    end
  end

  def create_date_dienst_bereich(date, dienst_id, bereich_id, bedarfeintrag_id)
    element = nil
    if date
      unless date.by_dienst[dienst_id][:bereiche_ids][bereich_id]
        date.by_dienst[dienst_id][:bereiche_ids][bereich_id] = {
          id: bereich_id,
          bedarfeintrag_id: bedarfeintrag_id,
          einteilungen: []
        }
      end
      element = date.by_dienst[dienst_id][:bereiche_ids][bereich_id]
    end
    element
  end

  def load_zeitraumkategorien()
    log("Loading Zeitraumkategorien")
    @zeitraumkategorien = hash_by_key(Zeitraumkategorie.all)
  end

  def load_dienstkategorien(compute = true)
    @dienstkategorie_dienste = {}
    log("Loading Dienstkategorien")
    @dienstkategorien = hash_by_key(Dienstkategorie.includes(:dienstkategoriethemas).all){ |kat|
      if compute
        compute_dienstkategorie_dienste(kat)
      end
    }
  end

  def compute_dienstkategorie_dienste(kat)
    kat_id = kat.id
    @dienstkategorie_dienste[kat_id] = []
    thema_ids = kat.dienstkategoriethemas.pluck(:thema_id)
    @dienste.each do |dienst_id, d|
      # falls dienst ein thema der kategorie hat
      if d.thema_ids.present? && thema_ids.present? && (d.thema_ids & thema_ids).size > 0
        @dienstkategorie_dienste[kat_id] << dienst_id
      end
    end
  end

  def check_dpb()
    unless dienstplanbedarf.present?
      dpb = Dienstplanbedarf.where(anfang: @window_anfang, ende: @window_ende).limit(1)
      unless dpb.present?
        dpb = Dienstplanbedarf.create!(anfang: @window_anfang, ende: @window_ende)
      else
        dpb = dpb.first
      end
      update_attributes(dienstplanbedarf_id: dpb.id)
      self.save!()
    end
  end

  def load_bedarf()
    @bedarf = hash_by_key(Dienstbedarf.bedarfe_by_date(@window_anfang))
    shall_compute = !parameterset.planparameter.reuse_bedarf || @recompute  || dienstplanbedarf.anfang != @window_anfang || dienstplanbedarf.ende != @window_ende || self.bedarfs_eintrag.count == 0
    # Irgendwie geht er in compute_bedarf, obwohl shall_compute false ist, deshalb das === true
    if shall_compute === true
      load_zeitraumkategorien()
      compute_tage_schichten()
      compute_bedarf()
    else
      log("Reloading Bedarf")
    end
    #load from Database
    # @bedarfs_eintraege = hash_by_key(self.bedarfs_eintrag){ |be|
    #   compute_date_dienst_bedarfseintrag(be)
    # }
    # @schichten = matrix_by_key(self.schicht, :bedarfs_eintrag_id)
    @bedarfs_eintraege = {}
    @schichten = {}
    self.bedarfs_eintrag.find_in_batches do |batch|
      @bedarfs_eintraege = hash_by_key(batch, :id, @bedarfs_eintraege){ |be|
        compute_date_dienst_bedarfseintrag(be)
      }
    end
    self.schicht.find_in_batches do |batch|
      @schichten = matrix_by_key(batch, :bedarfs_eintrag_id, false, @schichten)
    end
  end

  def load_bedarfs_eintraege()
    shall_compute = !parameterset.planparameter.reuse_bedarf || @recompute || dienstplanbedarf.anfang != @window_anfang || dienstplanbedarf.ende != @window_ende
    if shall_compute === true
      load_zeitraumkategorien()
      compute_tage_schichten()
      @bedarf = hash_by_key(Dienstbedarf.bedarfe_by_date(@window_anfang))
      compute_bedarf()
    else
      log("Reloading Bedarf")
    end
    #load from Database
    @bedarfs_eintraege = mapmap_by_key(self.bedarfs_eintrag)
    @schichten = matrix_by_key(self.schicht, :bedarfs_eintrag_id)
  end

  def compute_bedarf()
    log("Computing Bedarf")
      #start blank
      @relevant_dienste = {}
      @bedarfs_eintrag = {}
      if dienstplanbedarf.anfang != @window_anfang || dienstplanbedarf.ende != @window_ende
        dpb = Dienstplanbedarf.create(anfang: @window_anfang, ende: @window_ende)
        update_attributes(dienstplanbedarf_id: dpb.id)
      else
        dienstplanbedarf.reset()
      end
      #add dates
      @dates.each do |date_id, date|
        @bedarfs_eintrag[date_id] = {}
      end
      #compute Bedarf from default and write to Database
      @neue_schichten = []
      @neue_bedarfseintraege = []
      @next_id = ActiveRecord::Base.connection.execute("select last_value from bedarfs_eintrags_id_seq").first["last_value"] + 1
      @bedarf.each do |bedarf_id, bedarf|
        create_bedarfs_eintraege(bedarf)
      end
      BedarfsEintrag.import!(@neue_bedarfseintraege)
      Schicht.import!(@neue_schichten)
      dienstplanbedarf.update(dienste: @relevant_dienste.keys)
      broadcast_bedarfe_update
  end

  def load_themen()
    log("Loading Themen")
    @themen = hash_by_key(Thema.all)
  end

  def load_arbeitszeitverteilungen()
    log("Loading Arbeitszeitverteilungen")
    @arbeitszeitverteilungen = hash_by_key(Arbeitszeitverteilung.all)
    @arbeitszeittypen = hash_by_key(Arbeitszeittyp.all)
  end

  def get_dienst_relevanz()
    log("Checking Dienste mit Bedarf")
    @relevant_dienste = [];
    @no_relevant_dienste = [];
    @dienst_bedarf.each do |id, bedarf|
      if bedarf.length > 0
        @relevant_dienste << id
      else
        @no_relevant_dienste << id
      end
    end
  end

  def relevante_dienste()
    dienstplanbedarf.dienste
  end

  def get_anzahl_freigabetypen()
    @freigabetypen_count = Freigabetyp.count
  end

  # Alle Arbeitszeittypen holen, die gezählt werden sollen
  def get_counted_arbeitszeittypen()
    @counted_arbeitszeittypen = Arbeitszeittyp.select(:id).where(count: true)
  end

  def matrix_by_key(arr, key = :id, as_date_str = false, default_matrix = {}, &block)
    ApplicationRecord.matrix_by_key(arr, key, as_date_str, default_matrix, &block)
  end

  def mapmap_by_key(arr, key1 = :tag, key2 = :po_dienst_id, &block)
    matrix = {}
    arr.each do |el|
      id = el[key1]
      if matrix[id].nil?
        matrix[id] = {}
        matrix[id][el[key2]] = el
      else
        matrix[id][el[key2]] = el
      end
      if block_given?
        block.call(el)
      end
    end
    matrix
  end

  def create_bedarfs_eintraege(bedarf)
    dienst_id = bedarf.po_dienst_id
    # bedarf_id = bedarf.id
    bereich_id = bedarf.bereich_id
    @dates.each do |date_id, plan_date|
      # Bedarfe sind absteigend nach prio sortiert, damit nur der Bedarf mit der höchsten prio ausgewertet wird!
      # Nur Bedarfe checken, wenn für den Dienst und Tag noch kein Bedarf vorhanden ist
      if bedarf.end_date.present?
        if plan_date.full_date >= bedarf.end_date
          break
        end
      end
      #new
      #if no bedarfs_eintrag for that day and dienst:
      exists = @bedarfs_eintrag[date_id].key?(dienst_id)
      if exists
        exists = @bedarfs_eintrag[date_id][dienst_id].key?(bereich_id)
      end

      if !exists
        if @zeitraumkategorien[bedarf.zeitraumkategories_id].check_date(plan_date)
          if !@relevant_dienste[dienst_id]
              @relevant_dienste[dienst_id] = true
          end
          # might add multiple Entries since blocks are possible
          # make sure other dates get marked as well.
          # hand over already computed schichts etc
          res = dienstplanbedarf.addEintraegeFromBedarf(plan_date.full_date, bedarf, @tage_info[bedarf.arbeitszeitverteilung_id], @next_id)
          res[:added_days].each do |date|
            added_date_id = date.strftime("%Y-%m-%d")
            if @bedarfs_eintrag.key?(added_date_id)
              unless @bedarfs_eintrag[added_date_id].key?(dienst_id)
                @bedarfs_eintrag[added_date_id][dienst_id] = {}
              end

              unless @bedarfs_eintrag[added_date_id][dienst_id].key?(bereich_id)
                @bedarfs_eintrag[added_date_id][dienst_id][bereich_id] = true
              end
            end
          end
          @next_id = res[:next_id]
          @neue_schichten +=res[:schichten]
          @neue_bedarfseintraege += res[:bedarfs_eintraege]
        end
      end
    end
  end

  def self.einteilung_valid_day(tag)
    einteilung_tag = Date.strptime(tag, '%Y-%m-%d')
    today = Date.today.at_beginning_of_month
    # Nur Einteilungen für den aktuellen Monat oder größer erstellen
    result = nil
    ignore = "#{ENV["IGNORE_EINTEILUNG_VALID_DAY"]}"
    puts "Ignore: #{ignore}"
    if ignore != "true" && einteilung_tag < today
      result = {info: "Einteilung bearbeiten nicht möglich. (#{einteilung_tag} < #{today})"}
    end
    result
  end

  def einteilung(
    is_dienstplaner,
    is_urlaubsplaner,
    teams,
    id,
    mitarbeiter_id,
    dienst_id,
    bereich_id,
    tag,
    schichtnr,
    arbeitsplatz_id,
    status,
    info_comment = "",
    context_comment = "",
    kontext = 5,
    is_optional = false,
    broadcast = false
  )
    einteilungsstatus = Einteilungsstatus.find_by(id: status)
    if einteilungsstatus.nil? || !einteilungsstatus.waehlbar
      einteilungsstatus = Einteilungsstatus.vorschlag_status
    end
    einteilung = Dienstplan.einteilung_valid_day(tag)
    if einteilung.nil?
      dienst = PoDienst.find_by(id: dienst_id)
      mitarbeiter = Mitarbeiter.find_by(id: mitarbeiter_id)
      # Einteilungen nur für Dienste, welche existieren
      if dienst.nil?
        einteilung = {info: "Es gab Probleme mit dem Dienst (#{dienst_id})."}
      # Einteilungen nur für Mitarbeiter, welche existieren
      elsif mitarbeiter.nil?
        einteilung = {info: "Es gab Probleme mit der Mitarbeiterin (#{mitarbeiter_id})."}
      else
        einteilung = Diensteinteilung.includes(:einteilungsstatus).find_by(id: id)
        can = is_einteilung_authorized(is_dienstplaner, is_urlaubsplaner, mitarbeiter, tag, teams, dienst)
        if can
          if einteilung.nil?
            einteilung = create_or_update_einteilung(
              mitarbeiter_id,
              dienst_id,
              bereich_id,
              tag,
              schichtnr,
              arbeitsplatz_id,
              einteilungsstatus,
              context_comment,
              info_comment,
              kontext,
              is_optional,
              broadcast
            )
          else
            can = is_einteilung_authorized(is_dienstplaner, is_urlaubsplaner, einteilung.mitarbeiter, tag, teams, dienst)
            valid = can || einteilung.einteilungsstatus_id == Einteilungsstatus.aufgehoben_status.id
            if valid
              einteilung.update!(
                mitarbeiter_id: mitarbeiter_id,
                arbeitsplatz_id: arbeitsplatz_id,
                bereich_id: bereich_id,
                schicht_nummern: schichtnr,
                einteilungsstatus_id: einteilungsstatus.id,
                einteilungskontext_id: kontext,
                info_comment: info_comment,
                context_comment: context_comment,
                is_optional: is_optional
              )
              if broadcast
                Dienstplan.broadcast_einteilungen(einteilung)
              end
            else
              einteilung = {info: "Das Überschreiben der Einteilung (#{id}) ist dir nicht erlaubt!"}
            end
          end
        else
          einteilung = {info: "Das Erstellen der Einteilung (#{id}) ist dir nicht erlaubt!"}
        end
      end
    end
    if einteilung.class == Hash
      einteilung[:old_einteilung] = load_old_einteilung(id, tag, dienst_id)
    end
    einteilung
  end

  # Einteilungen aus dem Dienstplan zu gültigen Einteilungen setzen
  def publish(vorlage, teams, is_dienstplaner = false, is_urlaubsplaner = false, dates = nil)
    # Vorschläge holen und Einteilungsstatus ändern
    public_status = Einteilungsstatus.public_status
    res = {einteilungen: false, info: "Keine Einteilungen vorgenommen!"}
    # res[:deaktiviert] = true
    # res[:info] = "Einteilungen werden aktuell nicht in den Mitarbeiter-Kalender geschrieben."
    # res[:info] << "\nWir entschuldigen uns um die Unannehmlichkeiten und bitten um Geduld, bis das Problem gelöst ist."
    # res[:info] << "\nBitte informieren Sie die Mitarbeiter, dass sie sich an der PDF orientieren sollen, bis das Problem behoben wurde."
    # return res
    if !(is_urlaubsplaner || is_dienstplaner)
      res[:info] = "Keine Berechtigung für diese Aktion."
    elsif public_status.nil?
      res[:info] = "Public Einteilungsstatus nicht gefunden."
    elsif vorlage.nil?
      res[:info] = "Vorlage nicht gefunden."
    else
      # today = Date.today.at_beginning_of_month
      plantime = check_anfang_ende()
      ende = plantime[:ende]
      anfang = plantime[:anfang]
      today = anfang
      funktionen_ids = vorlage.funktionen_ids
      tage = dates.nil? ? (anfang..ende) : dates
      # Nicht öffentliche Einteilungen aus dem Dienstplan oder counts im Zeitraum des Dienstplans.
      # Dienste aus der Vorlage.
      # Mitarbeiter mit der passenden Funktion und im Vorlage-Team.
      # Urlaubsplaner -> nur Einteilungen mit frei_eintragbar = true
      # Dienstplaner -> Dienst dpl_all_teams, alle Mitarbeiter erlaubt
      # Dienstplaner -> Dienst mit erlaubtem Team, alle Mitarbeiter erlaubt
      # Dienstplaner -> frei_eintragbar und Mitarbeiter im Team des Planers erlaubt
      check_team = Dienstplan::CHECK_TEAM_QUERY
      vorlage_team_id = vorlage.team_id
      res[:einteilungen] = Diensteinteilung.joins(:po_dienst, :einteilungsstatus, mitarbeiter: [:funktion])
        .left_outer_joins(mitarbeiter: [einteilung_rotations: [kontingent: [:team]]])
        .includes(:einteilungsstatus, :mitarbeiter, :po_dienst)
        .where("diensteinteilungs.tag >= ? AND diensteinteilungs.tag >= ? AND diensteinteilungs.tag <= ?", today, anfang, ende)
        .where(tag: tage)
        .where("((diensteinteilungs.dienstplan_id = ? AND einteilungsstatuses.vorschlag = TRUE) OR einteilungsstatuses.counts = TRUE)", self[:id])
        .where("einteilungsstatuses.public = FALSE")
        .where(po_dienst_id: vorlage.dienste)
        .where("mitarbeiters.platzhalter = FALSE AND mitarbeiters.funktion_id IN(?)", funktionen_ids)
        .where("
            ? IS TRUE OR #{check_team}
          ",
          vorlage_team_id.nil?,
          vorlage_team_id,
          vorlage_team_id,
          vorlage_team_id,
          anfang, anfang,
          ende, ende,
          anfang, ende,
          vorlage_team_id
        ).where("
            (po_diensts.frei_eintragbar IS TRUE AND (? IS TRUE OR #{check_team}))
            OR (po_diensts.dpl_all_teams IS TRUE OR po_diensts.team_id IN (?))
          ",
          is_urlaubsplaner,
          teams,
          teams,
          teams,
          anfang, anfang,
          ende, ende,
          anfang, ende,
          teams,
          teams
        ).order(
          tag: :asc,
          po_dienst_id: :asc,
          bereich_id: :asc,
          updated_at: :asc
        )

      if res[:einteilungen].present?
        res[:einteilungen].update({einteilungsstatus_id: public_status.id})
        info = res[:einteilungen].map.with_index{ |e, i| "#{i % 5 == 0 ? "\n" : ""}#{e.tag} #{e.mitarbeiter.planname} #{e.po_dienst.planname}"}
        res[:info] = "Einteilungen (DPL-ID #{self[:id]}):\nAnzahl: #{res[:einteilungen].size}\n#{info.join(", ")}.\n"
        Dienstplan.broadcast_einteilungen(res[:einteilungen])
      end
    end
    puts "Dienstplan publish Info: #{res[:info]}"
    res
  end

  def self.add_einteilungen_by_dienstplan_key(einteilungen_hash, einteilung)
    key = einteilung.dienstplan_key
    unless einteilungen_hash.has_key?(key)
      # Lädt alle Einteilungen Vorschlag und Counts zu dem Bereich, Tag und Dienst
      einteilungen_hash[key] = Dienstplan.load_einteilungen_by_einteilung(einteilung).to_a
    end
    nil_key = einteilung.bereich_nil_dienstplan_key
    unless einteilungen_hash.has_key?(nil_key)
      # Lädt alle Einteilungen Vorschlag und Counts zu dem Bereich (nil), Tag und Dienst
      # Kopiert Einteilung und setzt Bereich auf nil
      nil_einteilung = Diensteinteilung.new(einteilung.attributes)
      nil_einteilung.bereich_id = nil
      einteilungen_hash[nil_key] = Dienstplan.load_einteilungen_by_einteilung(nil_einteilung).to_a
    end
  end

  def self.broadcast_einteilungen(einteilungen)
    unless einteilungen.respond_to?(:each)
      einteilungen = [einteilungen]
    end
    results = {:einteilungen => {}}
    aw_result = {
      :einteilungen_aw => [],
      :mitarbeiter_ids => [],
      :von => nil,
      :bis => nil
    }
    # Einteilungen mit bereich_id = nil sind für alle Bereiche und werden von jedem Bereich separat geladen
    einteilungen.each do |e|
      unless e[:id].nil?
        unless aw_result[:mitarbeiter_ids].include?(e[:mitarbeiter_id])
          aw_result[:mitarbeiter_ids] << e[:mitarbeiter_id]
        end
        if aw_result[:von].nil? || e[:tag] < aw_result[:von]
          aw_result[:von] = e[:tag]
        end
        if aw_result[:bis].nil? || e[:tag] > aw_result[:bis]
          aw_result[:bis] = e[:tag]
        end
        Dienstplan.add_einteilungen_by_dienstplan_key(results[:einteilungen], e)
      end
    end

    ActionCable.server.broadcast(AppChannel::ROOM_NAME, results)
    if aw_result[:von].present? && aw_result[:bis].present? && aw_result[:mitarbeiter_ids].present?
      aw_result[:einteilungen_aw] = Diensteinteilung.ohne_bedarf(aw_result[:von], aw_result[:bis], true, true, nil, aw_result[:mitarbeiter_ids])
      ActionCable.server.broadcast(AppChannel::ROOM_NAME, aw_result)
    end
  end

  def self.broadcast_wunsch(wunsch)
    msg = {
      wunsch: wunsch.as_json(:methods => [:remove_wunsch]),
      remove_wunsch: wunsch.remove_wunsch
    }
    ActionCable.server.broadcast(AppChannel::ROOM_NAME, msg)
  end

  def self.broadcast_freigabe(freigabe)
    unless freigabe.mitarbeiter.platzhalter
      msg = {
        freigabe: freigabe,
        freigabetypen_dienste_ids: freigabe.freigabetyp.dienste_ids
      }
      ActionCable.server.broadcast(AppChannel::ROOM_NAME, msg)
    end
  end

  def self.broadcast_rotation(rotation)
    unless rotation.mitarbeiter.platzhalter
      add = EinteilungRotation.find_by(id: rotation.id)
      vk_team_overview = {}
      if rotation.von.present? && rotation.bis.present?
        vk_team_overview = Mitarbeiter.get_vk_team_overview(rotation.von.to_s, rotation.bis.to_s)
      end
      msg = {rotation: rotation, addRotation: !!add, vk_team_overview: vk_team_overview}
      ActionCable.server.broadcast(AppChannel::ROOM_NAME, msg)
    end
  end

  def self.load_einteilungen_by_einteilung(einteilung)
    Diensteinteilung.joins(:einteilungsstatus, :mitarbeiter)
      .includes(:einteilungsstatus)
      .where(tag: einteilung.tag, po_dienst_id: einteilung.po_dienst_id, bereich_id: einteilung.bereich_id)
      .where("(einteilungsstatuses.vorschlag = TRUE OR einteilungsstatuses.counts = TRUE)")
      .where(:mitarbeiters => { platzhalter: false})
      .order("diensteinteilungs.bereich_id ASC, diensteinteilungs.updated_at ASC")
  end

  private
    def load_old_einteilung(id, tag, po_dienst_id)
      einteilungen = Diensteinteilung.joins(:einteilungsstatus, :mitarbeiter)
      .includes(:einteilungsstatus)
      .where(tag: tag, po_dienst_id: po_dienst_id, id: id)
      .where("(diensteinteilungs.dienstplan_id = ? OR einteilungsstatuses.counts)", self[:id])
      .where(:mitarbeiters => { platzhalter: false}).limit(1)
      if einteilungen.present?
        einteilungen.first
      else
        nil
      end
    end

    def compute_einteilung(einteilung)
      bereich_id = 0
      date_id = einteilung.date_id
      if @dates[date_id].einteilungen.key?(einteilung.dienstplan_id)
        @dates[date_id].einteilungen[einteilung.dienstplan_id] << einteilung.id
      else
        @dates[date_id].einteilungen[einteilung.dienstplan_id] = [einteilung.id]
      end
      if einteilung.bereich_id
        bereich_id = einteilung.bereich_id
      end
      el = create_date_dienst_bereich(@dates[date_id], einteilung.po_dienst_id, bereich_id, 0)
      if el.has_key?(:einteilungen)
        el[:einteilungen] << einteilung.id
      end
    end

    def get_int(value)
      Integer(value) rescue -1
    end

    def get_mitarbeiter_ids(anfang, ende, funktionen, kontingente)
      EinteilungRotation.rotationen_in(anfang, ende)
        .where(mitarbeiter_id: Mitarbeiter.where(funktion_id: funktionen))
        .where(kontingent_id: kontingente)
        .pluck(:mitarbeiter_id).uniq
    end

    def is_einteilung_authorized(is_dienstplaner, is_urlaubsplaner, mitarbeiter, tag, teams, dienst)
      frei_eintragbar = dienst.frei_eintragbar
      # Urlaubsplaner können alle Mitarbeiter bei frei_eintragbaren Diensten einteilen
      # Dienstplaner können nur Mitarbeiter ihres eigenen Teams bei frei_eintragbaren Diensten einteilen
      # Nur Dienstplaner dürfen nicht frei_eintragbare Dienste einteilen und nur, wenn die Dienste zu ihrem Team gehören
      mitarbeiter_is_in_teams = is_dienstplaner && mitarbeiter.is_in_team_am(tag, teams)
      urlaubsplandienste = frei_eintragbar && (is_urlaubsplaner || mitarbeiter_is_in_teams)
      dienstplandienste = !frei_eintragbar && is_dienstplaner && (dienst.dpl_all_teams || teams.include?(dienst.team_id))
      can = urlaubsplandienste || dienstplandienste
      can
    end

    def create_or_update_einteilung(
      mitarbeiter_id,
      dienst_id,
      bereich_id,
      tag,
      schichtnr,
      arbeitsplatz_id,
      status,
      context_comment = "",
      info_comment = "",
      kontext = 5,
      is_optional = false,
      broadcast = false
    )
      # Sucht eine Einteilung aus dem aktuellen Plan
      # oder wenn der Status auf counts oder public steht,
      # wird eine Einteilung aus einem anderen Plan gesucht
      is_public_or_counts = !!status.counts || !!status.public
      einteilungen = Diensteinteilung.joins(:einteilungsstatus)
        .includes(:einteilungsstatus).where(
          mitarbeiter_id: mitarbeiter_id,
          arbeitsplatz_id: arbeitsplatz_id,
          schicht_nummern: schichtnr,
          po_dienst_id: dienst_id,
          tag: tag,
          bereich_id: bereich_id
        ).where("(
            diensteinteilungs.dienstplan_id = ?
          ) OR (
            diensteinteilungs.dienstplan_id != ?
            AND einteilungsstatuses.vorschlag = FALSE
            AND ?
          )", self.id, self.id, is_public_or_counts)
        .order("einteilungsstatuses.public DESC
          , einteilungsstatuses.counts DESC
          , einteilungsstatuses.vorschlag DESC")
        .limit(1)
      if einteilungen.present?
        einteilung = einteilungen.first
        einteilung.update!(
          einteilungsstatus_id: status.id,
          einteilungskontext_id: kontext,
          arbeitsplatz_id: arbeitsplatz_id,
          info_comment: info_comment,
          context_comment: context_comment,
          is_optional: is_optional
        )
      else
        einteilung = Diensteinteilung.create!(
          dienstplan_id: self.id,
          mitarbeiter_id: mitarbeiter_id,
          arbeitsplatz_id: arbeitsplatz_id,
          schicht_nummern: schichtnr,
          po_dienst_id: dienst_id,
          bereich_id: bereich_id === 0 ? nil : bereich_id,
          tag: tag,
          einteilungsstatus_id: status.id,
          einteilungskontext_id: kontext,
          info_comment: info_comment,
          context_comment: context_comment,
          is_optional: is_optional
        )
      end
      if broadcast
        Dienstplan.broadcast_einteilungen(einteilung)
      end
      einteilung
    end

    def broadcast_bedarfe_update
      msg = {bedarfe_update: true}
      ActionCable.server.broadcast(AppChannel::ROOM_NAME, msg)
    end
end
`;

const apidData = `

  def react_api_model_data
    user = is_dienst_urlaubs_planer
    is_admin = user[:is_admin]
    is_dienstplaner = user[:is_dienstplaner]
    if can_use(true, true, true)
      res = {}

      res[:arbeitsplaetze] = hash_by_key(Arbeitsplatz.all)
      res[:bereiche] = hash_by_key(Bereich.all.as_json(:methods => [:converted_planname]), "id")
      res[:standorte] = hash_by_key(Standort.all)
      res[:dienstgruppen] = hash_by_key(Dienstgruppe.all)
      res[:dienstverteilungstypen] = hash_by_key(Dienstverteilungstyp.all)
      res[:kostenstellen] = hash_by_key(Kostenstelle.all)
      res[:funktionen] = hash_by_key(Funktion.all)
      res[:themen] = hash_by_key(Thema.all)
      res[:teams] = hash_by_key(Team.includes(:team_funktions, :po_diensts, :kontingents, :team_kw_krankpuffers).all
      .as_json(:methods => [:funktionen_ids, :dienste_ids, :kontingente_ids, :team_kw_krankpuffers]), "id")
      res[:freigabetypen] = hash_by_key(Freigabetyp.all)
      res[:freigabestatuse] = hash_by_key(Freigabestatus.all)
      res[:einteilungsstatuse] = hash_by_key(Einteilungsstatus.all)
      res[:einteilungskontexte] = hash_by_key(Einteilungskontext.all)
      dpl = Dienstplan.first
      unless dpl.nil?
        res[:dienstplanpfade] = {}
        res[:publicvorlagen] = {}
        res[:monatsplan_ansichten] = Vorlage::ANSICHTEN
        # Admins bekommen die allgemeinen Vorlagen als ihre Vorlagen und Dienstplaner als default_vorlagen
        if is_admin
          res[:dienstplanpfade] = hash_by_key(DienstplanPath.all)
        elsif is_dienstplaner
          res[:publicvorlagen] = get_dienstplaner_vorlagen
        end
        res[:monatsplanung_settings] = get_monatsplanung_settings(user)
        res[:MAX_RATING] = Dienstplan::MAX_RATING
        res[:MAX_WOCHENENDEN] = Dienstplan::MAX_WOCHENENDEN
        @vertraege_ids = []
        @vertragstypen = []
        @vertragstyp_varianten = {}
        res[:vertraege] = hash_by_key(Vertrag.joins(:mitarbeiter)
          .where(:mitarbeiters => { platzhalter: false})
        ) { |vertrag|
          @vertraege_ids << vertrag.id
          unless @vertragstypen.include?(vertrag.vertragstyp_id)
            @vertragstypen << vertrag.vertragstyp_id
          end
        }
        res[:vertragsvarianten] = hash_by_key(VertragsVariante.where(vertragstyp_id: @vertragstypen).order(bis: :desc)) { |variante|
          unless @vertragstyp_varianten.has_key?(variante.vertragstyp_id)
            @vertragstyp_varianten[variante.vertragstyp_id] = []
          end
          @vertragstyp_varianten[variante.vertragstyp_id] << variante.id
        }
        res[:vertragsphasen] = hash_by_key(VertragsPhase.where(vertrag_id: @vertraege_ids))
        res[:vertragstyp_varianten] = @vertragstyp_varianten
        res[:arbeitszeit_absprachen] = matrix_by_key(ArbeitszeitAbsprachen
          .joins(:mitarbeiter)
          .includes(:vertrags_phase, :zeitraumkategorie)
          .where(mitarbeiters: { platzhalter: false })
          .order(mitarbeiter_id: :asc, von: :desc, bis: :desc)
          .as_json({:except => [
            :arbeitszeit_von, :arbeitszeit_bis
          ], :methods => [
            :anfang, :ende, :arbeitszeit_von_time, :arbeitszeit_bis_time
          ]}), "mitarbeiter_id")
        res[:nicht_einteilen_absprachen] = matrix_by_key(NichtEinteilenAbsprachen
          .joins(:mitarbeiter)
          .includes(:vertrags_phase, :zeitraumkategorie, :nicht_einteilen_standort_themens)
          .where(mitarbeiters: { platzhalter: false })
          .order(mitarbeiter_id: :asc, von: :desc, bis: :desc)
          .as_json({:include => [
            :nicht_einteilen_standort_themens
          ], :methods => [
            :anfang, :ende
          ]}), "mitarbeiter_id")

        dpl.get_basic_api_data
        res[:arbeitszeittypen] = dpl.arbeitszeittypen
        res[:arbeitszeitverteilungen] = dpl.arbeitszeitverteilungen
        res[:po_dienste] = dpl.dienste.as_json(:methods => [:converted_planname, :rating_ids, :bedarf_ids])
        res[:dienstkategorien] = dpl.dienstkategorien.as_json(:methods => [:thema_ids])
        res[:freigaben] = dpl.freigaben
        res[:kontingente] = dpl.kontingente.as_json(:include => [:kontingent_po_dienst])
        res[:ratings] = dpl.ratings
        res[:mitarbeiters] = dpl.mitarbeiter.as_json(:include => {
          :accountInfo => {:only => [:dienstTelefon]}
        }, :methods => [:rating_ids, :freigaben_ids, :freigabetypen_ids, :vertrag_ids, :vertragphasen_ids])
        res[:themen] = dpl.themen
        res[:zeitraumkategorien] = dpl.zeitraumkategorien
      end
      # respond_with(Oj.dump(res, mode: :compat, time_format: :ruby, use_to_json: true))
      respond_with(res.to_json)
    else
      head :unauthorized
    end
  end
`;
