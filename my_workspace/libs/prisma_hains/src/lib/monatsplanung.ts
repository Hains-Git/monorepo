const railsClass = `
class Dienstplan < ApplicationRecord

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

  def is_date(d)
    if d.respond_to?(:strftime)
      return true
    end
    return false
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

  def load_basics(anfang_dpl, ende_dpl)
    check_dpb()
    load_dienste()
    load_bedarf()
    load_einteilungen()
  end

  def setup_parameters(status = nil)
    @log_status = status.nil? ? "Debug" : status
    # Ohne Time.zone = "UTC" werden die Schichten beim respond im controller als falsche Time.zone interpretiert
    Time.zone = "UTC"
    init_logger()
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

//
//     def self.von_tag(date)
//     w = Kalenderwoche.where("montag <= ? and sonntag >= ?", date, date).limit(1)
//     if w.present?
//         return w.first
//     else
//         kw = date.cweek
//         year = date.year
//         monday = Date.commercial(year, kw, 1)
//         friday = Date.commercial(year, kw, 5)
//         sunday = Date.commercial(year, kw, 7)
//         n_feiertage, n_arbeitstage = Feiertage.check_week(monday, sunday)
//         w = Kalenderwoche.create(
//         jahr: year, 
//         kw: kw, 
//         montag: monday, 
//         freitag: friday, 
//         sonntag: sunday, 
//         arbeitstage: n_arbeitstage, 
//         feiertage: n_feiertage
//         )
//         return w
//     end
// end


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

  def dienstplan_einteilungen()
    log("Loading Einteilungen")
    @einteilungen = hash_by_key(Diensteinteilung.joins(:einteilungsstatus, :mitarbeiter)
      .where("tag >= ? and tag <= ? and (dienstplan_id = ? or counts)", @window_anfang, @window_ende, self[:id])
      .where(:mitarbeiters => { platzhalter: false}))
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
