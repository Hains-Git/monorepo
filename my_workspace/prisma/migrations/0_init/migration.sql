-- CreateTable
CREATE TABLE "abwesentheiten_spaltens" (
    "id" SERIAL NOT NULL,
    "planname" VARCHAR,
    "name" VARCHAR,
    "beschreibung" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "po_dienst_id" INTEGER,

    CONSTRAINT "abwesentheiten_spaltens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abwesentheitenueberblick_counters" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "po_dienst_id" INTEGER,
    "planname" VARCHAR,
    "description" VARCHAR,
    "von" DATE,
    "bis" DATE,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "abwesentheitenueberblick_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abwesentheitenueberblick_settings" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "visible_columns" VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    "visible_team_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "mitarbeitersId" INTEGER,
    "data_sorting" VARCHAR DEFAULT '',

    CONSTRAINT "abwesentheitenueberblick_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abwesentheitenueberblicks" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "jahr" INTEGER,
    "ug" INTEGER DEFAULT 30,
    "u" INTEGER DEFAULT 30,
    "uv" INTEGER DEFAULT 0,
    "uz" INTEGER DEFAULT 0,
    "ru" INTEGER DEFAULT 0,
    "gu" INTEGER DEFAULT 0,
    "tzu" INTEGER DEFAULT 0,
    "fo_max" INTEGER DEFAULT 3,
    "fo" INTEGER DEFAULT 0,
    "dr" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "vu" INTEGER,
    "bu" INTEGER,

    CONSTRAINT "abwesentheitenueberblicks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_infos" (
    "id" SERIAL NOT NULL,
    "old_user_id" INTEGER,
    "comments" TEXT,
    "nameKurz" VARCHAR(255) DEFAULT '',
    "telephone" VARCHAR(255),
    "privateEmail" VARCHAR(255),
    "privateTelephone" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "anrede" VARCHAR,
    "titelPraefix" VARCHAR(20),
    "titelPostfix" VARCHAR(20),
    "vorname" VARCHAR DEFAULT '',
    "mittelname" VARCHAR,
    "nachname" VARCHAR DEFAULT '',
    "mobileTelefon" VARCHAR(16),
    "dienstEmail" VARCHAR(50),
    "dienstTelefon" VARCHAR(16),
    "adresseStrasse" VARCHAR(50),
    "adressePlz" VARCHAR(10),
    "adresseOrt" VARCHAR(30),
    "adresseLand" VARCHAR(30),
    "aktivAb" TIMESTAMP(6),
    "aktivBis" TIMESTAMP(6),
    "mitarbeiter_id" INTEGER,
    "user_id" INTEGER,
    "geburtsdatum" DATE,
    "teilzeit" VARCHAR,
    "funktion" VARCHAR,
    "vertragsbeginn_ukhd" VARCHAR,
    "vertragsende" VARCHAR,
    "geburtsort" VARCHAR DEFAULT '',
    "ueber_mich" VARCHAR,

    CONSTRAINT "account_infos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "active_admin_comments" (
    "id" SERIAL NOT NULL,
    "namespace" VARCHAR,
    "body" TEXT,
    "resource_type" VARCHAR,
    "resource_id" INTEGER,
    "author_type" VARCHAR,
    "author_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "active_admin_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "active_storage_attachments" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "record_type" VARCHAR NOT NULL,
    "record_id" INTEGER NOT NULL,
    "blob_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "active_storage_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "active_storage_blobs" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR NOT NULL,
    "filename" VARCHAR NOT NULL,
    "content_type" VARCHAR,
    "metadata" TEXT,
    "byte_size" BIGINT NOT NULL,
    "checksum" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "active_storage_blobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL DEFAULT '',
    "encrypted_password" VARCHAR NOT NULL DEFAULT '',
    "reset_password_token" VARCHAR(160),
    "reset_password_sent_at" TIMESTAMP(6),
    "remember_created_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allgemeine_vorlages" (
    "id" SERIAL NOT NULL,
    "vorlage_id" INTEGER,
    "dienstplan_path_id" INTEGER,
    "publishable" BOOLEAN DEFAULT false,
    "filepattern" VARCHAR DEFAULT '',
    "order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "pdf_zusatz_dienste" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "freitext" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "allgemeine_vorlages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antraege_histories" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "antraege_id" INTEGER,
    "antragsstatus_id" INTEGER,
    "weiteres" VARCHAR,
    "kommentar" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "antraege_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antraeges" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "antragstyp_id" INTEGER,
    "antragsstatus_id" INTEGER,
    "start" DATE,
    "ende" DATE,
    "abgesprochen" VARCHAR,
    "kommentar" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "antraeges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antragsstatuses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "color" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "antragsstatuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antragstyps" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "po_dienst_id" INTEGER,
    "we_holiday_po_dienst_id" INTEGER,
    "check_alternative_po_dienst_id" INTEGER,
    "alternative_po_dienst_id" INTEGER,

    CONSTRAINT "antragstyps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ar_internal_metadata" (
    "key" VARCHAR NOT NULL,
    "value" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "ar_internal_metadata_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "arbeitsplatzs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR DEFAULT '',
    "bereich_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "standort_id" INTEGER,

    CONSTRAINT "arbeitsplatzs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arbeitszeit_absprachens" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "zeitraumkategorie_id" INTEGER NOT NULL,
    "von" DATE,
    "bis" DATE,
    "arbeitszeit_von" TIME(6) NOT NULL,
    "arbeitszeit_bis" TIME(6) NOT NULL,
    "pause" INTEGER NOT NULL DEFAULT 0,
    "bemerkung" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "arbeitszeit_absprachens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arbeitszeittyps" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "beschreibung" VARCHAR,
    "sys" BOOLEAN DEFAULT false,
    "dienstzeit" BOOLEAN DEFAULT false,
    "arbeitszeit" BOOLEAN DEFAULT false,
    "count" BOOLEAN DEFAULT false,
    "max" INTEGER DEFAULT 0,
    "min" INTEGER DEFAULT 0,
    "bereitschaft" BOOLEAN DEFAULT false,
    "rufbereitschaft" BOOLEAN DEFAULT false,

    CONSTRAINT "arbeitszeittyps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arbeitszeitverteilungs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "dauer" INTEGER,
    "verteilung" TIME[],
    "zeittypen" INTEGER[],
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "std" DECIMAL(6,2) DEFAULT 0,
    "dienstgruppe_id" INTEGER,
    "pre_std" DECIMAL(6,2) DEFAULT 0,
    "pre_dienstgruppe_id" INTEGER,
    "pre_ueberschneidung_minuten" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "arbeitszeitverteilungs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automatische_einteilungens" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "po_dienst_id" INTEGER,
    "von" DATE,
    "bis" DATE,
    "zeitraumkategorie_id" INTEGER,
    "days" INTEGER DEFAULT 0,

    CONSTRAINT "automatische_einteilungens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bedarfs_eintrags" (
    "id" SERIAL NOT NULL,
    "tag" DATE,
    "dienstplanbedarf_id" INTEGER,
    "po_dienst_id" INTEGER,
    "dienstbedarf_id" INTEGER,
    "dienstverteilungstyp_id" INTEGER,
    "bereich_id" INTEGER,
    "verteilungscode" VARCHAR,
    "is_block" BOOLEAN DEFAULT false,
    "first_entry" INTEGER,
    "min" INTEGER DEFAULT 1,
    "opt" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "ausgleich_tage" INTEGER DEFAULT 0,
    "kostenstelle_id" INTEGER DEFAULT 2,

    CONSTRAINT "bedarfs_eintrags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benachrichtigungs" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "mitarbeiter_kommentar" VARCHAR,
    "hains_task_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "benachrichtigungs_status_id" INTEGER DEFAULT 1,
    "mitarbeiter_rating" INTEGER,

    CONSTRAINT "benachrichtigungs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benachrichtigungs_statuses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "color" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "benachrichtigungs_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benachrichtigungs_typs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "respond" BOOLEAN DEFAULT false,
    "status_optionen" INTEGER[],
    "comment" BOOLEAN DEFAULT false,
    "rate" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "color" VARCHAR,
    "stars" BOOLEAN DEFAULT false,

    CONSTRAINT "benachrichtigungs_typs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bereich_tagesverteilers" (
    "id" SERIAL NOT NULL,
    "tagesverteiler_id" INTEGER,
    "bereich_id" INTEGER,
    "po_dienst_id" INTEGER,
    "color" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "content_layout" VARCHAR DEFAULT 'one_col',

    CONSTRAINT "bereich_tagesverteilers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bereich_wochenverteilers" (
    "id" SERIAL NOT NULL,
    "bereich_id" INTEGER,
    "po_dienst_id" INTEGER,
    "color_bg" VARCHAR DEFAULT '#ffffff',
    "color_hl" VARCHAR DEFAULT '#ffffff',
    "order" INTEGER,
    "content_layout" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "bereich_wochenverteilers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bereiches" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "name_url" VARCHAR(255),
    "info" TEXT,
    "standort_id" INTEGER,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "planname" TEXT,
    "bereiches_id" INTEGER,
    "verteiler_frei" BOOLEAN DEFAULT false,

    CONSTRAINT "bereiches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_room_users" (
    "id" SERIAL NOT NULL,
    "channel_room_id" INTEGER,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "subscription" INTEGER NOT NULL DEFAULT 0,
    "chat" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "channel_room_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_rooms" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "channel_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "datei_typs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "datei_typs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dateis" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "beschreibung" VARCHAR,
    "ersteller_id" INTEGER,
    "besitzer_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "datei_typ_id" INTEGER,

    CONSTRAINT "dateis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstbedarves" (
    "id" SERIAL NOT NULL,
    "min" INTEGER,
    "po_dienst_id" INTEGER,
    "bereich_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "end_date" DATE,
    "dienstverteilungstyp_id" INTEGER,
    "verteilungscode" VARCHAR,
    "opt" INTEGER,
    "arbeitszeitverteilung_id" INTEGER,
    "zeitraumkategories_id" INTEGER,
    "kostenstelle_id" INTEGER DEFAULT 2,
    "ignore_in_urlaubssaldo" BOOLEAN DEFAULT false,

    CONSTRAINT "dienstbedarves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstbedarveshistory" (
    "id" SERIAL NOT NULL,
    "dienstbedarf_id" INTEGER,
    "min" INTEGER,
    "opt" INTEGER,
    "arbeitszeitverteilungs_id" INTEGER,

    CONSTRAINT "dienstbedarveshistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diensteinteilungs" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "einteilungsstatus_id" INTEGER,
    "po_dienst_id" INTEGER,
    "dienstplan_id" INTEGER,
    "reason" VARCHAR,
    "number" INTEGER,
    "tag" DATE,
    "einteilungskontext_id" INTEGER,
    "doppeldienst_id" INTEGER DEFAULT 0,
    "schicht_nummern" INTEGER[] DEFAULT ARRAY[0]::INTEGER[],
    "arbeitsplatz_id" INTEGER DEFAULT 1,
    "bereich_id" INTEGER,
    "context_comment" VARCHAR DEFAULT '',
    "info_comment" VARCHAR DEFAULT '',
    "is_optional" BOOLEAN DEFAULT false,

    CONSTRAINT "diensteinteilungs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diensteinteilungs_versions" (
    "id" SERIAL NOT NULL,
    "item_type" VARCHAR NOT NULL,
    "item_id" INTEGER NOT NULL,
    "event" VARCHAR NOT NULL,
    "whodunnit" VARCHAR,
    "object" TEXT,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "diensteinteilungs_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstfreigabe_versions" (
    "id" SERIAL NOT NULL,
    "item_type" VARCHAR NOT NULL,
    "item_id" INTEGER NOT NULL,
    "event" VARCHAR NOT NULL,
    "whodunnit" VARCHAR,
    "object" TEXT,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "dienstfreigabe_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstfreigabes" (
    "id" SERIAL NOT NULL,
    "freigabetyp_id" INTEGER,
    "mitarbeiter_id" INTEGER,
    "freigabestatus_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "user_id" INTEGER,
    "standort_id" INTEGER,

    CONSTRAINT "dienstfreigabes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstgruppes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "dienste" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "use_in_publish" BOOLEAN NOT NULL DEFAULT false,
    "publish_prio" INTEGER NOT NULL DEFAULT 0,
    "publish_label" VARCHAR NOT NULL DEFAULT '',
    "publish_color_bg" VARCHAR NOT NULL DEFAULT '#ffffff',
    "publish_color_hl" VARCHAR NOT NULL DEFAULT '#ffffff',

    CONSTRAINT "dienstgruppes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstkategorie_teams" (
    "id" SERIAL NOT NULL,
    "dienstkategorie_id" INTEGER,
    "team_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "dienstkategorie_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstkategories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "beschreibung" VARCHAR,
    "color" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "poppix_name" VARCHAR DEFAULT '',
    "selectable" BOOLEAN DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "mark" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "dienstkategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstkategoriethemas" (
    "id" SERIAL NOT NULL,
    "dienstkategorie_id" INTEGER,
    "thema_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "dienstkategoriethemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstplan_custom_counters" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR DEFAULT 'Zähler',
    "dienste_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "mitarbeiter_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "dienstplan_custom_feld_id" INTEGER,
    "beschreibung" TEXT DEFAULT '',
    "cell_id" VARCHAR DEFAULT '',
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "date_ids" VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    "colors" VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    "hidden" BOOLEAN DEFAULT false,
    "aktiv" BOOLEAN DEFAULT true,
    "inaktiv" BOOLEAN DEFAULT false,
    "currently_in_team" BOOLEAN DEFAULT true,
    "mit_bedarf" BOOLEAN DEFAULT true,
    "ohne_bedarf" BOOLEAN DEFAULT true,
    "act_as_funktion" BOOLEAN DEFAULT false,
    "evaluate_seperate" BOOLEAN DEFAULT false,
    "add_kein_mitarbeiterteam" BOOLEAN DEFAULT true,
    "count" VARCHAR DEFAULT 'Einteilungen',
    "funktion" VARCHAR DEFAULT '',
    "feiertage" VARCHAR DEFAULT 'auch',
    "mitarbeiterteam_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "mitarbeiterfunktionen_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "diensteteam_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "wochentage" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "empty_as_regeldienst" BOOLEAN DEFAULT false,

    CONSTRAINT "dienstplan_custom_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstplan_custom_felds" (
    "id" SERIAL NOT NULL,
    "ansicht_id" INTEGER DEFAULT 0,
    "vorlage_id" INTEGER,
    "row" BOOLEAN DEFAULT true,
    "index" INTEGER DEFAULT 0,
    "name" VARCHAR DEFAULT 'Neue Zeile',
    "count_all_typ" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "custom_counter_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "dienstplan_custom_felds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstplan_paths" (
    "id" SERIAL NOT NULL,
    "path" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "nr_intervall" INTEGER DEFAULT 0,
    "offset_to_now" INTEGER DEFAULT 0,
    "nr_versions" INTEGER DEFAULT 0,
    "plan_pattern" VARCHAR DEFAULT '',
    "planinterval_id" INTEGER,
    "plan_tab_id" INTEGER,
    "name" VARCHAR NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,
    "begin_on_monday" BOOLEAN DEFAULT false,
    "kalender_name" VARCHAR DEFAULT '',

    CONSTRAINT "dienstplan_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstplanbedarves" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "anfang" DATE,
    "ende" DATE,
    "dienste" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "dienstplanbedarves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstplaner_user_farbgruppens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "color" VARCHAR DEFAULT '#000000',
    "pos" INTEGER DEFAULT 1,
    "dienste_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "dienstkategorien_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "show" BOOLEAN DEFAULT true,

    CONSTRAINT "dienstplaner_user_farbgruppens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstplaner_user_settings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "abwesend" BOOLEAN DEFAULT true,
    "mehrfacheinteilung" BOOLEAN DEFAULT true,
    "ueberschneidung" BOOLEAN DEFAULT true,
    "wochenenden" BOOLEAN DEFAULT true,
    "arbeitszeittyp" BOOLEAN DEFAULT true,
    "freigaben" BOOLEAN DEFAULT true,
    "team" BOOLEAN DEFAULT true,
    "dienstgruppe" BOOLEAN DEFAULT true,
    "wuensche" BOOLEAN DEFAULT true,
    "only_vorlagedienste" BOOLEAN DEFAULT false,
    "dienstfarben" BOOLEAN DEFAULT true,
    "dientkategoriefarben" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "dienstplan_fontsize" DOUBLE PRECISION DEFAULT 0.7,
    "fordertdienstgruppe" BOOLEAN DEFAULT true,
    "predienstgruppe" BOOLEAN DEFAULT true,
    "standard_vorlage_id" INTEGER DEFAULT 0,
    "only_planungszeitraum" BOOLEAN DEFAULT false,
    "mark_einteilungsstatus" BOOLEAN DEFAULT true,
    "empty_as_regeldienst" BOOLEAN DEFAULT false,
    "mitarbeiter_sort" INTEGER DEFAULT 0,

    CONSTRAINT "dienstplaner_user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstplaners_teams" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "team_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "dienstplaners_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstplaners_verteiler_vorlagens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "vorlage_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "dienstplaners_verteiler_vorlagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstplans" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "parameterset_id" INTEGER,
    "anfang" DATE,
    "ende" DATE,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "beschreibung" VARCHAR,
    "dienstplanstatus_id" INTEGER,
    "sys" BOOLEAN DEFAULT false,
    "dienstplanbedarf_id" INTEGER,

    CONSTRAINT "dienstplans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstplanstatuses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "beschreibung" VARCHAR,
    "color" VARCHAR,
    "sys" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "dienstplanstatuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstratings" (
    "id" SERIAL NOT NULL,
    "po_dienst_id" INTEGER,
    "mitarbeiter_id" INTEGER,
    "rating" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "dienstratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diensts" (
    "id" SERIAL NOT NULL,
    "datum" TIMESTAMP(6),
    "dienstname" VARCHAR(255),
    "kommentar" TEXT,
    "mitarbeiter" VARCHAR(255),
    "user_id" INTEGER,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "diensts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstverteilungstyps" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "beschreibung" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "sys" BOOLEAN DEFAULT false,

    CONSTRAINT "dienstverteilungstyps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dienstwunsches" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "tag" DATE,
    "dienstkategorie_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "dienstwunsches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "einteilung_rotations" (
    "id" SERIAL NOT NULL,
    "kontingent_id" INTEGER,
    "mitarbeiter_id" INTEGER,
    "mitarbeiter_planname" VARCHAR,
    "prioritaet" INTEGER,
    "von" DATE,
    "bis" DATE,
    "kommentar" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "published" BOOLEAN,
    "published_by" VARCHAR,
    "published_at" TIMESTAMP(6),
    "position" INTEGER,

    CONSTRAINT "einteilung_rotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "einteilung_versions" (
    "id" SERIAL NOT NULL,
    "item_type" VARCHAR NOT NULL,
    "item_id" INTEGER NOT NULL,
    "event" VARCHAR NOT NULL,
    "whodunnit" VARCHAR,
    "object" TEXT,
    "created_at" TIMESTAMP(6),
    "object_changes" TEXT,
    "api_version" VARCHAR,
    "api_userinfo" VARCHAR,
    "userinfo" VARCHAR,
    "api_info" VARCHAR,

    CONSTRAINT "einteilung_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "einteilungskontexts" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "beschreibung" VARCHAR,
    "color" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "tagesverteiler" BOOLEAN DEFAULT false,
    "default" BOOLEAN DEFAULT false,

    CONSTRAINT "einteilungskontexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "einteilungsstatuses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "color" VARCHAR,
    "public" BOOLEAN DEFAULT false,
    "counts" BOOLEAN DEFAULT false,
    "sys" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "waehlbar" BOOLEAN NOT NULL DEFAULT false,
    "vorschlag" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "einteilungsstatuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feiertages" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "key" VARCHAR,
    "datum" DATE,
    "counts_every_year" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "jahr" INTEGER,
    "monat" INTEGER,
    "tag" INTEGER,

    CONSTRAINT "feiertages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freigabestatuses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "counts_active" BOOLEAN,
    "sys" BOOLEAN DEFAULT false,
    "color" VARCHAR,
    "beschreibung" VARCHAR,
    "qualifiziert" BOOLEAN,

    CONSTRAINT "freigabestatuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freigabetyps" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "planname" VARCHAR,
    "beschreibung" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "sort" INTEGER DEFAULT 0,

    CONSTRAINT "freigabetyps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freistellungs" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "mitarbeiter_planname" VARCHAR(255),
    "plandatum" TIMESTAMP(6),
    "einteilung" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "freistellungs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funktions" (
    "id" SERIAL NOT NULL,
    "planname" VARCHAR,
    "name" VARCHAR,
    "beschreibung" VARCHAR,
    "color" VARCHAR,
    "prio" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "team_id" INTEGER,

    CONSTRAINT "funktions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geraetebereiches" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "color" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "geraetebereiches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geraeteklasses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "color" VARCHAR,
    "beschreibung" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "geraeteklasses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geraetepasses" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "einweiser" VARCHAR,
    "einweisungsdatum" DATE,
    "geraet_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "herstellereinweisung" BOOLEAN DEFAULT false,
    "extern" BOOLEAN DEFAULT false,

    CONSTRAINT "geraetepasses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geraets" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "hersteller" VARCHAR,
    "typ" VARCHAR,
    "geraeteklasse_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "in_use" BOOLEAN DEFAULT true,
    "geraetebereich_ids" INTEGER[],

    CONSTRAINT "geraets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gruppes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "resource_id" INTEGER,
    "resource_type" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "gruppes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hains_tasks" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "beschreibung" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "als_popup" BOOLEAN,
    "gruppe_id" INTEGER,
    "mitarbeiter_ids" INTEGER[],
    "benachrichtigungs_typ_id" INTEGER,
    "send_notification" BOOLEAN DEFAULT false,
    "benachrichtigungs_text" TEXT,
    "benachrichtigungs_titel" VARCHAR,
    "send_counter" INTEGER DEFAULT 0,
    "public_results" BOOLEAN DEFAULT false,
    "alle_mitarbeiter" BOOLEAN DEFAULT false,
    "dienst_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "link" VARCHAR,
    "zeitraumkategorie_id" INTEGER,
    "wiederholen" BOOLEAN DEFAULT false,
    "funktions_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "last_day" DATE,
    "send_date" DATE,
    "send_time" TIMESTAMP(6),

    CONSTRAINT "hains_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jahresbilanzs" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "plusstunden" DECIMAL(6,2) DEFAULT 0,
    "ueberstunden" DECIMAL(6,2) DEFAULT 0,
    "urlaubstage" INTEGER DEFAULT 0,
    "krankstunden" DECIMAL(6,2) DEFAULT 0,
    "arbeitsstunden" DECIMAL(6,2) DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "jahresbilanzs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kalendermarkierungs" (
    "id" SERIAL NOT NULL,
    "category" VARCHAR,
    "name" VARCHAR,
    "color" VARCHAR,
    "year" INTEGER,
    "prio" INTEGER DEFAULT 1,
    "start" DATE,
    "ende" DATE,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "kalendermarkierungs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kalenderwoches" (
    "id" SERIAL NOT NULL,
    "jahr" INTEGER NOT NULL,
    "kw" INTEGER NOT NULL,
    "montag" DATE NOT NULL,
    "freitag" DATE NOT NULL,
    "sonntag" DATE NOT NULL,
    "arbeitstage" INTEGER DEFAULT 0,
    "feiertage" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "kalenderwoches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kontingent_po_diensts" (
    "id" SERIAL NOT NULL,
    "kontingent_id" INTEGER,
    "po_dienst_id" INTEGER,
    "eingeteilt_count_factor" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "magic_einteilung" BOOLEAN DEFAULT false,

    CONSTRAINT "kontingent_po_diensts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kontingents" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "kommentar" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "position" INTEGER,
    "kurzname" VARCHAR,
    "thema_ids" INTEGER[],
    "team_id" INTEGER DEFAULT 8,
    "default" BOOLEAN DEFAULT false,
    "sonderrotation" BOOLEAN DEFAULT false,
    "show_all_rotations" BOOLEAN DEFAULT false,

    CONSTRAINT "kontingents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kostenstelles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "nummer" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "kostenstelles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "beschreibung" VARCHAR,
    "url" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mailer_addresses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "addresse" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "mailer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mailer_ccs" (
    "id" SERIAL NOT NULL,
    "mailer_context_id" INTEGER,
    "mailer_addresse_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "mailer_ccs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mailer_contexts" (
    "id" SERIAL NOT NULL,
    "context" VARCHAR NOT NULL DEFAULT '',
    "subject" VARCHAR NOT NULL DEFAULT '',
    "body" TEXT NOT NULL DEFAULT '',
    "from_id" INTEGER,
    "reply_to_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "mailer_contexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mailer_tos" (
    "id" SERIAL NOT NULL,
    "mailer_context_id" INTEGER,
    "mailer_addresse_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "mailer_tos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merkmal_options" (
    "id" SERIAL NOT NULL,
    "merkmal_id" INTEGER,
    "wert" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "merkmal_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merkmals" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "beschreibung" VARCHAR,
    "can_edit" BOOLEAN,
    "typ" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "merkmals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mitarbeiter_default_eingeteilts" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "po_dienst_id" INTEGER,
    "year" INTEGER NOT NULL,
    "eingeteilt" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "mitarbeiter_default_eingeteilts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mitarbeitermerkmals" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "merkmal_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "wert" VARCHAR,
    "freitext" VARCHAR,

    CONSTRAINT "mitarbeitermerkmals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mitarbeiters" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) DEFAULT '',
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "planname" VARCHAR(255) DEFAULT '',
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "aktiv_von" TIMESTAMP(6),
    "aktiv_bis" TIMESTAMP(6),
    "platzhalter" BOOLEAN DEFAULT false,
    "a_seit" DATE,
    "anrechenbare_zeit" INTEGER DEFAULT 0,
    "zeit_kommentar" VARCHAR,
    "abwesend" BOOLEAN DEFAULT false,
    "pass_count" INTEGER DEFAULT 0,
    "funktion_id" INTEGER DEFAULT 6,
    "personalnummer" VARCHAR DEFAULT '',

    CONSTRAINT "mitarbeiters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nef_fahrts" (
    "id" SERIAL NOT NULL,
    "notfallmedizin_register_id" INTEGER,
    "fahrtnummer" INTEGER,
    "datum" DATE,
    "einsatznummer" BIGINT,
    "diagnose_therapie" VARCHAR,
    "notarzt" VARCHAR,
    "bemerkung" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "nef_fahrts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nicht_einteilen_absprachens" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER NOT NULL,
    "zeitraumkategorie_id" INTEGER NOT NULL,
    "von" DATE,
    "bis" DATE,

    CONSTRAINT "nicht_einteilen_absprachens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nicht_einteilen_standort_themen" (
    "id" SERIAL NOT NULL,
    "absprache_id" INTEGER NOT NULL,
    "standort_id" INTEGER NOT NULL,
    "thema_id" INTEGER NOT NULL,

    CONSTRAINT "nicht_einteilen_standort_themen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_categories" (
    "id" SERIAL NOT NULL,
    "category" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "note_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" SERIAL NOT NULL,
    "notiz" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "mitarbeiter_id" INTEGER,
    "ersteller_id" INTEGER,
    "private_note" BOOLEAN DEFAULT false,
    "title" VARCHAR,
    "note_category_id" INTEGER,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes_histories" (
    "id" SERIAL NOT NULL,
    "note_id" INTEGER,
    "mitarbeiter_id" INTEGER,
    "ersteller_id" INTEGER,
    "private_note" BOOLEAN,
    "notiz" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "notes_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notfallmedizin_registers" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "titel" VARCHAR DEFAULT '',
    "anrede" VARCHAR DEFAULT '',
    "nasim" BOOLEAN DEFAULT false,
    "fahrten" INTEGER DEFAULT 0,
    "arzt_seit" DATE,
    "geburtsdatum" DATE,
    "geburtsort" VARCHAR DEFAULT '',
    "personalnummer" INTEGER DEFAULT 0,
    "gespr_1" DATE,
    "gespr_2" DATE,
    "gespr_3" DATE,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "start" DATE DEFAULT CURRENT_DATE,
    "complete_144h" DATE,
    "freigabe_date" DATE,
    "pruefung" DATE,
    "hospitation" DATE,
    "notfallmedizin_status_id" INTEGER DEFAULT 1,
    "mails_send" BOOLEAN DEFAULT true,
    "aktiv" BOOLEAN DEFAULT true,

    CONSTRAINT "notfallmedizin_registers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notfallmedizin_statuses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "color" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "send_mitarbeiter_email" BOOLEAN,
    "send_verwaltung_email" BOOLEAN,
    "verwaltung_email" VARCHAR,
    "mitarbeiter_email_text" TEXT,
    "verwaltung_email_text" TEXT,
    "mitarbeiter_email_betreff" VARCHAR,
    "verwaltung_email_betreff" VARCHAR,
    "mitarbeiter_email_cc" VARCHAR[],
    "verwaltung_email_cc" VARCHAR[],

    CONSTRAINT "notfallmedizin_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_access_grants" (
    "id" SERIAL NOT NULL,
    "resource_owner_id" INTEGER NOT NULL,
    "application_id" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "redirect_uri" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "revoked_at" TIMESTAMP(6),
    "scopes" VARCHAR(255),

    CONSTRAINT "oauth_access_grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_access_tokens" (
    "id" SERIAL NOT NULL,
    "resource_owner_id" INTEGER,
    "application_id" INTEGER,
    "token" VARCHAR(255) NOT NULL,
    "refresh_token" VARCHAR(255),
    "expires_in" INTEGER,
    "revoked_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL,
    "scopes" VARCHAR(255),

    CONSTRAINT "oauth_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_access_tokens_new" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "client_id" VARCHAR(255) NOT NULL,
    "refresh_token_id" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "scopes" TEXT[],
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_access_tokens_new_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_applications" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "uid" VARCHAR(255) NOT NULL,
    "secret" VARCHAR(255) NOT NULL,
    "redirect_uri" TEXT NOT NULL,
    "scopes" VARCHAR(255) NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "confidential" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "oauth_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_authorization_codes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "client_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_authorization_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_clients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "client_id" VARCHAR(255) NOT NULL,
    "scopes" TEXT[],
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "client_secret" TEXT NOT NULL,

    CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_refresh_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "client_id" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "scopes" TEXT[],
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametersets" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "beschreibung" VARCHAR,
    "sys" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "email" VARCHAR NOT NULL DEFAULT '',
    "encrypted_password" VARCHAR NOT NULL DEFAULT '',
    "reset_password_token" VARCHAR,
    "reset_password_sent_at" TIMESTAMP(6),
    "remember_created_at" TIMESTAMP(6),

    CONSTRAINT "parametersets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_tabs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "plan_tabs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planintervals" (
    "id" SERIAL NOT NULL,
    "typ" VARCHAR DEFAULT '',

    CONSTRAINT "planintervals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planparameters" (
    "id" SERIAL NOT NULL,
    "parameterset_id" INTEGER,
    "num_threads" INTEGER,
    "relevant_timeframe_size" INTEGER,
    "einteilungsstatus_id" INTEGER,
    "default_rating" INTEGER,
    "debugging" BOOLEAN,
    "reuse_bedarf" BOOLEAN,
    "pref_weight" DOUBLE PRECISION,
    "rot_weight" DOUBLE PRECISION,
    "dist_weight" DOUBLE PRECISION,
    "use_overrides" BOOLEAN,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "wish_weight" DOUBLE PRECISION,

    CONSTRAINT "planparameters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "po_diensts" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "beschreibung" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "planname" TEXT,
    "color" VARCHAR,
    "freigabetypen_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "preset" BOOLEAN DEFAULT false,
    "sys" BOOLEAN DEFAULT false,
    "thema_ids" INTEGER[],
    "aufwand" INTEGER DEFAULT 0,
    "aneasy_name" VARCHAR DEFAULT '',
    "order" INTEGER DEFAULT 0,
    "priorisiere_wunsch" BOOLEAN DEFAULT false,
    "team_id" INTEGER DEFAULT 8,
    "kostenstelle_id" INTEGER DEFAULT 1,
    "stundennachweis_urlaub" BOOLEAN DEFAULT false,
    "stundennachweis_krank" BOOLEAN DEFAULT false,
    "stundennachweis_sonstig" BOOLEAN DEFAULT false,
    "stundennachweis_default_von" TIME(6) DEFAULT '00:00:00'::time without time zone,
    "stundennachweis_default_bis" TIME(6) DEFAULT '00:00:00'::time without time zone,
    "stundennachweis_default_std" DECIMAL(6,2) DEFAULT 0,
    "use_tagessaldo" BOOLEAN DEFAULT false,
    "frei_eintragbar" BOOLEAN DEFAULT false,
    "ignore_before" BOOLEAN DEFAULT false,
    "dpl_all_teams" BOOLEAN DEFAULT false,
    "oberarzt" BOOLEAN DEFAULT false,
    "weak_parallel_conflict" BOOLEAN NOT NULL DEFAULT false,
    "pep_name" VARCHAR NOT NULL DEFAULT '',
    "pep_color" VARCHAR NOT NULL DEFAULT '',

    CONSTRAINT "po_diensts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schema_migrations" (
    "version" VARCHAR NOT NULL,

    CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version")
);

-- CreateTable
CREATE TABLE "schichts" (
    "id" SERIAL NOT NULL,
    "bedarfs_eintrag_id" INTEGER,
    "anfang" TIMESTAMP(6),
    "ende" TIMESTAMP(6),
    "arbeitszeittyp_id" INTEGER,
    "schicht_nummer" INTEGER DEFAULT 1,
    "arbeitszeit" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "schichts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standorts" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "name_url" VARCHAR(255),
    "adresse" TEXT,
    "klinik_id" INTEGER,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "long" VARCHAR(10),
    "lat" VARCHAR(10),
    "planname" TEXT,
    "clinic" BOOLEAN DEFAULT true,
    "sys" BOOLEAN DEFAULT false,

    CONSTRAINT "standorts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stundennachweis" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "kostenstelle_id" INTEGER,
    "tag" DATE,
    "von" TIME(6),
    "bis" TIME(6),
    "std" DECIMAL(6,2),
    "bereitschaft" BOOLEAN DEFAULT false,
    "rufbereitschaft" BOOLEAN DEFAULT false,
    "inanspruchnahme" DECIMAL(6,2) DEFAULT 0,
    "krank" BOOLEAN DEFAULT false,
    "urlaub" BOOLEAN DEFAULT false,
    "sonst_fehltag" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "von_einteilung" INTEGER DEFAULT -1,
    "stundennachweis_status_id" INTEGER DEFAULT 1,
    "vollarbeit" BOOLEAN DEFAULT true,
    "pause" TIME(6) DEFAULT '00:00:00'::time without time zone,
    "rufbereitschaft_von" TIME[] DEFAULT '{00:00:00}'::time without time zone[],
    "rufbereitschaft_bis" TIME[] DEFAULT '{00:00:00}'::time without time zone[],
    "kommentar" VARCHAR DEFAULT '',

    CONSTRAINT "stundennachweis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stundennachweis_statuses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "confirmed" BOOLEAN,
    "submitted" BOOLEAN,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "stundennachweis_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tagesverteiler_layouts" (
    "id" SERIAL NOT NULL,
    "device" VARCHAR,
    "rows" INTEGER,
    "cols" INTEGER,
    "grid" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "verteiler_vorlagen_id" INTEGER,

    CONSTRAINT "tagesverteiler_layouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tagesverteiler_user_settings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "funktion_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "funktion_box" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "zoom" DOUBLE PRECISION DEFAULT 1.0,
    "bereiche" VARCHAR DEFAULT '',

    CONSTRAINT "tagesverteiler_user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tagesverteilers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "color" VARCHAR,
    "planname" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "tagesverteilers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tagkategories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "tagkategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_funktions" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER,
    "funktion_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "team_funktions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_kw_krankpuffer_versions" (
    "id" SERIAL NOT NULL,
    "item_type" VARCHAR NOT NULL,
    "item_id" INTEGER NOT NULL,
    "event" VARCHAR NOT NULL,
    "whodunnit" VARCHAR,
    "object" TEXT,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "team_kw_krankpuffer_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_kw_krankpuffers" (
    "id" SERIAL NOT NULL,
    "kw" INTEGER NOT NULL DEFAULT 0,
    "team_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "puffer" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "team_kw_krankpuffers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "kostenstelle_id" INTEGER DEFAULT 2,
    "default" BOOLEAN DEFAULT false,
    "krank_puffer" INTEGER NOT NULL DEFAULT 0,
    "verteiler_default" BOOLEAN DEFAULT false,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telefonlistes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "beschreibung" TEXT,
    "mitarbeiter" VARCHAR,
    "order" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "telefonlistes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themas" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "beschreibung" VARCHAR,
    "color" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "themas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_versions" (
    "id" SERIAL NOT NULL,
    "item_type" VARCHAR NOT NULL,
    "item_id" INTEGER NOT NULL,
    "event" VARCHAR NOT NULL,
    "whodunnit" VARCHAR,
    "object" TEXT,
    "api_version" VARCHAR,
    "api_userinfo" VARCHAR,
    "userinfo" VARCHAR,
    "api_info" VARCHAR,
    "object_changes" TEXT,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "user_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "uid" INTEGER,
    "login" VARCHAR(255),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "email" VARCHAR(255) NOT NULL DEFAULT '',
    "encrypted_password" VARCHAR(255) NOT NULL DEFAULT '',
    "reset_password_token" VARCHAR(255),
    "reset_password_sent_at" TIMESTAMP(6),
    "remember_created_at" TIMESTAMP(6),
    "sign_in_count" INTEGER NOT NULL DEFAULT 0,
    "current_sign_in_at" TIMESTAMP(6),
    "last_sign_in_at" TIMESTAMP(6),
    "current_sign_in_ip" VARCHAR(255),
    "last_sign_in_ip" VARCHAR(255),
    "confirmation_token" VARCHAR(255),
    "confirmed_at" TIMESTAMP(6),
    "confirmation_sent_at" TIMESTAMP(6),
    "unconfirmed_email" VARCHAR(255),
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "unlock_token" VARCHAR(255),
    "locked_at" TIMESTAMP(6),
    "admin" BOOLEAN DEFAULT false,
    "deactivated" BOOLEAN,
    "account_info_id" INTEGER,
    "otp_secret_key" VARCHAR,
    "otp_enabled" BOOLEAN DEFAULT false,
    "otp_counter" INTEGER DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_gruppes" (
    "user_id" INTEGER NOT NULL,
    "gruppe_id" INTEGER NOT NULL,

    CONSTRAINT "users_gruppes_pkey" PRIMARY KEY ("user_id","gruppe_id")
);

-- CreateTable
CREATE TABLE "version_associations" (
    "id" SERIAL NOT NULL,
    "version_id" INTEGER,
    "foreign_key_name" VARCHAR NOT NULL,
    "foreign_key_id" INTEGER,
    "foreign_type" VARCHAR,

    CONSTRAINT "version_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "versions" (
    "id" SERIAL NOT NULL,
    "item_type" VARCHAR NOT NULL,
    "item_id" INTEGER NOT NULL,
    "event" VARCHAR NOT NULL,
    "whodunnit" VARCHAR,
    "object" TEXT,
    "created_at" TIMESTAMP(6),
    "object_changes" TEXT,
    "transaction_id" INTEGER,

    CONSTRAINT "versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verteiler_tagesverteilers" (
    "id" SERIAL NOT NULL,
    "raw_json" TEXT,
    "datum" TIMESTAMP(6),
    "version" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "verteiler_tagesverteilers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verteiler_vorlagens" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL DEFAULT 'Vorlage',
    "beschreibung" VARCHAR NOT NULL DEFAULT '',
    "typ" VARCHAR NOT NULL DEFAULT 'wochenverteiler',
    "dienstplan_path_id" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "bereiche_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "dienste_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "team_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "kommentar" VARCHAR DEFAULT '',

    CONSTRAINT "verteiler_vorlagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verteilungsoverrides" (
    "id" SERIAL NOT NULL,
    "parameterset_id" INTEGER,
    "dienstbedarf_id" INTEGER,
    "dienstverteilungstyp_id" INTEGER,
    "verteilungscode" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "verteilungsoverrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vertrag_versions" (
    "id" BIGSERIAL NOT NULL,
    "item_type" VARCHAR NOT NULL,
    "item_id" INTEGER NOT NULL,
    "event" VARCHAR NOT NULL,
    "whodunnit" VARCHAR,
    "object" TEXT,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "vertrag_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vertrags" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "vertragstyp_id" INTEGER,
    "anfang" DATE,
    "ende" DATE,
    "unbefristet" BOOLEAN DEFAULT false,
    "kommentar" VARCHAR DEFAULT '',

    CONSTRAINT "vertrags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vertrags_arbeitszeits" (
    "id" BIGSERIAL NOT NULL,
    "vertrag_id" BIGINT,
    "von" DATE,
    "bis" DATE,
    "vk" DECIMAL(3,2),
    "tage_woche" DOUBLE PRECISION DEFAULT 5.0,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "vertrags_arbeitszeits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vertrags_phases" (
    "id" SERIAL NOT NULL,
    "vertrag_id" INTEGER,
    "von" DATE,
    "bis" DATE,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "vertragsstufe_id" BIGINT,

    CONSTRAINT "vertrags_phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vertrags_variantes" (
    "id" SERIAL NOT NULL,
    "von" DATE,
    "bis" DATE,
    "vertragstyp_id" INTEGER,
    "name" VARCHAR,
    "wochenstunden" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "tage_monat" DOUBLE PRECISION DEFAULT 2.5,

    CONSTRAINT "vertrags_variantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vertragsgruppes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "vertragstyp_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "vertragsgruppes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vertragsstuves" (
    "id" SERIAL NOT NULL,
    "stufe" INTEGER,
    "nach_jahren" INTEGER,
    "monatsgehalt" DECIMAL(15,2),
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "vertragsgruppe_id" INTEGER,
    "vertrags_variante_id" INTEGER,

    CONSTRAINT "vertragsstuves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vertragstyps" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "vertragstyps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vorlages" (
    "id" SERIAL NOT NULL,
    "mitarbeiter_id" INTEGER,
    "name" VARCHAR,
    "dienste" INTEGER[],
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "team_id" INTEGER,
    "funktionen_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "ansicht_id" INTEGER DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "vorlages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wochenbilanzs" (
    "id" SERIAL NOT NULL,
    "kalenderwoche_id" INTEGER,
    "mitarbeiter_id" INTEGER,
    "geplante_arbeitszeit" DECIMAL(6,2) DEFAULT 0,
    "geplante_rufbereitschaftszeit" DECIMAL(6,2) DEFAULT 0,
    "geplante_bereitschaftszeit" DECIMAL(6,2) DEFAULT 0,
    "wochensoll" DECIMAL(6,2) DEFAULT 0,
    "plusstunden" DECIMAL(6,2) DEFAULT 0,
    "ueberstunden" DECIMAL(6,2) DEFAULT 0,
    "urlaubstage" INTEGER DEFAULT 0,
    "krankstunden" DECIMAL(6,2) DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "wochenbilanzs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zeitraumkategories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "beschreibung" VARCHAR,
    "zeitraumregel_id" INTEGER,
    "prio" INTEGER,
    "anfang" DATE,
    "ende" DATE,
    "dauer" INTEGER,
    "regelcode" VARCHAR,
    "sys" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "zeitraumkategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zeitraumregels" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "beschreibung" VARCHAR,
    "sys" BOOLEAN DEFAULT false,

    CONSTRAINT "zeitraumregels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "index_abwesentheitenueberblick_counters_on_mitarbeiter_id" ON "abwesentheitenueberblick_counters"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_abwesentheitenueberblick_counters_on_po_dienst_id" ON "abwesentheitenueberblick_counters"("po_dienst_id");

-- CreateIndex
CREATE INDEX "index_abwesentheitenueberblick_settings_on_mitarbeiter_id" ON "abwesentheitenueberblick_settings"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_abwesentheitenueberblicks_on_mitarbeiter_id" ON "abwesentheitenueberblicks"("mitarbeiter_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_infos_user_id_key" ON "account_infos"("user_id");

-- CreateIndex
CREATE INDEX "index_account_infos_on_mitarbeiter_id" ON "account_infos"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_active_admin_comments_on_author_type_and_author_id" ON "active_admin_comments"("author_type", "author_id");

-- CreateIndex
CREATE INDEX "index_active_admin_comments_on_namespace" ON "active_admin_comments"("namespace");

-- CreateIndex
CREATE INDEX "index_active_admin_comments_on_resource_type_and_resource_id" ON "active_admin_comments"("resource_type", "resource_id");

-- CreateIndex
CREATE INDEX "index_active_storage_attachments_on_blob_id" ON "active_storage_attachments"("blob_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_active_storage_attachments_uniqueness" ON "active_storage_attachments"("record_type", "record_id", "name", "blob_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_active_storage_blobs_on_key" ON "active_storage_blobs"("key");

-- CreateIndex
CREATE UNIQUE INDEX "index_admin_users_on_email" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "index_admin_users_on_reset_password_token" ON "admin_users"("reset_password_token");

-- CreateIndex
CREATE INDEX "index_allgemeine_vorlages_on_dienstplan_path_id" ON "allgemeine_vorlages"("dienstplan_path_id");

-- CreateIndex
CREATE INDEX "index_allgemeine_vorlages_on_vorlage_id" ON "allgemeine_vorlages"("vorlage_id");

-- CreateIndex
CREATE INDEX "index_antraege_histories_on_antraege_id" ON "antraege_histories"("antraege_id");

-- CreateIndex
CREATE INDEX "index_antraege_histories_on_antragsstatus_id" ON "antraege_histories"("antragsstatus_id");

-- CreateIndex
CREATE INDEX "index_antraege_histories_on_mitarbeiter_id" ON "antraege_histories"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_antraeges_on_antragsstatus_id" ON "antraeges"("antragsstatus_id");

-- CreateIndex
CREATE INDEX "index_antraeges_on_antragstyp_id" ON "antraeges"("antragstyp_id");

-- CreateIndex
CREATE INDEX "index_antraeges_on_mitarbeiter_id" ON "antraeges"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_antragstyps_on_alternative_po_dienst_id" ON "antragstyps"("alternative_po_dienst_id");

-- CreateIndex
CREATE INDEX "index_antragstyps_on_check_alternative_po_dienst_id" ON "antragstyps"("check_alternative_po_dienst_id");

-- CreateIndex
CREATE INDEX "index_antragstyps_on_po_dienst_id" ON "antragstyps"("po_dienst_id");

-- CreateIndex
CREATE INDEX "index_antragstyps_on_we_holiday_po_dienst_id" ON "antragstyps"("we_holiday_po_dienst_id");

-- CreateIndex
CREATE INDEX "index_arbeitsplatzs_on_bereich_id" ON "arbeitsplatzs"("bereich_id");

-- CreateIndex
CREATE INDEX "index_arbeitsplatzs_on_standort_id" ON "arbeitsplatzs"("standort_id");

-- CreateIndex
CREATE INDEX "index_arbeitszeit_absprachens_on_mitarbeiter_id" ON "arbeitszeit_absprachens"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_arbeitszeit_absprachens_on_zeitraumkategorie_id" ON "arbeitszeit_absprachens"("zeitraumkategorie_id");

-- CreateIndex
CREATE INDEX "index_arbeitszeitverteilungs_on_dienstgruppe_id" ON "arbeitszeitverteilungs"("dienstgruppe_id");

-- CreateIndex
CREATE INDEX "index_arbeitszeitverteilungs_on_pre_dienstgruppe_id" ON "arbeitszeitverteilungs"("pre_dienstgruppe_id");

-- CreateIndex
CREATE INDEX "index_automatische_einteilungens_on_mitarbeiter_id" ON "automatische_einteilungens"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_automatische_einteilungens_on_po_dienst_id" ON "automatische_einteilungens"("po_dienst_id");

-- CreateIndex
CREATE INDEX "index_automatische_einteilungens_on_zeitraumkategorie_id" ON "automatische_einteilungens"("zeitraumkategorie_id");

-- CreateIndex
CREATE INDEX "index_bedarfs_eintrags_on_bereich_id" ON "bedarfs_eintrags"("bereich_id");

-- CreateIndex
CREATE INDEX "index_bedarfs_eintrags_on_dienstbedarf_id" ON "bedarfs_eintrags"("dienstbedarf_id");

-- CreateIndex
CREATE INDEX "index_bedarfs_eintrags_on_dienstplanbedarf_id" ON "bedarfs_eintrags"("dienstplanbedarf_id");

-- CreateIndex
CREATE INDEX "index_bedarfs_eintrags_on_dienstverteilungstyp_id" ON "bedarfs_eintrags"("dienstverteilungstyp_id");

-- CreateIndex
CREATE INDEX "index_bedarfs_eintrags_on_kostenstelle_id" ON "bedarfs_eintrags"("kostenstelle_id");

-- CreateIndex
CREATE INDEX "index_bedarfs_eintrags_on_po_dienst_id" ON "bedarfs_eintrags"("po_dienst_id");

-- CreateIndex
CREATE INDEX "index_benachrichtigungs_on_benachrichtigungs_status_id" ON "benachrichtigungs"("benachrichtigungs_status_id");

-- CreateIndex
CREATE INDEX "index_benachrichtigungs_on_mitarbeiter_id" ON "benachrichtigungs"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_bereich_tagesverteilers_on_bereich_id" ON "bereich_tagesverteilers"("bereich_id");

-- CreateIndex
CREATE INDEX "index_bereich_tagesverteilers_on_po_dienst_id" ON "bereich_tagesverteilers"("po_dienst_id");

-- CreateIndex
CREATE INDEX "index_bereich_tagesverteilers_on_tagesverteiler_id" ON "bereich_tagesverteilers"("tagesverteiler_id");

-- CreateIndex
CREATE INDEX "index_bereich_wochenverteilers_on_bereich_id" ON "bereich_wochenverteilers"("bereich_id");

-- CreateIndex
CREATE INDEX "index_bereich_wochenverteilers_on_po_dienst_id" ON "bereich_wochenverteilers"("po_dienst_id");

-- CreateIndex
CREATE INDEX "index_bereiches_on_bereiches_id" ON "bereiches"("bereiches_id");

-- CreateIndex
CREATE INDEX "index_channel_room_users_on_channel_room_id" ON "channel_room_users"("channel_room_id");

-- CreateIndex
CREATE INDEX "index_channel_room_users_on_user_id" ON "channel_room_users"("user_id");

-- CreateIndex
CREATE INDEX "index_dateis_on_besitzer_id" ON "dateis"("besitzer_id");

-- CreateIndex
CREATE INDEX "index_dateis_on_datei_typ_id" ON "dateis"("datei_typ_id");

-- CreateIndex
CREATE INDEX "index_dateis_on_ersteller_id" ON "dateis"("ersteller_id");

-- CreateIndex
CREATE INDEX "index_dienstbedarves_on_kostenstelle_id" ON "dienstbedarves"("kostenstelle_id");

-- CreateIndex
CREATE INDEX "index_dienstbedarves_on_zeitraumkategories_id" ON "dienstbedarves"("zeitraumkategories_id");

-- CreateIndex
CREATE INDEX "index_dienstbedarveshistory_on_arbeitszeitverteilungs_id" ON "dienstbedarveshistory"("arbeitszeitverteilungs_id");

-- CreateIndex
CREATE INDEX "index_dienstbedarveshistory_on_dienstbedarf_id" ON "dienstbedarveshistory"("dienstbedarf_id");

-- CreateIndex
CREATE INDEX "index_diensteinteilungs_on_bereich_id" ON "diensteinteilungs"("bereich_id");

-- CreateIndex
CREATE INDEX "index_diensteinteilungs_on_einteilungskontext_id" ON "diensteinteilungs"("einteilungskontext_id");

-- CreateIndex
CREATE INDEX "index_diensteinteilungs_on_mitarbeiter_id" ON "diensteinteilungs"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_diensteinteilungs_on_mitarbeiter_id_and_tag" ON "diensteinteilungs"("mitarbeiter_id", "tag");

-- CreateIndex
CREATE INDEX "index_diensteinteilungs_on_tag_and_mitarbeiter_id" ON "diensteinteilungs"("tag", "mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_diensteinteilungs_versions_on_item_type_and_item_id" ON "diensteinteilungs_versions"("item_type", "item_id");

-- CreateIndex
CREATE INDEX "index_dienstfreigabe_versions_on_item_type_and_item_id" ON "dienstfreigabe_versions"("item_type", "item_id");

-- CreateIndex
CREATE INDEX "index_dienstfreigabe_versions_on_whodunnit" ON "dienstfreigabe_versions"("whodunnit");

-- CreateIndex
CREATE INDEX "index_dienstfreigabes_on_freigabetyp_id" ON "dienstfreigabes"("freigabetyp_id");

-- CreateIndex
CREATE INDEX "index_dienstkategorie_teams_on_dienstkategorie_id" ON "dienstkategorie_teams"("dienstkategorie_id");

-- CreateIndex
CREATE INDEX "index_dienstkategorie_teams_on_team_id" ON "dienstkategorie_teams"("team_id");

-- CreateIndex
CREATE INDEX "index_dienstkategoriethemas_on_dienstkategorie_id" ON "dienstkategoriethemas"("dienstkategorie_id");

-- CreateIndex
CREATE INDEX "index_dienstkategoriethemas_on_thema_id" ON "dienstkategoriethemas"("thema_id");

-- CreateIndex
CREATE INDEX "index_dienstplan_custom_counters_on_dienstplan_custom_feld_id" ON "dienstplan_custom_counters"("dienstplan_custom_feld_id");

-- CreateIndex
CREATE INDEX "index_dienstplan_custom_felds_on_vorlage_id" ON "dienstplan_custom_felds"("vorlage_id");

-- CreateIndex
CREATE INDEX "index_dienstplan_paths_on_plan_tab_id" ON "dienstplan_paths"("plan_tab_id");

-- CreateIndex
CREATE INDEX "index_dienstplan_paths_on_planinterval_id" ON "dienstplan_paths"("planinterval_id");

-- CreateIndex
CREATE INDEX "index_dienstplaner_user_farbgruppens_on_user_id" ON "dienstplaner_user_farbgruppens"("user_id");

-- CreateIndex
CREATE INDEX "index_dienstplaner_user_settings_on_user_id" ON "dienstplaner_user_settings"("user_id");

-- CreateIndex
CREATE INDEX "index_dienstplaners_teams_on_team_id" ON "dienstplaners_teams"("team_id");

-- CreateIndex
CREATE INDEX "index_dienstplaners_teams_on_user_id" ON "dienstplaners_teams"("user_id");

-- CreateIndex
CREATE INDEX "index_dienstplaners_verteiler_vorlagens_on_user_id" ON "dienstplaners_verteiler_vorlagens"("user_id");

-- CreateIndex
CREATE INDEX "index_dienstplaners_verteiler_vorlagens_on_vorlage_id" ON "dienstplaners_verteiler_vorlagens"("vorlage_id");

-- CreateIndex
CREATE INDEX "index_dienstplans_on_dienstplanbedarf_id" ON "dienstplans"("dienstplanbedarf_id");

-- CreateIndex
CREATE INDEX "index_dienstplans_on_parameterset_id" ON "dienstplans"("parameterset_id");

-- CreateIndex
CREATE INDEX "index_dienstratings_on_mitarbeiter_id" ON "dienstratings"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_dienstratings_on_mitarbeiter_id_and_po_dienst_id" ON "dienstratings"("mitarbeiter_id", "po_dienst_id");

-- CreateIndex
CREATE INDEX "index_dienstratings_on_po_dienst_id" ON "dienstratings"("po_dienst_id");

-- CreateIndex
CREATE INDEX "index_dienstwunsches_on_dienstkategorie_id" ON "dienstwunsches"("dienstkategorie_id");

-- CreateIndex
CREATE INDEX "index_dienstwunsches_on_mitarbeiter_id" ON "dienstwunsches"("mitarbeiter_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_dienstwunsches_on_tag_and_mitarbeiter_id" ON "dienstwunsches"("tag", "mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_einteilung_versions_on_item_type_and_item_id" ON "einteilung_versions"("item_type", "item_id");

-- CreateIndex
CREATE INDEX "index_einteilung_versions_on_whodunnit" ON "einteilung_versions"("whodunnit");

-- CreateIndex
CREATE INDEX "by_mitarbeiter_datum" ON "freistellungs"("mitarbeiter_id", "plandatum");

-- CreateIndex
CREATE INDEX "index_funktions_on_team_id" ON "funktions"("team_id");

-- CreateIndex
CREATE INDEX "index_geraetepasses_on_geraet_id" ON "geraetepasses"("geraet_id");

-- CreateIndex
CREATE INDEX "index_geraetepasses_on_mitarbeiter_id" ON "geraetepasses"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_geraets_on_geraeteklasse_id" ON "geraets"("geraeteklasse_id");

-- CreateIndex
CREATE INDEX "index_gruppes_on_name" ON "gruppes"("name");

-- CreateIndex
CREATE INDEX "index_gruppes_on_name_and_resource_type_and_resource_id" ON "gruppes"("name", "resource_type", "resource_id");

-- CreateIndex
CREATE INDEX "index_hains_tasks_on_benachrichtigungs_typ_id" ON "hains_tasks"("benachrichtigungs_typ_id");

-- CreateIndex
CREATE INDEX "index_hains_tasks_on_zeitraumkategorie_id" ON "hains_tasks"("zeitraumkategorie_id");

-- CreateIndex
CREATE INDEX "index_jahresbilanzs_on_mitarbeiter_id" ON "jahresbilanzs"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_kontingent_po_diensts_on_kontingent_id" ON "kontingent_po_diensts"("kontingent_id");

-- CreateIndex
CREATE INDEX "index_kontingent_po_diensts_on_po_dienst_id" ON "kontingent_po_diensts"("po_dienst_id");

-- CreateIndex
CREATE INDEX "index_kontingents_on_team_id" ON "kontingents"("team_id");

-- CreateIndex
CREATE INDEX "index_mailer_ccs_on_mailer_addresse_id" ON "mailer_ccs"("mailer_addresse_id");

-- CreateIndex
CREATE INDEX "index_mailer_ccs_on_mailer_context_id" ON "mailer_ccs"("mailer_context_id");

-- CreateIndex
CREATE INDEX "index_mailer_contexts_on_from_id" ON "mailer_contexts"("from_id");

-- CreateIndex
CREATE INDEX "index_mailer_contexts_on_reply_to_id" ON "mailer_contexts"("reply_to_id");

-- CreateIndex
CREATE INDEX "index_mailer_tos_on_mailer_addresse_id" ON "mailer_tos"("mailer_addresse_id");

-- CreateIndex
CREATE INDEX "index_mailer_tos_on_mailer_context_id" ON "mailer_tos"("mailer_context_id");

-- CreateIndex
CREATE INDEX "index_merkmal_options_on_merkmal_id" ON "merkmal_options"("merkmal_id");

-- CreateIndex
CREATE INDEX "index_mitarbeiter_default_eingeteilts_on_mitarbeiter_id" ON "mitarbeiter_default_eingeteilts"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_mitarbeiter_default_eingeteilts_on_po_dienst_id" ON "mitarbeiter_default_eingeteilts"("po_dienst_id");

-- CreateIndex
CREATE INDEX "index_mitarbeitermerkmals_on_merkmal_id" ON "mitarbeitermerkmals"("merkmal_id");

-- CreateIndex
CREATE INDEX "index_mitarbeitermerkmals_on_mitarbeiter_id" ON "mitarbeitermerkmals"("mitarbeiter_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique planname" ON "mitarbeiters"("planname");

-- CreateIndex
CREATE INDEX "index_mitarbeiters_on_funktion_id" ON "mitarbeiters"("funktion_id");

-- CreateIndex
CREATE INDEX "index_nef_fahrts_on_notfallmedizin_register_id" ON "nef_fahrts"("notfallmedizin_register_id");

-- CreateIndex
CREATE INDEX "index_nicht_einteilen_absprachens_on_mitarbeiter_id" ON "nicht_einteilen_absprachens"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_nicht_einteilen_absprachens_on_zeitraumkategorie_id" ON "nicht_einteilen_absprachens"("zeitraumkategorie_id");

-- CreateIndex
CREATE INDEX "index_nicht_einteilen_standort_themen_on_absprache_id" ON "nicht_einteilen_standort_themen"("absprache_id");

-- CreateIndex
CREATE INDEX "index_nicht_einteilen_standort_themen_on_standort_id" ON "nicht_einteilen_standort_themen"("standort_id");

-- CreateIndex
CREATE INDEX "index_nicht_einteilen_standort_themen_on_thema_id" ON "nicht_einteilen_standort_themen"("thema_id");

-- CreateIndex
CREATE INDEX "index_notes_on_ersteller_id" ON "notes"("ersteller_id");

-- CreateIndex
CREATE INDEX "index_notes_on_mitarbeiter_id" ON "notes"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_notes_on_note_category_id" ON "notes"("note_category_id");

-- CreateIndex
CREATE INDEX "index_notes_histories_on_ersteller_id" ON "notes_histories"("ersteller_id");

-- CreateIndex
CREATE INDEX "index_notes_histories_on_mitarbeiter_id" ON "notes_histories"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_notes_histories_on_note_id" ON "notes_histories"("note_id");

-- CreateIndex
CREATE INDEX "index_notfallmedizin_registers_on_mitarbeiter_id" ON "notfallmedizin_registers"("mitarbeiter_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_oauth_access_grants_on_token" ON "oauth_access_grants"("token");

-- CreateIndex
CREATE UNIQUE INDEX "index_oauth_access_tokens_on_token" ON "oauth_access_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "index_oauth_access_tokens_on_refresh_token" ON "oauth_access_tokens"("refresh_token");

-- CreateIndex
CREATE INDEX "index_oauth_access_tokens_on_resource_owner_id" ON "oauth_access_tokens"("resource_owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_access_tokens_new_token_key" ON "oauth_access_tokens_new"("token");

-- CreateIndex
CREATE UNIQUE INDEX "index_oauth_applications_on_uid" ON "oauth_applications"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_authorization_codes_code_key" ON "oauth_authorization_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_clients_client_id_key" ON "oauth_clients"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_refresh_tokens_token_key" ON "oauth_refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "index_parametersets_on_email" ON "parametersets"("email");

-- CreateIndex
CREATE UNIQUE INDEX "index_parametersets_on_reset_password_token" ON "parametersets"("reset_password_token");

-- CreateIndex
CREATE INDEX "index_planparameters_on_einteilungsstatus_id" ON "planparameters"("einteilungsstatus_id");

-- CreateIndex
CREATE INDEX "index_planparameters_on_parameterset_id" ON "planparameters"("parameterset_id");

-- CreateIndex
CREATE INDEX "index_po_diensts_on_aneasy_name" ON "po_diensts"("aneasy_name");

-- CreateIndex
CREATE INDEX "index_po_diensts_on_kostenstelle_id" ON "po_diensts"("kostenstelle_id");

-- CreateIndex
CREATE INDEX "index_po_diensts_on_planname" ON "po_diensts"("planname");

-- CreateIndex
CREATE INDEX "index_po_diensts_on_team_id" ON "po_diensts"("team_id");

-- CreateIndex
CREATE INDEX "index_schichts_on_arbeitszeittyp_id" ON "schichts"("arbeitszeittyp_id");

-- CreateIndex
CREATE INDEX "index_schichts_on_bedarfs_eintrag_id" ON "schichts"("bedarfs_eintrag_id");

-- CreateIndex
CREATE INDEX "index_stundennachweis_on_kostenstelle_id" ON "stundennachweis"("kostenstelle_id");

-- CreateIndex
CREATE INDEX "index_stundennachweis_on_mitarbeiter_id" ON "stundennachweis"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_stundennachweis_on_stundennachweis_status_id" ON "stundennachweis"("stundennachweis_status_id");

-- CreateIndex
CREATE INDEX "index_tagesverteiler_layouts_on_verteiler_vorlagen_id" ON "tagesverteiler_layouts"("verteiler_vorlagen_id");

-- CreateIndex
CREATE INDEX "index_tagesverteiler_user_settings_on_user_id" ON "tagesverteiler_user_settings"("user_id");

-- CreateIndex
CREATE INDEX "index_team_funktions_on_funktion_id" ON "team_funktions"("funktion_id");

-- CreateIndex
CREATE INDEX "index_team_funktions_on_team_id" ON "team_funktions"("team_id");

-- CreateIndex
CREATE INDEX "index_team_kw_krankpuffer_versions_on_item_type_and_item_id" ON "team_kw_krankpuffer_versions"("item_type", "item_id");

-- CreateIndex
CREATE INDEX "index_team_kw_krankpuffers_on_team_id" ON "team_kw_krankpuffers"("team_id");

-- CreateIndex
CREATE INDEX "index_teams_on_kostenstelle_id" ON "teams"("kostenstelle_id");

-- CreateIndex
CREATE INDEX "index_user_versions_on_item_type_and_item_id" ON "user_versions"("item_type", "item_id");

-- CreateIndex
CREATE INDEX "index_user_versions_on_whodunnit" ON "user_versions"("whodunnit");

-- CreateIndex
CREATE UNIQUE INDEX "index_users_on_email" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "index_users_on_reset_password_token" ON "users"("reset_password_token");

-- CreateIndex
CREATE INDEX "index_users_on_account_info_id" ON "users"("account_info_id");

-- CreateIndex
CREATE INDEX "index_users_gruppes_on_user_id_and_gruppe_id" ON "users_gruppes"("user_id", "gruppe_id");

-- CreateIndex
CREATE INDEX "index_version_associations_on_foreign_key" ON "version_associations"("foreign_key_name", "foreign_key_id");

-- CreateIndex
CREATE INDEX "index_version_associations_on_version_id" ON "version_associations"("version_id");

-- CreateIndex
CREATE INDEX "index_versions_on_item_type_and_item_id" ON "versions"("item_type", "item_id");

-- CreateIndex
CREATE INDEX "index_versions_on_transaction_id" ON "versions"("transaction_id");

-- CreateIndex
CREATE INDEX "index_verteiler_vorlagens_on_dienstplan_path_id" ON "verteiler_vorlagens"("dienstplan_path_id");

-- CreateIndex
CREATE INDEX "index_verteilungsoverrides_on_dienstbedarf_id" ON "verteilungsoverrides"("dienstbedarf_id");

-- CreateIndex
CREATE INDEX "index_verteilungsoverrides_on_dienstverteilungstyp_id" ON "verteilungsoverrides"("dienstverteilungstyp_id");

-- CreateIndex
CREATE INDEX "index_verteilungsoverrides_on_parameterset_id" ON "verteilungsoverrides"("parameterset_id");

-- CreateIndex
CREATE INDEX "index_vertrag_versions_on_item_type_and_item_id" ON "vertrag_versions"("item_type", "item_id");

-- CreateIndex
CREATE INDEX "index_vertrags_on_vertragstyp_id" ON "vertrags"("vertragstyp_id");

-- CreateIndex
CREATE INDEX "index_vertrags_arbeitszeits_on_vertrag_id" ON "vertrags_arbeitszeits"("vertrag_id");

-- CreateIndex
CREATE INDEX "index_vertrags_phases_on_vertrag_id" ON "vertrags_phases"("vertrag_id");

-- CreateIndex
CREATE INDEX "index_vertrags_phases_on_vertragsstufe_id" ON "vertrags_phases"("vertragsstufe_id");

-- CreateIndex
CREATE INDEX "index_vertrags_variantes_on_vertragstyp_id" ON "vertrags_variantes"("vertragstyp_id");

-- CreateIndex
CREATE INDEX "index_vertragsgruppes_on_vertragstyp_id" ON "vertragsgruppes"("vertragstyp_id");

-- CreateIndex
CREATE INDEX "index_vertragsstuves_on_vertrags_variante_id" ON "vertragsstuves"("vertrags_variante_id");

-- CreateIndex
CREATE INDEX "index_vertragsstuves_on_vertragsgruppe_id" ON "vertragsstuves"("vertragsgruppe_id");

-- CreateIndex
CREATE INDEX "index_vorlages_on_mitarbeiter_id" ON "vorlages"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_vorlages_on_team_id" ON "vorlages"("team_id");

-- CreateIndex
CREATE INDEX "index_wochenbilanzs_on_kalenderwoche_id" ON "wochenbilanzs"("kalenderwoche_id");

-- CreateIndex
CREATE INDEX "index_wochenbilanzs_on_mitarbeiter_id" ON "wochenbilanzs"("mitarbeiter_id");

-- CreateIndex
CREATE INDEX "index_zeitraumkategories_on_zeitraumregel_id" ON "zeitraumkategories"("zeitraumregel_id");

-- AddForeignKey
ALTER TABLE "abwesentheitenueberblick_counters" ADD CONSTRAINT "abwesentheitenueberblick_counters_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abwesentheitenueberblick_counters" ADD CONSTRAINT "abwesentheitenueberblick_counters_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abwesentheitenueberblicks" ADD CONSTRAINT "abwesentheitenueberblicks_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_infos" ADD CONSTRAINT "account_infos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_infos" ADD CONSTRAINT "fk_rails_58245fd0a4" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "allgemeine_vorlages" ADD CONSTRAINT "allgemeine_vorlages_dienstplan_path_id_fkey" FOREIGN KEY ("dienstplan_path_id") REFERENCES "dienstplan_paths"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allgemeine_vorlages" ADD CONSTRAINT "allgemeine_vorlages_vorlage_id_fkey" FOREIGN KEY ("vorlage_id") REFERENCES "vorlages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antraege_histories" ADD CONSTRAINT "antraege_histories_antraege_id_fkey" FOREIGN KEY ("antraege_id") REFERENCES "antraeges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antraege_histories" ADD CONSTRAINT "antraege_histories_antragsstatus_id_fkey" FOREIGN KEY ("antragsstatus_id") REFERENCES "antragsstatuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antraege_histories" ADD CONSTRAINT "antraege_histories_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antraeges" ADD CONSTRAINT "antraeges_antragsstatus_id_fkey" FOREIGN KEY ("antragsstatus_id") REFERENCES "antragsstatuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antraeges" ADD CONSTRAINT "antraeges_antragstyp_id_fkey" FOREIGN KEY ("antragstyp_id") REFERENCES "antragstyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antraeges" ADD CONSTRAINT "antraeges_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antragstyps" ADD CONSTRAINT "antragstyps_alternative_po_dienst_id_fkey" FOREIGN KEY ("alternative_po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antragstyps" ADD CONSTRAINT "antragstyps_check_alternative_po_dienst_id_fkey" FOREIGN KEY ("check_alternative_po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antragstyps" ADD CONSTRAINT "antragstyps_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antragstyps" ADD CONSTRAINT "antragstyps_we_holiday_po_dienst_id_fkey" FOREIGN KEY ("we_holiday_po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbeitsplatzs" ADD CONSTRAINT "arbeitsplatzs_bereich_id_fkey" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbeitsplatzs" ADD CONSTRAINT "arbeitsplatzs_standort_id_fkey" FOREIGN KEY ("standort_id") REFERENCES "standorts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbeitszeit_absprachens" ADD CONSTRAINT "arbeitszeit_absprachens_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbeitszeit_absprachens" ADD CONSTRAINT "arbeitszeit_absprachens_zeitraumkategorie_id_fkey" FOREIGN KEY ("zeitraumkategorie_id") REFERENCES "zeitraumkategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbeitszeitverteilungs" ADD CONSTRAINT "arbeitszeitverteilungs_dienstgruppe_id_fkey" FOREIGN KEY ("dienstgruppe_id") REFERENCES "dienstgruppes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbeitszeitverteilungs" ADD CONSTRAINT "arbeitszeitverteilungs_pre_dienstgruppe_id_fkey" FOREIGN KEY ("pre_dienstgruppe_id") REFERENCES "dienstgruppes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automatische_einteilungens" ADD CONSTRAINT "automatische_einteilungens_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automatische_einteilungens" ADD CONSTRAINT "automatische_einteilungens_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automatische_einteilungens" ADD CONSTRAINT "automatische_einteilungens_zeitraumkategorie_id_fkey" FOREIGN KEY ("zeitraumkategorie_id") REFERENCES "zeitraumkategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_bereich_id_fkey" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_dienstbedarf_id_fkey" FOREIGN KEY ("dienstbedarf_id") REFERENCES "dienstbedarves"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_dienstplanbedarf_id_fkey" FOREIGN KEY ("dienstplanbedarf_id") REFERENCES "dienstplanbedarves"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_dienstverteilungstyp_id_fkey" FOREIGN KEY ("dienstverteilungstyp_id") REFERENCES "dienstverteilungstyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_kostenstelle_id_fkey" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benachrichtigungs" ADD CONSTRAINT "benachrichtigungs_benachrichtigungs_status_id_fkey" FOREIGN KEY ("benachrichtigungs_status_id") REFERENCES "benachrichtigungs_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benachrichtigungs" ADD CONSTRAINT "benachrichtigungs_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bereich_tagesverteilers" ADD CONSTRAINT "bereich_tagesverteilers_bereich_id_fkey" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bereich_tagesverteilers" ADD CONSTRAINT "bereich_tagesverteilers_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bereich_tagesverteilers" ADD CONSTRAINT "bereich_tagesverteilers_tagesverteiler_id_fkey" FOREIGN KEY ("tagesverteiler_id") REFERENCES "tagesverteilers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bereich_wochenverteilers" ADD CONSTRAINT "bereich_wochenverteilers_bereich_id_fkey" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bereich_wochenverteilers" ADD CONSTRAINT "bereich_wochenverteilers_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_room_users" ADD CONSTRAINT "channel_room_users_channel_room_id_fkey" FOREIGN KEY ("channel_room_id") REFERENCES "channel_rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_room_users" ADD CONSTRAINT "channel_room_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "dienstbedarves_arbeitszeitverteilung_id_fkey" FOREIGN KEY ("arbeitszeitverteilung_id") REFERENCES "arbeitszeitverteilungs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "dienstbedarves_bereich_id_fkey" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "dienstbedarves_dienstverteilungstyp_id_fkey" FOREIGN KEY ("dienstverteilungstyp_id") REFERENCES "dienstverteilungstyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "dienstbedarves_kostenstelle_id_fkey" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "dienstbedarves_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "dienstbedarves_zeitraumkategories_id_fkey" FOREIGN KEY ("zeitraumkategories_id") REFERENCES "zeitraumkategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "diensteinteilungs_bereich_id_fkey" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "diensteinteilungs_dienstplan_id_fkey" FOREIGN KEY ("dienstplan_id") REFERENCES "dienstplans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "diensteinteilungs_einteilungsstatus_id_fkey" FOREIGN KEY ("einteilungsstatus_id") REFERENCES "einteilungsstatuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "diensteinteilungs_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "diensteinteilungs_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "dienstfreigabes_freigabestatus_id_fkey" FOREIGN KEY ("freigabestatus_id") REFERENCES "freigabestatuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "dienstfreigabes_freigabetyp_id_fkey" FOREIGN KEY ("freigabetyp_id") REFERENCES "freigabetyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "dienstfreigabes_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "dienstfreigabes_standort_id_fkey" FOREIGN KEY ("standort_id") REFERENCES "standorts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "dienstfreigabes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstkategorie_teams" ADD CONSTRAINT "dienstkategorie_teams_dienstkategorie_id_fkey" FOREIGN KEY ("dienstkategorie_id") REFERENCES "dienstkategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstkategorie_teams" ADD CONSTRAINT "dienstkategorie_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstkategoriethemas" ADD CONSTRAINT "dienstkategoriethemas_dienstkategorie_id_fkey" FOREIGN KEY ("dienstkategorie_id") REFERENCES "dienstkategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstkategoriethemas" ADD CONSTRAINT "dienstkategoriethemas_thema_id_fkey" FOREIGN KEY ("thema_id") REFERENCES "themas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplan_custom_counters" ADD CONSTRAINT "dienstplan_custom_counters_dienstplan_custom_feld_id_fkey" FOREIGN KEY ("dienstplan_custom_feld_id") REFERENCES "dienstplan_custom_felds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplan_custom_felds" ADD CONSTRAINT "dienstplan_custom_felds_vorlage_id_fkey" FOREIGN KEY ("vorlage_id") REFERENCES "vorlages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplan_paths" ADD CONSTRAINT "dienstplan_paths_plan_tab_id_fkey" FOREIGN KEY ("plan_tab_id") REFERENCES "plan_tabs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplan_paths" ADD CONSTRAINT "dienstplan_paths_planinterval_id_fkey" FOREIGN KEY ("planinterval_id") REFERENCES "planintervals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplaner_user_farbgruppens" ADD CONSTRAINT "dienstplaner_user_farbgruppens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplaner_user_settings" ADD CONSTRAINT "dienstplaner_user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplaners_teams" ADD CONSTRAINT "dienstplaners_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplaners_teams" ADD CONSTRAINT "dienstplaners_teams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplaners_verteiler_vorlagens" ADD CONSTRAINT "dienstplaners_verteiler_vorlagens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplaners_verteiler_vorlagens" ADD CONSTRAINT "dienstplaners_verteiler_vorlagens_vorlage_id_fkey" FOREIGN KEY ("vorlage_id") REFERENCES "verteiler_vorlagens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplans" ADD CONSTRAINT "dienstplans_dienstplanbedarf_id_fkey" FOREIGN KEY ("dienstplanbedarf_id") REFERENCES "dienstplanbedarves"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplans" ADD CONSTRAINT "dienstplans_dienstplanstatus_id_fkey" FOREIGN KEY ("dienstplanstatus_id") REFERENCES "dienstplanstatuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplans" ADD CONSTRAINT "dienstplans_parameterset_id_fkey" FOREIGN KEY ("parameterset_id") REFERENCES "parametersets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstratings" ADD CONSTRAINT "dienstratings_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstratings" ADD CONSTRAINT "dienstratings_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstwunsches" ADD CONSTRAINT "dienstwunsches_dienstkategorie_id_fkey" FOREIGN KEY ("dienstkategorie_id") REFERENCES "dienstkategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstwunsches" ADD CONSTRAINT "dienstwunsches_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "einteilung_rotations" ADD CONSTRAINT "einteilung_rotations_kontingent_id_fkey" FOREIGN KEY ("kontingent_id") REFERENCES "kontingents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "einteilung_rotations" ADD CONSTRAINT "einteilung_rotations_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freistellungs" ADD CONSTRAINT "freistellungs_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funktions" ADD CONSTRAINT "funktions_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geraetepasses" ADD CONSTRAINT "geraetepasses_geraet_id_fkey" FOREIGN KEY ("geraet_id") REFERENCES "geraets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geraetepasses" ADD CONSTRAINT "geraetepasses_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geraets" ADD CONSTRAINT "geraets_geraeteklasse_id_fkey" FOREIGN KEY ("geraeteklasse_id") REFERENCES "geraeteklasses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jahresbilanzs" ADD CONSTRAINT "jahresbilanzs_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kontingent_po_diensts" ADD CONSTRAINT "kontingent_po_diensts_kontingent_id_fkey" FOREIGN KEY ("kontingent_id") REFERENCES "kontingents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kontingent_po_diensts" ADD CONSTRAINT "kontingent_po_diensts_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kontingents" ADD CONSTRAINT "kontingents_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailer_ccs" ADD CONSTRAINT "mailer_ccs_mailer_addresse_id_fkey" FOREIGN KEY ("mailer_addresse_id") REFERENCES "mailer_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailer_ccs" ADD CONSTRAINT "mailer_ccs_mailer_context_id_fkey" FOREIGN KEY ("mailer_context_id") REFERENCES "mailer_contexts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailer_contexts" ADD CONSTRAINT "mailer_contexts_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "mailer_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailer_contexts" ADD CONSTRAINT "mailer_contexts_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "mailer_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailer_tos" ADD CONSTRAINT "mailer_tos_mailer_addresse_id_fkey" FOREIGN KEY ("mailer_addresse_id") REFERENCES "mailer_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailer_tos" ADD CONSTRAINT "mailer_tos_mailer_context_id_fkey" FOREIGN KEY ("mailer_context_id") REFERENCES "mailer_contexts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merkmal_options" ADD CONSTRAINT "merkmal_options_merkmal_id_fkey" FOREIGN KEY ("merkmal_id") REFERENCES "merkmals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitarbeiter_default_eingeteilts" ADD CONSTRAINT "mitarbeiter_default_eingeteilts_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitarbeiter_default_eingeteilts" ADD CONSTRAINT "mitarbeiter_default_eingeteilts_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitarbeitermerkmals" ADD CONSTRAINT "mitarbeitermerkmals_merkmal_id_fkey" FOREIGN KEY ("merkmal_id") REFERENCES "merkmals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitarbeitermerkmals" ADD CONSTRAINT "mitarbeitermerkmals_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitarbeiters" ADD CONSTRAINT "mitarbeiters_funktion_id_fkey" FOREIGN KEY ("funktion_id") REFERENCES "funktions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nef_fahrts" ADD CONSTRAINT "nef_fahrts_notfallmedizin_register_id_fkey" FOREIGN KEY ("notfallmedizin_register_id") REFERENCES "notfallmedizin_registers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nicht_einteilen_absprachens" ADD CONSTRAINT "nicht_einteilen_absprachens_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nicht_einteilen_absprachens" ADD CONSTRAINT "nicht_einteilen_absprachens_zeitraumkategorie_id_fkey" FOREIGN KEY ("zeitraumkategorie_id") REFERENCES "zeitraumkategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nicht_einteilen_standort_themen" ADD CONSTRAINT "nicht_einteilen_standort_themen_absprache_id_fkey" FOREIGN KEY ("absprache_id") REFERENCES "nicht_einteilen_absprachens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nicht_einteilen_standort_themen" ADD CONSTRAINT "nicht_einteilen_standort_themen_standort_id_fkey" FOREIGN KEY ("standort_id") REFERENCES "standorts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nicht_einteilen_standort_themen" ADD CONSTRAINT "nicht_einteilen_standort_themen_thema_id_fkey" FOREIGN KEY ("thema_id") REFERENCES "themas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_note_category_id_fkey" FOREIGN KEY ("note_category_id") REFERENCES "note_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes_histories" ADD CONSTRAINT "notes_histories_ersteller_id_fkey" FOREIGN KEY ("ersteller_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes_histories" ADD CONSTRAINT "notes_histories_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes_histories" ADD CONSTRAINT "notes_histories_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notfallmedizin_registers" ADD CONSTRAINT "notfallmedizin_registers_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notfallmedizin_registers" ADD CONSTRAINT "notfallmedizin_registers_notfallmedizin_status_id_fkey" FOREIGN KEY ("notfallmedizin_status_id") REFERENCES "notfallmedizin_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_access_tokens_new" ADD CONSTRAINT "oauth_access_tokens_new_refresh_token_id_fkey" FOREIGN KEY ("refresh_token_id") REFERENCES "oauth_refresh_tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_access_tokens_new" ADD CONSTRAINT "oauth_access_tokens_new_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planparameters" ADD CONSTRAINT "planparameters_einteilungsstatus_id_fkey" FOREIGN KEY ("einteilungsstatus_id") REFERENCES "einteilungsstatuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planparameters" ADD CONSTRAINT "planparameters_parameterset_id_fkey" FOREIGN KEY ("parameterset_id") REFERENCES "parametersets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_diensts" ADD CONSTRAINT "po_diensts_kostenstelle_id_fkey" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_diensts" ADD CONSTRAINT "po_diensts_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schichts" ADD CONSTRAINT "schichts_arbeitszeittyp_id_fkey" FOREIGN KEY ("arbeitszeittyp_id") REFERENCES "arbeitszeittyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schichts" ADD CONSTRAINT "schichts_bedarfs_eintrag_id_fkey" FOREIGN KEY ("bedarfs_eintrag_id") REFERENCES "bedarfs_eintrags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stundennachweis" ADD CONSTRAINT "stundennachweis_kostenstelle_id_fkey" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stundennachweis" ADD CONSTRAINT "stundennachweis_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stundennachweis" ADD CONSTRAINT "stundennachweis_stundennachweis_status_id_fkey" FOREIGN KEY ("stundennachweis_status_id") REFERENCES "stundennachweis_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tagesverteiler_layouts" ADD CONSTRAINT "tagesverteiler_layouts_verteiler_vorlagen_id_fkey" FOREIGN KEY ("verteiler_vorlagen_id") REFERENCES "verteiler_vorlagens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_funktions" ADD CONSTRAINT "team_funktions_funktion_id_fkey" FOREIGN KEY ("funktion_id") REFERENCES "funktions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_funktions" ADD CONSTRAINT "team_funktions_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_kw_krankpuffers" ADD CONSTRAINT "team_kw_krankpuffers_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_kostenstelle_id_fkey" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_gruppes" ADD CONSTRAINT "users_gruppes_gruppe_id_fkey" FOREIGN KEY ("gruppe_id") REFERENCES "gruppes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_gruppes" ADD CONSTRAINT "users_gruppes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verteiler_vorlagens" ADD CONSTRAINT "verteiler_vorlagens_dienstplan_path_id_fkey" FOREIGN KEY ("dienstplan_path_id") REFERENCES "dienstplan_paths"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verteilungsoverrides" ADD CONSTRAINT "verteilungsoverrides_dienstbedarf_id_fkey" FOREIGN KEY ("dienstbedarf_id") REFERENCES "dienstbedarves"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verteilungsoverrides" ADD CONSTRAINT "verteilungsoverrides_dienstverteilungstyp_id_fkey" FOREIGN KEY ("dienstverteilungstyp_id") REFERENCES "dienstverteilungstyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verteilungsoverrides" ADD CONSTRAINT "verteilungsoverrides_parameterset_id_fkey" FOREIGN KEY ("parameterset_id") REFERENCES "parametersets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vertrags" ADD CONSTRAINT "vertrags_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vertrags" ADD CONSTRAINT "vertrags_vertragstyp_id_fkey" FOREIGN KEY ("vertragstyp_id") REFERENCES "vertragstyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vertrags_phases" ADD CONSTRAINT "vertrags_phases_vertrag_id_fkey" FOREIGN KEY ("vertrag_id") REFERENCES "vertrags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vertrags_variantes" ADD CONSTRAINT "vertrags_variantes_vertragstyp_id_fkey" FOREIGN KEY ("vertragstyp_id") REFERENCES "vertragstyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vertragsgruppes" ADD CONSTRAINT "vertragsgruppes_vertragstyp_id_fkey" FOREIGN KEY ("vertragstyp_id") REFERENCES "vertragstyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vertragsstuves" ADD CONSTRAINT "vertragsstuves_vertrags_variante_id_fkey" FOREIGN KEY ("vertrags_variante_id") REFERENCES "vertrags_variantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vertragsstuves" ADD CONSTRAINT "vertragsstuves_vertragsgruppe_id_fkey" FOREIGN KEY ("vertragsgruppe_id") REFERENCES "vertragsgruppes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vorlages" ADD CONSTRAINT "vorlages_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vorlages" ADD CONSTRAINT "vorlages_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wochenbilanzs" ADD CONSTRAINT "wochenbilanzs_kalenderwoche_id_fkey" FOREIGN KEY ("kalenderwoche_id") REFERENCES "kalenderwoches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wochenbilanzs" ADD CONSTRAINT "wochenbilanzs_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zeitraumkategories" ADD CONSTRAINT "zeitraumkategories_zeitraumregel_id_fkey" FOREIGN KEY ("zeitraumregel_id") REFERENCES "zeitraumregels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

