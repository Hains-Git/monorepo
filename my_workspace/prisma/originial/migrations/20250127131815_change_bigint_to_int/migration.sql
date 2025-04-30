/*
  Warnings:

  - The primary key for the `abwesentheiten_spaltens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `abwesentheiten_spaltens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `po_dienst_id` on the `abwesentheiten_spaltens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `abwesentheitenueberblick_counters` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `abwesentheitenueberblick_counters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `abwesentheitenueberblick_counters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `po_dienst_id` on the `abwesentheitenueberblick_counters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `abwesentheitenueberblick_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `abwesentheitenueberblick_settings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `abwesentheitenueberblick_settings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `abwesentheitenueberblicks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `abwesentheitenueberblicks` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `abwesentheitenueberblicks` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `account_infos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `account_infos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `account_infos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `user_id` on the `account_infos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `active_admin_comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `active_admin_comments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `active_storage_attachments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `active_storage_attachments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `active_storage_blobs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `active_storage_blobs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `admin_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `admin_users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `allgemeine_vorlages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `allgemeine_vorlages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vorlage_id` on the `allgemeine_vorlages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstplan_path_id` on the `allgemeine_vorlages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `pdf_zusatz_dienste` on the `allgemeine_vorlages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `antraege_histories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `antraege_histories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `antraege_histories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `antraege_id` on the `antraege_histories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `antragsstatus_id` on the `antraege_histories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `antraeges` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `antraeges` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `antraeges` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `antragstyp_id` on the `antraeges` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `antragsstatus_id` on the `antraeges` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `antragsstatuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `antragsstatuses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `antragstyps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `antragstyps` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `po_dienst_id` on the `antragstyps` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `we_holiday_po_dienst_id` on the `antragstyps` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `check_alternative_po_dienst_id` on the `antragstyps` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `alternative_po_dienst_id` on the `antragstyps` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `arbeitsplatzs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `arbeitsplatzs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `bereich_id` on the `arbeitsplatzs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `standort_id` on the `arbeitsplatzs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `arbeitszeit_absprachens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `arbeitszeit_absprachens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `arbeitszeit_absprachens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `zeitraumkategorie_id` on the `arbeitszeit_absprachens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `arbeitszeittyps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `arbeitszeittyps` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `arbeitszeitverteilungs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `arbeitszeitverteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstgruppe_id` on the `arbeitszeitverteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `pre_dienstgruppe_id` on the `arbeitszeitverteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `automatische_einteilungens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `automatische_einteilungens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `automatische_einteilungens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `po_dienst_id` on the `automatische_einteilungens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `zeitraumkategorie_id` on the `automatische_einteilungens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `bedarfs_eintrags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `bedarfs_eintrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstplanbedarf_id` on the `bedarfs_eintrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `po_dienst_id` on the `bedarfs_eintrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstbedarf_id` on the `bedarfs_eintrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstverteilungstyp_id` on the `bedarfs_eintrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `bereich_id` on the `bedarfs_eintrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `first_entry` on the `bedarfs_eintrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `kostenstelle_id` on the `bedarfs_eintrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `benachrichtigungs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `benachrichtigungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `benachrichtigungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `benachrichtigungs_status_id` on the `benachrichtigungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_rating` on the `benachrichtigungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `benachrichtigungs_statuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `benachrichtigungs_statuses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `benachrichtigungs_typs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `benachrichtigungs_typs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `bereich_tagesverteilers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `bereich_tagesverteilers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `tagesverteiler_id` on the `bereich_tagesverteilers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `bereich_id` on the `bereich_tagesverteilers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `po_dienst_id` on the `bereich_tagesverteilers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `bereich_wochenverteilers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `bereich_wochenverteilers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `bereich_id` on the `bereich_wochenverteilers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `po_dienst_id` on the `bereich_wochenverteilers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `bereiches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `bereiches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `bereiches_id` on the `bereiches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `channel_room_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `channel_room_users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `channel_room_id` on the `channel_room_users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `user_id` on the `channel_room_users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `channel_rooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `channel_rooms` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `datei_typs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `datei_typs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dateis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dateis` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstbedarves` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstbedarves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `po_dienst_id` on the `dienstbedarves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `bereich_id` on the `dienstbedarves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstverteilungstyp_id` on the `dienstbedarves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `arbeitszeitverteilung_id` on the `dienstbedarves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `zeitraumkategories_id` on the `dienstbedarves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `kostenstelle_id` on the `dienstbedarves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstbedarveshistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstbedarveshistory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstbedarf_id` on the `dienstbedarveshistory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `arbeitszeitverteilungs_id` on the `dienstbedarveshistory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `diensteinteilungs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `diensteinteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `diensteinteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `einteilungsstatus_id` on the `diensteinteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `po_dienst_id` on the `diensteinteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstplan_id` on the `diensteinteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `einteilungskontext_id` on the `diensteinteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `bereich_id` on the `diensteinteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `diensteinteilungs_versions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `diensteinteilungs_versions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstfreigabe_versions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstfreigabe_versions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstfreigabes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstfreigabes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `freigabetyp_id` on the `dienstfreigabes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `dienstfreigabes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `freigabestatus_id` on the `dienstfreigabes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `user_id` on the `dienstfreigabes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `standort_id` on the `dienstfreigabes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstgruppes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstgruppes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienste` on the `dienstgruppes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstkategorie_teams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstkategorie_teams` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstkategorie_id` on the `dienstkategorie_teams` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `team_id` on the `dienstkategorie_teams` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstkategories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstkategories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstkategoriethemas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstkategoriethemas` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstkategorie_id` on the `dienstkategoriethemas` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `thema_id` on the `dienstkategoriethemas` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstplan_custom_counters` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstplan_custom_counters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_ids` on the `dienstplan_custom_counters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstplan_custom_feld_id` on the `dienstplan_custom_counters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiterteam_ids` on the `dienstplan_custom_counters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiterfunktionen_ids` on the `dienstplan_custom_counters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `diensteteam_ids` on the `dienstplan_custom_counters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `wochentage` on the `dienstplan_custom_counters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstplan_custom_felds` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstplan_custom_felds` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vorlage_id` on the `dienstplan_custom_felds` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `index` on the `dienstplan_custom_felds` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `count_all_typ` on the `dienstplan_custom_felds` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `custom_counter_ids` on the `dienstplan_custom_felds` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstplan_paths` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstplan_paths` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `planinterval_id` on the `dienstplan_paths` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `plan_tab_id` on the `dienstplan_paths` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstplanbedarves` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstplanbedarves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienste` on the `dienstplanbedarves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstplaner_user_farbgruppens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstplaner_user_farbgruppens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `user_id` on the `dienstplaner_user_farbgruppens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `pos` on the `dienstplaner_user_farbgruppens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienste_ids` on the `dienstplaner_user_farbgruppens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstkategorien_ids` on the `dienstplaner_user_farbgruppens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstplaner_user_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstplaner_user_settings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `user_id` on the `dienstplaner_user_settings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstplaners_teams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstplaners_teams` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `user_id` on the `dienstplaners_teams` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `team_id` on the `dienstplaners_teams` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstplaners_verteiler_vorlagens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstplaners_verteiler_vorlagens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `user_id` on the `dienstplaners_verteiler_vorlagens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vorlage_id` on the `dienstplaners_verteiler_vorlagens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstplans` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstplans` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `parameterset_id` on the `dienstplans` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstplanstatus_id` on the `dienstplans` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstplanbedarf_id` on the `dienstplans` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstplanstatuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstplanstatuses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstratings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstratings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `po_dienst_id` on the `dienstratings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `dienstratings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `diensts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `diensts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstverteilungstyps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstverteilungstyps` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstwunsches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstwunsches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `dienstwunsches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstkategorie_id` on the `dienstwunsches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `einteilung_rotations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `einteilung_rotations` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `kontingent_id` on the `einteilung_rotations` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `einteilung_rotations` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `einteilung_versions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `einteilung_versions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `einteilungskontexts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `einteilungskontexts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `einteilungsstatuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `einteilungsstatuses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `feiertages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `feiertages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `freigabestatuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `freigabestatuses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `freigabetyps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `freigabetyps` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `freistellungs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `freistellungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `freistellungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `funktions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `funktions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `team_id` on the `funktions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `geraetebereiches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `geraetebereiches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `geraeteklasses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `geraeteklasses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `geraetepasses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `geraetepasses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `geraetepasses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `geraet_id` on the `geraetepasses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `geraets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `geraets` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `geraeteklasse_id` on the `geraets` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `gruppes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `gruppes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `hains_tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `hains_tasks` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_ids` on the `hains_tasks` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `benachrichtigungs_typ_id` on the `hains_tasks` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `zeitraumkategorie_id` on the `hains_tasks` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `jahresbilanzs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `jahresbilanzs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `jahresbilanzs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `kalendermarkierungs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `kalendermarkierungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `kalenderwoches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `kalenderwoches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `kontingent_po_diensts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `kontingent_po_diensts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `kontingent_id` on the `kontingent_po_diensts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `po_dienst_id` on the `kontingent_po_diensts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `kontingents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `kontingents` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `thema_ids` on the `kontingents` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `team_id` on the `kontingents` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `kostenstelles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `kostenstelles` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `links` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `links` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `mailer_addresses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `mailer_addresses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `mailer_ccs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `mailer_ccs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mailer_context_id` on the `mailer_ccs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mailer_addresse_id` on the `mailer_ccs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `mailer_contexts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `mailer_contexts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `from_id` on the `mailer_contexts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `reply_to_id` on the `mailer_contexts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `mailer_tos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `mailer_tos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mailer_context_id` on the `mailer_tos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mailer_addresse_id` on the `mailer_tos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `merkmal_options` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `merkmal_options` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `merkmal_id` on the `merkmal_options` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `merkmals` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `merkmals` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `mitarbeiter_default_eingeteilts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `mitarbeiter_default_eingeteilts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `mitarbeiter_default_eingeteilts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `po_dienst_id` on the `mitarbeiter_default_eingeteilts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `mitarbeitermerkmals` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `mitarbeitermerkmals` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `mitarbeitermerkmals` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `merkmal_id` on the `mitarbeitermerkmals` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `mitarbeiters` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `mitarbeiters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `funktion_id` on the `mitarbeiters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `nef_fahrts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `nef_fahrts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `notfallmedizin_register_id` on the `nef_fahrts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `nicht_einteilen_absprachens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `nicht_einteilen_absprachens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `nicht_einteilen_absprachens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `zeitraumkategorie_id` on the `nicht_einteilen_absprachens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `nicht_einteilen_standort_themen` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `nicht_einteilen_standort_themen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `absprache_id` on the `nicht_einteilen_standort_themen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `standort_id` on the `nicht_einteilen_standort_themen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `thema_id` on the `nicht_einteilen_standort_themen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `note_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `note_categories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `notes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `notes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `notes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `ersteller_id` on the `notes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `note_category_id` on the `notes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `notes_histories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `notes_histories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `note_id` on the `notes_histories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `notes_histories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `ersteller_id` on the `notes_histories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `notfallmedizin_registers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `notfallmedizin_registers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `notfallmedizin_registers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `notfallmedizin_status_id` on the `notfallmedizin_registers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `notfallmedizin_statuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `notfallmedizin_statuses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `oauth_access_grants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `oauth_access_grants` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `oauth_access_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `oauth_access_tokens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `oauth_applications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `oauth_applications` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `parametersets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `parametersets` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `plan_tabs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `plan_tabs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `planintervals` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `planintervals` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `planparameters` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `planparameters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `parameterset_id` on the `planparameters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `einteilungsstatus_id` on the `planparameters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `po_diensts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `po_diensts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `thema_ids` on the `po_diensts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `team_id` on the `po_diensts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `kostenstelle_id` on the `po_diensts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `schichts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `schichts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `bedarfs_eintrag_id` on the `schichts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `arbeitszeittyp_id` on the `schichts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `standorts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `standorts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `stundennachweis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `stundennachweis` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `stundennachweis` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `kostenstelle_id` on the `stundennachweis` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `stundennachweis_status_id` on the `stundennachweis` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `stundennachweis_statuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `stundennachweis_statuses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `tagesverteiler_layouts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `tagesverteiler_layouts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `verteiler_vorlagen_id` on the `tagesverteiler_layouts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `tagesverteiler_user_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `tagesverteiler_user_settings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `user_id` on the `tagesverteiler_user_settings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `tagesverteilers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `tagesverteilers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `tagkategories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `tagkategories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `team_funktions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `team_funktions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `team_id` on the `team_funktions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `funktion_id` on the `team_funktions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `team_kw_krankpuffer_versions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `team_kw_krankpuffer_versions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `team_kw_krankpuffers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `team_kw_krankpuffers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `team_id` on the `team_kw_krankpuffers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `teams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `teams` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `kostenstelle_id` on the `teams` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `telefonlistes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `telefonlistes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `themas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `themas` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `urlaubssaldo_abspraches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `urlaubssaldo_abspraches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `urlaubssaldo_abspraches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `user_versions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user_versions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `user_id` on the `users_gruppes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `gruppe_id` on the `users_gruppes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `version_associations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `version_associations` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `versions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `versions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `verteiler_tagesverteilers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `verteiler_tagesverteilers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `verteiler_vorlagens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `verteiler_vorlagens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstplan_path_id` on the `verteiler_vorlagens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `verteilungsoverrides` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `verteilungsoverrides` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `parameterset_id` on the `verteilungsoverrides` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstbedarf_id` on the `verteilungsoverrides` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstverteilungstyp_id` on the `verteilungsoverrides` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vertrag_versions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertrag_versions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vertrags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `vertrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vertragstyp_id` on the `vertrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vertrags_arbeitszeits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertrags_arbeitszeits` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vertrag_id` on the `vertrags_arbeitszeits` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vertrags_phases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertrags_phases` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vertrag_id` on the `vertrags_phases` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vertragsstufe_id` on the `vertrags_phases` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vertrags_variantes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertrags_variantes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vertragstyp_id` on the `vertrags_variantes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vertragsgruppes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertragsgruppes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vertragstyp_id` on the `vertragsgruppes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vertragsstuves` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertragsstuves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vertragsgruppe_id` on the `vertragsstuves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vertrags_variante_id` on the `vertragsstuves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vertragstyps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertragstyps` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vorlages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vorlages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `vorlages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `team_id` on the `vorlages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `wochenbilanzs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `wochenbilanzs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `kalenderwoche_id` on the `wochenbilanzs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `wochenbilanzs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `zeitraumkategories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `zeitraumkategories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `zeitraumregel_id` on the `zeitraumkategories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `zeitraumregels` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `zeitraumregels` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "abwesentheitenueberblick_counters" DROP CONSTRAINT "fk_rails_336f14c2e2";

-- DropForeignKey
ALTER TABLE "abwesentheitenueberblick_counters" DROP CONSTRAINT "fk_rails_daea018e64";

-- DropForeignKey
ALTER TABLE "abwesentheitenueberblick_settings" DROP CONSTRAINT "fk_rails_3d45bd1bd3";

-- DropForeignKey
ALTER TABLE "abwesentheitenueberblicks" DROP CONSTRAINT "fk_rails_ed4202ea8e";

-- DropForeignKey
ALTER TABLE "account_infos" DROP CONSTRAINT "fk_rails_58245fd0a4";

-- DropForeignKey
ALTER TABLE "allgemeine_vorlages" DROP CONSTRAINT "fk_rails_01e0e49755";

-- DropForeignKey
ALTER TABLE "allgemeine_vorlages" DROP CONSTRAINT "fk_rails_0c44f45c22";

-- DropForeignKey
ALTER TABLE "antraege_histories" DROP CONSTRAINT "fk_rails_6b4c176fee";

-- DropForeignKey
ALTER TABLE "antraege_histories" DROP CONSTRAINT "fk_rails_702e44afb0";

-- DropForeignKey
ALTER TABLE "antraege_histories" DROP CONSTRAINT "fk_rails_d2c22a9e1a";

-- DropForeignKey
ALTER TABLE "antraeges" DROP CONSTRAINT "fk_rails_0101e13655";

-- DropForeignKey
ALTER TABLE "antraeges" DROP CONSTRAINT "fk_rails_a5f48af37e";

-- DropForeignKey
ALTER TABLE "antraeges" DROP CONSTRAINT "fk_rails_f887e40996";

-- DropForeignKey
ALTER TABLE "antragstyps" DROP CONSTRAINT "fk_rails_3734c17d7f";

-- DropForeignKey
ALTER TABLE "antragstyps" DROP CONSTRAINT "fk_rails_5dd7757f25";

-- DropForeignKey
ALTER TABLE "antragstyps" DROP CONSTRAINT "fk_rails_8ac569efac";

-- DropForeignKey
ALTER TABLE "antragstyps" DROP CONSTRAINT "fk_rails_a43ad8c57f";

-- DropForeignKey
ALTER TABLE "arbeitsplatzs" DROP CONSTRAINT "fk_rails_1029690348";

-- DropForeignKey
ALTER TABLE "arbeitsplatzs" DROP CONSTRAINT "fk_rails_4ce8e3dfb0";

-- DropForeignKey
ALTER TABLE "arbeitszeit_absprachens" DROP CONSTRAINT "fk_rails_3d5cc996a1";

-- DropForeignKey
ALTER TABLE "arbeitszeit_absprachens" DROP CONSTRAINT "fk_rails_4a9339ea11";

-- DropForeignKey
ALTER TABLE "arbeitszeitverteilungs" DROP CONSTRAINT "fk_rails_7b802cfd89";

-- DropForeignKey
ALTER TABLE "arbeitszeitverteilungs" DROP CONSTRAINT "fk_rails_fe777cf5f2";

-- DropForeignKey
ALTER TABLE "automatische_einteilungens" DROP CONSTRAINT "fk_rails_03e173cb8b";

-- DropForeignKey
ALTER TABLE "automatische_einteilungens" DROP CONSTRAINT "fk_rails_2286cd78f3";

-- DropForeignKey
ALTER TABLE "automatische_einteilungens" DROP CONSTRAINT "fk_rails_3651daf545";

-- DropForeignKey
ALTER TABLE "bedarfs_eintrags" DROP CONSTRAINT "fk_rails_00545eb639";

-- DropForeignKey
ALTER TABLE "bedarfs_eintrags" DROP CONSTRAINT "fk_rails_08c867c460";

-- DropForeignKey
ALTER TABLE "bedarfs_eintrags" DROP CONSTRAINT "fk_rails_0f89581c7b";

-- DropForeignKey
ALTER TABLE "bedarfs_eintrags" DROP CONSTRAINT "fk_rails_aa2e3d95aa";

-- DropForeignKey
ALTER TABLE "bedarfs_eintrags" DROP CONSTRAINT "fk_rails_e18eeada6a";

-- DropForeignKey
ALTER TABLE "bedarfs_eintrags" DROP CONSTRAINT "fk_rails_e8f3cb8e16";

-- DropForeignKey
ALTER TABLE "benachrichtigungs" DROP CONSTRAINT "fk_rails_2d4826acc2";

-- DropForeignKey
ALTER TABLE "benachrichtigungs" DROP CONSTRAINT "fk_rails_d72e570086";

-- DropForeignKey
ALTER TABLE "bereich_tagesverteilers" DROP CONSTRAINT "fk_rails_082f661ba0";

-- DropForeignKey
ALTER TABLE "bereich_tagesverteilers" DROP CONSTRAINT "fk_rails_c9d75975f6";

-- DropForeignKey
ALTER TABLE "bereich_tagesverteilers" DROP CONSTRAINT "fk_rails_fdf23f3f87";

-- DropForeignKey
ALTER TABLE "bereich_wochenverteilers" DROP CONSTRAINT "fk_rails_2430b21746";

-- DropForeignKey
ALTER TABLE "bereich_wochenverteilers" DROP CONSTRAINT "fk_rails_ef32afba54";

-- DropForeignKey
ALTER TABLE "channel_room_users" DROP CONSTRAINT "fk_rails_07d9c65830";

-- DropForeignKey
ALTER TABLE "channel_room_users" DROP CONSTRAINT "fk_rails_fa37f889bb";

-- DropForeignKey
ALTER TABLE "dienstbedarves" DROP CONSTRAINT "fk_rails_05b1cdbc7e";

-- DropForeignKey
ALTER TABLE "dienstbedarves" DROP CONSTRAINT "fk_rails_2b3b1e6b71";

-- DropForeignKey
ALTER TABLE "dienstbedarves" DROP CONSTRAINT "fk_rails_434a8ef988";

-- DropForeignKey
ALTER TABLE "dienstbedarves" DROP CONSTRAINT "fk_rails_495258659a";

-- DropForeignKey
ALTER TABLE "dienstbedarves" DROP CONSTRAINT "fk_rails_9ae4035ecf";

-- DropForeignKey
ALTER TABLE "dienstbedarves" DROP CONSTRAINT "fk_rails_a8c5f3913d";

-- DropForeignKey
ALTER TABLE "diensteinteilungs" DROP CONSTRAINT "fk_rails_0c69b8191a";

-- DropForeignKey
ALTER TABLE "diensteinteilungs" DROP CONSTRAINT "fk_rails_2a437cd8da";

-- DropForeignKey
ALTER TABLE "diensteinteilungs" DROP CONSTRAINT "fk_rails_37afbd5ac9";

-- DropForeignKey
ALTER TABLE "diensteinteilungs" DROP CONSTRAINT "fk_rails_8d2ed7f2ce";

-- DropForeignKey
ALTER TABLE "diensteinteilungs" DROP CONSTRAINT "fk_rails_f7e8479926";

-- DropForeignKey
ALTER TABLE "dienstfreigabes" DROP CONSTRAINT "fk_rails_3a9471d624";

-- DropForeignKey
ALTER TABLE "dienstfreigabes" DROP CONSTRAINT "fk_rails_7c27a8ab72";

-- DropForeignKey
ALTER TABLE "dienstfreigabes" DROP CONSTRAINT "fk_rails_8328bf76e2";

-- DropForeignKey
ALTER TABLE "dienstfreigabes" DROP CONSTRAINT "fk_rails_ab3f7cd811";

-- DropForeignKey
ALTER TABLE "dienstfreigabes" DROP CONSTRAINT "fk_rails_b201a8e9f5";

-- DropForeignKey
ALTER TABLE "dienstkategorie_teams" DROP CONSTRAINT "fk_rails_10d49ef0f8";

-- DropForeignKey
ALTER TABLE "dienstkategorie_teams" DROP CONSTRAINT "fk_rails_8c261f9aef";

-- DropForeignKey
ALTER TABLE "dienstkategoriethemas" DROP CONSTRAINT "fk_rails_27dd54d2f6";

-- DropForeignKey
ALTER TABLE "dienstkategoriethemas" DROP CONSTRAINT "fk_rails_a1ff9468f4";

-- DropForeignKey
ALTER TABLE "dienstplan_custom_counters" DROP CONSTRAINT "fk_rails_cc48ac5d4f";

-- DropForeignKey
ALTER TABLE "dienstplan_custom_felds" DROP CONSTRAINT "fk_rails_3b768fab84";

-- DropForeignKey
ALTER TABLE "dienstplan_paths" DROP CONSTRAINT "fk_rails_1ef594e615";

-- DropForeignKey
ALTER TABLE "dienstplan_paths" DROP CONSTRAINT "fk_rails_5a0e779422";

-- DropForeignKey
ALTER TABLE "dienstplaner_user_farbgruppens" DROP CONSTRAINT "fk_rails_d0e228908c";

-- DropForeignKey
ALTER TABLE "dienstplaner_user_settings" DROP CONSTRAINT "fk_rails_0e9ce655bd";

-- DropForeignKey
ALTER TABLE "dienstplaners_teams" DROP CONSTRAINT "fk_rails_75274a3398";

-- DropForeignKey
ALTER TABLE "dienstplaners_teams" DROP CONSTRAINT "fk_rails_ae25869849";

-- DropForeignKey
ALTER TABLE "dienstplaners_verteiler_vorlagens" DROP CONSTRAINT "fk_rails_4924e39a88";

-- DropForeignKey
ALTER TABLE "dienstplaners_verteiler_vorlagens" DROP CONSTRAINT "fk_rails_9e9354836f";

-- DropForeignKey
ALTER TABLE "dienstplans" DROP CONSTRAINT "fk_rails_36027a91b3";

-- DropForeignKey
ALTER TABLE "dienstplans" DROP CONSTRAINT "fk_rails_55a766d44f";

-- DropForeignKey
ALTER TABLE "dienstplans" DROP CONSTRAINT "fk_rails_5f55bd1d2e";

-- DropForeignKey
ALTER TABLE "dienstratings" DROP CONSTRAINT "fk_rails_514befc444";

-- DropForeignKey
ALTER TABLE "dienstratings" DROP CONSTRAINT "fk_rails_661abcf60e";

-- DropForeignKey
ALTER TABLE "dienstwunsches" DROP CONSTRAINT "fk_rails_0839dc09ce";

-- DropForeignKey
ALTER TABLE "dienstwunsches" DROP CONSTRAINT "fk_rails_28e8d817f4";

-- DropForeignKey
ALTER TABLE "einteilung_rotations" DROP CONSTRAINT "fk_rails_0754d2d566";

-- DropForeignKey
ALTER TABLE "einteilung_rotations" DROP CONSTRAINT "fk_rails_5eeae3bb85";

-- DropForeignKey
ALTER TABLE "freistellungs" DROP CONSTRAINT "fk_rails_f7bfd583fd";

-- DropForeignKey
ALTER TABLE "funktions" DROP CONSTRAINT "fk_rails_1a9f2cf982";

-- DropForeignKey
ALTER TABLE "geraetepasses" DROP CONSTRAINT "fk_rails_01560b5637";

-- DropForeignKey
ALTER TABLE "geraetepasses" DROP CONSTRAINT "fk_rails_e3a3b73828";

-- DropForeignKey
ALTER TABLE "geraets" DROP CONSTRAINT "fk_rails_87c8fbadfa";

-- DropForeignKey
ALTER TABLE "jahresbilanzs" DROP CONSTRAINT "fk_rails_5221012030";

-- DropForeignKey
ALTER TABLE "kontingent_po_diensts" DROP CONSTRAINT "fk_rails_3d72be3049";

-- DropForeignKey
ALTER TABLE "kontingent_po_diensts" DROP CONSTRAINT "fk_rails_e01ed6b5a5";

-- DropForeignKey
ALTER TABLE "kontingents" DROP CONSTRAINT "fk_rails_99108947ac";

-- DropForeignKey
ALTER TABLE "mailer_ccs" DROP CONSTRAINT "fk_rails_6fb0b59cad";

-- DropForeignKey
ALTER TABLE "mailer_ccs" DROP CONSTRAINT "fk_rails_75d69d0976";

-- DropForeignKey
ALTER TABLE "mailer_contexts" DROP CONSTRAINT "fk_rails_35af776dcd";

-- DropForeignKey
ALTER TABLE "mailer_contexts" DROP CONSTRAINT "fk_rails_d9811e872a";

-- DropForeignKey
ALTER TABLE "mailer_tos" DROP CONSTRAINT "fk_rails_08dc607943";

-- DropForeignKey
ALTER TABLE "mailer_tos" DROP CONSTRAINT "fk_rails_3324b483bd";

-- DropForeignKey
ALTER TABLE "merkmal_options" DROP CONSTRAINT "fk_rails_e746e9188c";

-- DropForeignKey
ALTER TABLE "mitarbeiter_default_eingeteilts" DROP CONSTRAINT "fk_rails_893ef3958e";

-- DropForeignKey
ALTER TABLE "mitarbeiter_default_eingeteilts" DROP CONSTRAINT "fk_rails_8dc3d88f3b";

-- DropForeignKey
ALTER TABLE "mitarbeitermerkmals" DROP CONSTRAINT "fk_rails_41412590af";

-- DropForeignKey
ALTER TABLE "mitarbeitermerkmals" DROP CONSTRAINT "fk_rails_c1efcdc64d";

-- DropForeignKey
ALTER TABLE "mitarbeiters" DROP CONSTRAINT "fk_rails_5006408ec6";

-- DropForeignKey
ALTER TABLE "nef_fahrts" DROP CONSTRAINT "fk_rails_be395c9f8e";

-- DropForeignKey
ALTER TABLE "nicht_einteilen_absprachens" DROP CONSTRAINT "fk_rails_c13db17963";

-- DropForeignKey
ALTER TABLE "nicht_einteilen_absprachens" DROP CONSTRAINT "fk_rails_f981032257";

-- DropForeignKey
ALTER TABLE "nicht_einteilen_standort_themen" DROP CONSTRAINT "fk_rails_44fd8a9177";

-- DropForeignKey
ALTER TABLE "nicht_einteilen_standort_themen" DROP CONSTRAINT "fk_rails_77f147e42b";

-- DropForeignKey
ALTER TABLE "nicht_einteilen_standort_themen" DROP CONSTRAINT "fk_rails_fd8449d811";

-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "fk_rails_660860a381";

-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "fk_rails_e70fa12604";

-- DropForeignKey
ALTER TABLE "notes_histories" DROP CONSTRAINT "fk_rails_22a7972a2b";

-- DropForeignKey
ALTER TABLE "notes_histories" DROP CONSTRAINT "fk_rails_2de2e64c38";

-- DropForeignKey
ALTER TABLE "notes_histories" DROP CONSTRAINT "fk_rails_863d1cabe1";

-- DropForeignKey
ALTER TABLE "notfallmedizin_registers" DROP CONSTRAINT "fk_rails_7e6262d50a";

-- DropForeignKey
ALTER TABLE "notfallmedizin_registers" DROP CONSTRAINT "fk_rails_8497fb4436";

-- DropForeignKey
ALTER TABLE "planparameters" DROP CONSTRAINT "fk_rails_024b3ff545";

-- DropForeignKey
ALTER TABLE "planparameters" DROP CONSTRAINT "fk_rails_ca3ff20b34";

-- DropForeignKey
ALTER TABLE "po_diensts" DROP CONSTRAINT "fk_rails_4223136f27";

-- DropForeignKey
ALTER TABLE "po_diensts" DROP CONSTRAINT "fk_rails_6ac1abf20e";

-- DropForeignKey
ALTER TABLE "schichts" DROP CONSTRAINT "fk_rails_b62a6b1ca3";

-- DropForeignKey
ALTER TABLE "schichts" DROP CONSTRAINT "fk_rails_bd78a44984";

-- DropForeignKey
ALTER TABLE "stundennachweis" DROP CONSTRAINT "fk_rails_05b269d564";

-- DropForeignKey
ALTER TABLE "stundennachweis" DROP CONSTRAINT "fk_rails_745ff2de6c";

-- DropForeignKey
ALTER TABLE "stundennachweis" DROP CONSTRAINT "fk_rails_f7210f061b";

-- DropForeignKey
ALTER TABLE "tagesverteiler_layouts" DROP CONSTRAINT "fk_rails_9293af7154";

-- DropForeignKey
ALTER TABLE "team_funktions" DROP CONSTRAINT "fk_rails_0043aa77c2";

-- DropForeignKey
ALTER TABLE "team_funktions" DROP CONSTRAINT "fk_rails_bec8e126a9";

-- DropForeignKey
ALTER TABLE "team_kw_krankpuffers" DROP CONSTRAINT "fk_rails_5eded83672";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "fk_rails_9d14807ce7";

-- DropForeignKey
ALTER TABLE "urlaubssaldo_abspraches" DROP CONSTRAINT "fk_rails_cdbde270f4";

-- DropForeignKey
ALTER TABLE "users_gruppes" DROP CONSTRAINT "fk_rails_0c3453aa77";

-- DropForeignKey
ALTER TABLE "users_gruppes" DROP CONSTRAINT "fk_rails_cec3e4ee8f";

-- DropForeignKey
ALTER TABLE "verteiler_vorlagens" DROP CONSTRAINT "fk_rails_02b7f85cbd";

-- DropForeignKey
ALTER TABLE "verteilungsoverrides" DROP CONSTRAINT "fk_rails_171044f6f2";

-- DropForeignKey
ALTER TABLE "verteilungsoverrides" DROP CONSTRAINT "fk_rails_4383eac96c";

-- DropForeignKey
ALTER TABLE "verteilungsoverrides" DROP CONSTRAINT "fk_rails_e75f8ddeae";

-- DropForeignKey
ALTER TABLE "vertrags" DROP CONSTRAINT "fk_rails_b20fe19842";

-- DropForeignKey
ALTER TABLE "vertrags" DROP CONSTRAINT "fk_rails_f2cec23b66";

-- DropForeignKey
ALTER TABLE "vertrags_arbeitszeits" DROP CONSTRAINT "fk_rails_8e47624856";

-- DropForeignKey
ALTER TABLE "vertrags_phases" DROP CONSTRAINT "fk_rails_4db5fece40";

-- DropForeignKey
ALTER TABLE "vertrags_phases" DROP CONSTRAINT "fk_rails_f9b8646f70";

-- DropForeignKey
ALTER TABLE "vertrags_variantes" DROP CONSTRAINT "fk_rails_e70c474827";

-- DropForeignKey
ALTER TABLE "vertragsgruppes" DROP CONSTRAINT "fk_rails_26cb34c5df";

-- DropForeignKey
ALTER TABLE "vertragsstuves" DROP CONSTRAINT "fk_rails_75bdf87379";

-- DropForeignKey
ALTER TABLE "vertragsstuves" DROP CONSTRAINT "fk_rails_91403e2823";

-- DropForeignKey
ALTER TABLE "vorlages" DROP CONSTRAINT "fk_rails_176adae085";

-- DropForeignKey
ALTER TABLE "vorlages" DROP CONSTRAINT "fk_rails_69e32bd9f7";

-- DropForeignKey
ALTER TABLE "wochenbilanzs" DROP CONSTRAINT "fk_rails_4e802b69e3";

-- DropForeignKey
ALTER TABLE "wochenbilanzs" DROP CONSTRAINT "fk_rails_eb52f30dad";

-- DropForeignKey
ALTER TABLE "zeitraumkategories" DROP CONSTRAINT "fk_rails_cf637e5e41";

-- CREATE SEQUENCE "abwesentheiten_spaltens_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "abwesentheiten_spaltens" DROP CONSTRAINT "abwesentheiten_spaltens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "abwesentheiten_spaltens_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "abwesentheiten_spaltens_id_sq" OWNED BY "abwesentheiten_spaltens"."id";

-- CREATE SEQUENCE "abwesentheitenueberblick_counters_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "abwesentheitenueberblick_counters" DROP CONSTRAINT "abwesentheitenueberblick_counters_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "abwesentheitenueberblick_counters_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "abwesentheitenueberblick_counters_id_sq" OWNED BY "abwesentheitenueberblick_counters"."id";

-- CREATE SEQUENCE "abwesentheitenueberblick_settings_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "abwesentheitenueberblick_settings" DROP CONSTRAINT "abwesentheitenueberblick_settings_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "abwesentheitenueberblick_settings_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "abwesentheitenueberblick_settings_id_sq" OWNED BY "abwesentheitenueberblick_settings"."id";


-- CREATE SEQUENCE "abwesentheitenueberblicks_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "abwesentheitenueberblicks" DROP CONSTRAINT "abwesentheitenueberblicks_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "abwesentheitenueberblicks_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "abwesentheitenueberblicks_id_sq" OWNED BY "abwesentheitenueberblicks"."id";

-- CREATE SEQUENCE "account_infos_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "account_infos" DROP CONSTRAINT "account_infos_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "account_infos_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "account_infos_id_sq" OWNED BY "account_infos"."id";

-- CREATE SEQUENCE "active_admin_comments_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "active_admin_comments" DROP CONSTRAINT "active_admin_comments_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "active_admin_comments_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "active_admin_comments_id_sq" OWNED BY "active_admin_comments"."id";

-- CREATE SEQUENCE "active_storage_attachments_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "active_storage_attachments" DROP CONSTRAINT "active_storage_attachments_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "active_storage_attachments_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "active_storage_attachments_id_sq" OWNED BY "active_storage_attachments"."id";

-- CREATE SEQUENCE "active_storage_blobs_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "active_storage_blobs" DROP CONSTRAINT "active_storage_blobs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "active_storage_blobs_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "active_storage_blobs_id_sq" OWNED BY "active_storage_blobs"."id";

-- CREATE SEQUENCE "admin_users_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "admin_users" DROP CONSTRAINT "admin_users_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "admin_users_id_sq" OWNED BY "admin_users"."id";

-- CREATE SEQUENCE "allgemeine_vorlages_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "allgemeine_vorlages" DROP CONSTRAINT "allgemeine_vorlages_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vorlage_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplan_path_id" SET DATA TYPE INTEGER,
ALTER COLUMN "pdf_zusatz_dienste" SET DATA TYPE INTEGER[],
ADD CONSTRAINT "allgemeine_vorlages_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "allgemeine_vorlages_id_sq" OWNED BY "allgemeine_vorlages"."id";

-- CREATE SEQUENCE "antraege_histories_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "antraege_histories" DROP CONSTRAINT "antraege_histories_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "antraege_id" SET DATA TYPE INTEGER,
ALTER COLUMN "antragsstatus_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "antraege_histories_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "antraege_histories_id_sq" OWNED BY "antraege_histories"."id";

-- CREATE SEQUENCE "antraeges_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "antraeges" DROP CONSTRAINT "antraeges_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "antragstyp_id" SET DATA TYPE INTEGER,
ALTER COLUMN "antragsstatus_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "antraeges_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "antraeges_id_sq" OWNED BY "antraeges"."id";

-- CREATE SEQUENCE "antragsstatuses_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "antragsstatuses" DROP CONSTRAINT "antragsstatuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "antragsstatuses_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "antragsstatuses_id_sq" OWNED BY "antragsstatuses"."id";

-- CREATE SEQUENCE "antragstyps_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "antragstyps" DROP CONSTRAINT "antragstyps_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ALTER COLUMN "we_holiday_po_dienst_id" SET DATA TYPE INTEGER,
ALTER COLUMN "check_alternative_po_dienst_id" SET DATA TYPE INTEGER,
ALTER COLUMN "alternative_po_dienst_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "antragstyps_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "antragstyps_id_sq" OWNED BY "antragstyps"."id";

-- CREATE SEQUENCE "arbeitsplatzs_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "arbeitsplatzs" DROP CONSTRAINT "arbeitsplatzs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "bereich_id" SET DATA TYPE INTEGER,
ALTER COLUMN "standort_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "arbeitsplatzs_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "arbeitsplatzs_id_sq" OWNED BY "arbeitsplatzs"."id";

-- CREATE SEQUENCE "arbeitszeit_absprachens_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "arbeitszeit_absprachens" DROP CONSTRAINT "arbeitszeit_absprachens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumkategorie_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "arbeitszeit_absprachens_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "arbeitszeit_absprachens_id_sq" OWNED BY "arbeitszeit_absprachens"."id";

-- CREATE SEQUENCE "arbeitszeittyps_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "arbeitszeittyps" DROP CONSTRAINT "arbeitszeittyps_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "arbeitszeittyps_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "arbeitszeittyps_id_sq" OWNED BY "arbeitszeittyps"."id";

-- CREATE SEQUENCE "arbeitszeitverteilungs_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "arbeitszeitverteilungs" DROP CONSTRAINT "arbeitszeitverteilungs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstgruppe_id" SET DATA TYPE INTEGER,
ALTER COLUMN "pre_dienstgruppe_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "arbeitszeitverteilungs_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "arbeitszeitverteilungs_id_sq" OWNED BY "arbeitszeitverteilungs"."id";

-- CREATE SEQUENCE "automatische_einteilungens_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "automatische_einteilungens" DROP CONSTRAINT "automatische_einteilungens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumkategorie_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "automatische_einteilungens_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "automatische_einteilungens_id_sq" OWNED BY "automatische_einteilungens"."id";

-- CREATE SEQUENCE "bedarfs_eintrags_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "bedarfs_eintrags" DROP CONSTRAINT "bedarfs_eintrags_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplanbedarf_id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstbedarf_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstverteilungstyp_id" SET DATA TYPE INTEGER,
ALTER COLUMN "bereich_id" SET DATA TYPE INTEGER,
ALTER COLUMN "first_entry" SET DATA TYPE INTEGER,
ALTER COLUMN "kostenstelle_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "bedarfs_eintrags_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "bedarfs_eintrags_id_sq" OWNED BY "bedarfs_eintrags"."id";

-- CREATE SEQUENCE "benachrichtigungs_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "benachrichtigungs" DROP CONSTRAINT "benachrichtigungs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "benachrichtigungs_status_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_rating" SET DATA TYPE INTEGER,
ADD CONSTRAINT "benachrichtigungs_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "benachrichtigungs_id_sq" OWNED BY "benachrichtigungs"."id";

-- CREATE SEQUENCE "benachrichtigungs_statuses_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "benachrichtigungs_statuses" DROP CONSTRAINT "benachrichtigungs_statuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "benachrichtigungs_statuses_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "benachrichtigungs_statuses_id_sq" OWNED BY "benachrichtigungs_statuses"."id";

-- CREATE SEQUENCE "benachrichtigungs_typs_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "benachrichtigungs_typs" DROP CONSTRAINT "benachrichtigungs_typs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "benachrichtigungs_typs_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "benachrichtigungs_typs_id_sq" OWNED BY "benachrichtigungs_typs"."id";

-- CREATE SEQUENCE "bereich_tagesverteilers_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "bereich_tagesverteilers" DROP CONSTRAINT "bereich_tagesverteilers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "tagesverteiler_id" SET DATA TYPE INTEGER,
ALTER COLUMN "bereich_id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "bereich_tagesverteilers_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "bereich_tagesverteilers_id_sq" OWNED BY "bereich_tagesverteilers"."id";

-- CREATE SEQUENCE "bereich_wochenverteilers_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "bereich_wochenverteilers" DROP CONSTRAINT "bereich_wochenverteilers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "bereich_id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "bereich_wochenverteilers_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "bereich_wochenverteilers_id_sq" OWNED BY "bereich_wochenverteilers"."id";

-- CREATE SEQUENCE "bereiches_id_sq" AS INTEGER;
-- AlterTable
ALTER TABLE "bereiches" DROP CONSTRAINT "bereiches_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "bereiches_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "bereiches_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "bereiches_id_sq" OWNED BY "bereiches"."id";

-- CREATE SEQUENCE "channel_room_users_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "channel_room_users" DROP CONSTRAINT "channel_room_users_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "channel_room_id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "channel_room_users_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "channel_room_users_id_seq" OWNED BY "channel_room_users"."id";

-- CREATE SEQUENCE "channel_rooms_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "channel_rooms" DROP CONSTRAINT "channel_rooms_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "channel_rooms_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "channel_rooms_id_seq" OWNED BY "channel_rooms"."id";

-- CREATE SEQUENCE "datei_typs_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "datei_typs" DROP CONSTRAINT "datei_typs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "datei_typs_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "datei_typs_id_seq" OWNED BY "datei_typs"."id";

-- CREATE SEQUENCE "dateis_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dateis" DROP CONSTRAINT "dateis_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dateis_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dateis_id_seq" OWNED BY "dateis"."id";

-- CREATE SEQUENCE "dienstbedarves_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstbedarves" DROP CONSTRAINT "dienstbedarves_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ALTER COLUMN "bereich_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstverteilungstyp_id" SET DATA TYPE INTEGER,
ALTER COLUMN "arbeitszeitverteilung_id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumkategories_id" SET DATA TYPE INTEGER,
ALTER COLUMN "kostenstelle_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstbedarves_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstbedarves_id_seq" OWNED BY "dienstbedarves"."id";

-- CREATE SEQUENCE "dienstbedarveshistory_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstbedarveshistory" DROP CONSTRAINT "dienstbedarveshistory_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstbedarf_id" SET DATA TYPE INTEGER,
ALTER COLUMN "arbeitszeitverteilungs_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstbedarveshistory_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstbedarveshistory_id_seq" OWNED BY "dienstbedarveshistory"."id";

-- CREATE SEQUENCE "dienstbedarfs_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "diensteinteilungs" DROP CONSTRAINT "diensteinteilungs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "einteilungsstatus_id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplan_id" SET DATA TYPE INTEGER,
ALTER COLUMN "einteilungskontext_id" SET DATA TYPE INTEGER,
ALTER COLUMN "bereich_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "diensteinteilungs_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstbedarfs_id_seq" OWNED BY "diensteinteilungs"."id";

-- CREATE SEQUENCE "diensteinteilungs_versions_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "diensteinteilungs_versions" DROP CONSTRAINT "diensteinteilungs_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "diensteinteilungs_versions_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "diensteinteilungs_versions_id_seq" OWNED BY "diensteinteilungs_versions"."id";

-- CREATE SEQUENCE "dienstfreigabe_versions_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstfreigabe_versions" DROP CONSTRAINT "dienstfreigabe_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstfreigabe_versions_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstfreigabe_versions_id_seq" OWNED BY "dienstfreigabe_versions"."id";

-- CREATE SEQUENCE "dienstfreigabes_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstfreigabes" DROP CONSTRAINT "dienstfreigabes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "freigabetyp_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "freigabestatus_id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ALTER COLUMN "standort_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstfreigabes_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstfreigabes_id_seq" OWNED BY "dienstfreigabes"."id";

-- CREATE SEQUENCE "dienstgruppes_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstgruppes" DROP CONSTRAINT "dienstgruppes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienste" SET DATA TYPE INTEGER[],
ADD CONSTRAINT "dienstgruppes_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstgruppes_id_seq" OWNED BY "dienstgruppes"."id";

-- CREATE SEQUENCE "dienstkategorie_teams_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstkategorie_teams" DROP CONSTRAINT "dienstkategorie_teams_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstkategorie_id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstkategorie_teams_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstkategorie_teams_id_seq" OWNED BY "dienstkategorie_teams"."id";

-- CREATE SEQUENCE "dienstkategories_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstkategories" DROP CONSTRAINT "dienstkategories_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstkategories_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstkategories_id_seq" OWNED BY "dienstkategories"."id";

-- CREATE SEQUENCE "dienstkategoriethemas_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstkategoriethemas" DROP CONSTRAINT "dienstkategoriethemas_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstkategorie_id" SET DATA TYPE INTEGER,
ALTER COLUMN "thema_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstkategoriethemas_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstkategoriethemas_id_seq" OWNED BY "dienstkategoriethemas"."id";

-- CREATE SEQUENCE "dienstplan_custom_counters_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstplan_custom_counters" DROP CONSTRAINT "dienstplan_custom_counters_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_ids" SET DATA TYPE INTEGER[],
ALTER COLUMN "dienstplan_custom_feld_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiterteam_ids" SET DATA TYPE INTEGER[],
ALTER COLUMN "mitarbeiterfunktionen_ids" SET DATA TYPE INTEGER[],
ALTER COLUMN "diensteteam_ids" SET DATA TYPE INTEGER[],
ALTER COLUMN "wochentage" SET DATA TYPE INTEGER[],
ADD CONSTRAINT "dienstplan_custom_counters_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstplan_custom_counters_id_seq" OWNED BY "dienstplan_custom_counters"."id";

-- CREATE SEQUENCE "dienstplan_custom_felds_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstplan_custom_felds" DROP CONSTRAINT "dienstplan_custom_felds_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vorlage_id" SET DATA TYPE INTEGER,
ALTER COLUMN "index" SET DATA TYPE INTEGER,
ALTER COLUMN "count_all_typ" SET DATA TYPE INTEGER,
ALTER COLUMN "custom_counter_ids" SET DATA TYPE INTEGER[],
ADD CONSTRAINT "dienstplan_custom_felds_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstplan_custom_felds_id_seq" OWNED BY "dienstplan_custom_felds"."id";

-- CREATE SEQUENCE "dienstplan_paths_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstplan_paths" DROP CONSTRAINT "dienstplan_paths_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "planinterval_id" SET DATA TYPE INTEGER,
ALTER COLUMN "plan_tab_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplan_paths_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstplan_paths_id_seq" OWNED BY "dienstplan_paths"."id";

-- CREATE SEQUENCE "dienstplanbedarves_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstplanbedarves" DROP CONSTRAINT "dienstplanbedarves_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienste" SET DATA TYPE INTEGER[],
ADD CONSTRAINT "dienstplanbedarves_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstplanbedarves_id_seq" OWNED BY "dienstplanbedarves"."id";

-- CREATE SEQUENCE "dienstplaner_user_farbgruppens_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstplaner_user_farbgruppens" DROP CONSTRAINT "dienstplaner_user_farbgruppens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ALTER COLUMN "pos" SET DATA TYPE INTEGER,
ALTER COLUMN "dienste_ids" SET DATA TYPE INTEGER[],
ALTER COLUMN "dienstkategorien_ids" SET DATA TYPE INTEGER[],
ADD CONSTRAINT "dienstplaner_user_farbgruppens_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstplaner_user_farbgruppens_id_seq" OWNED BY "dienstplaner_user_farbgruppens"."id";

-- CREATE SEQUENCE "dienstplaner_user_settings_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstplaner_user_settings" DROP CONSTRAINT "dienstplaner_user_settings_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplaner_user_settings_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstplaner_user_settings_id_seq" OWNED BY "dienstplaner_user_settings"."id";

-- CREATE SEQUENCE "dienstplaners_teams_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstplaners_teams" DROP CONSTRAINT "dienstplaners_teams_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplaners_teams_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstplaners_teams_id_seq" OWNED BY "dienstplaners_teams"."id";

-- CREATE SEQUENCE "dienstplaners_verteiler_vorlagens_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstplaners_verteiler_vorlagens" DROP CONSTRAINT "dienstplaners_verteiler_vorlagens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ALTER COLUMN "vorlage_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplaners_verteiler_vorlagens_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstplaners_verteiler_vorlagens_id_seq" OWNED BY "dienstplaners_verteiler_vorlagens"."id";

-- CREATE SEQUENCE "dienstplans_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstplans" DROP CONSTRAINT "dienstplans_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "parameterset_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplanstatus_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplanbedarf_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplans_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstplans_id_seq" OWNED BY "dienstplans"."id";

-- CREATE SEQUENCE "dienstplanstatuses_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstplanstatuses" DROP CONSTRAINT "dienstplanstatuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplanstatuses_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstplanstatuses_id_seq" OWNED BY "dienstplanstatuses"."id";

-- CREATE SEQUENCE "dienstratings_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstratings" DROP CONSTRAINT "dienstratings_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstratings_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstratings_id_seq" OWNED BY "dienstratings"."id";

-- CREATE SEQUENCE "diensts_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "diensts" DROP CONSTRAINT "diensts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "diensts_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "diensts_id_seq" OWNED BY "diensts"."id";

-- CREATE SEQUENCE "dienstverteilungstyps_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstverteilungstyps" DROP CONSTRAINT "dienstverteilungstyps_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstverteilungstyps_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstverteilungstyps_id_seq" OWNED BY "dienstverteilungstyps"."id";

-- CREATE SEQUENCE "dienstwunsches_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "dienstwunsches" DROP CONSTRAINT "dienstwunsches_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstkategorie_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstwunsches_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "dienstwunsches_id_seq" OWNED BY "dienstwunsches"."id";

-- CREATE SEQUENCE "einteilung_rotations_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "einteilung_rotations" DROP CONSTRAINT "einteilung_rotations_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "kontingent_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "einteilung_rotations_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "einteilung_rotations_id_seq" OWNED BY "einteilung_rotations"."id";

-- CREATE SEQUENCE "einteilung_versions_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "einteilung_versions" DROP CONSTRAINT "einteilung_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "einteilung_versions_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "einteilung_versions_id_seq" OWNED BY "einteilung_versions"."id";

-- CREATE SEQUENCE "einteilungskontexts_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "einteilungskontexts" DROP CONSTRAINT "einteilungskontexts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "einteilungskontexts_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "einteilungskontexts_id_seq" OWNED BY "einteilungskontexts"."id";

-- CREATE SEQUENCE "einteilungsstatuses_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "einteilungsstatuses" DROP CONSTRAINT "einteilungsstatuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "einteilungsstatuses_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "einteilungsstatuses_id_seq" OWNED BY "einteilungsstatuses"."id";

-- CREATE SEQUENCE "feiertages_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "feiertages" DROP CONSTRAINT "feiertages_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "feiertages_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "feiertages_id_seq" OWNED BY "feiertages"."id";

-- CREATE SEQUENCE "freigabestatuses_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "freigabestatuses" DROP CONSTRAINT "freigabestatuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "freigabestatuses_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "freigabestatuses_id_seq" OWNED BY "freigabestatuses"."id";

-- CREATE SEQUENCE "freigabetyps_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "freigabetyps" DROP CONSTRAINT "freigabetyps_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "freigabetyps_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "freigabetyps_id_seq" OWNED BY "freigabetyps"."id";

-- CREATE SEQUENCE "freistellungs_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "freistellungs" DROP CONSTRAINT "freistellungs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "freistellungs_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "freistellungs_id_seq" OWNED BY "freistellungs"."id";

-- CREATE SEQUENCE "funktions_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "funktions" DROP CONSTRAINT "funktions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "funktions_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "funktions_id_seq" OWNED BY "funktions"."id";

-- CREATE SEQUENCE "geraetebereiches_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "geraetebereiches" DROP CONSTRAINT "geraetebereiches_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "geraetebereiches_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "geraetebereiches_id_seq" OWNED BY "geraetebereiches"."id";

-- CREATE SEQUENCE "geraeteklasses_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "geraeteklasses" DROP CONSTRAINT "geraeteklasses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "geraeteklasses_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "geraeteklasses_id_seq" OWNED BY "geraeteklasses"."id";

-- CREATE SEQUENCE "geraetepasses_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "geraetepasses" DROP CONSTRAINT "geraetepasses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "geraet_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "geraetepasses_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "geraetepasses_id_seq" OWNED BY "geraetepasses"."id";

-- CREATE SEQUENCE "geraets_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "geraets" DROP CONSTRAINT "geraets_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "geraeteklasse_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "geraets_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "geraets_id_seq" OWNED BY "geraets"."id";

-- CREATE SEQUENCE "gruppes_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "gruppes" DROP CONSTRAINT "gruppes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "gruppes_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "gruppes_id_seq" OWNED BY "gruppes"."id";

-- CREATE SEQUENCE "hains_tasks_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "hains_tasks" DROP CONSTRAINT "hains_tasks_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_ids" SET DATA TYPE INTEGER[],
ALTER COLUMN "benachrichtigungs_typ_id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumkategorie_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "hains_tasks_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "hains_tasks_id_seq" OWNED BY "hains_tasks"."id";

-- CREATE SEQUENCE "jahresbilanzs_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "jahresbilanzs" DROP CONSTRAINT "jahresbilanzs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "jahresbilanzs_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "jahresbilanzs_id_seq" OWNED BY "jahresbilanzs"."id";

-- CREATE SEQUENCE "kalendermarkierungs_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "kalendermarkierungs" DROP CONSTRAINT "kalendermarkierungs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "kalendermarkierungs_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "kalendermarkierungs_id_seq" OWNED BY "kalendermarkierungs"."id";

-- CREATE SEQUENCE "kalenderwoches_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "kalenderwoches" DROP CONSTRAINT "kalenderwoches_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "kalenderwoches_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "kalenderwoches_id_seq" OWNED BY "kalenderwoches"."id";

-- CREATE SEQUENCE "kontingent_po_diensts_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "kontingent_po_diensts" DROP CONSTRAINT "kontingent_po_diensts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "kontingent_id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "kontingent_po_diensts_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "kontingent_po_diensts_id_seq" OWNED BY "kontingent_po_diensts"."id";

-- CREATE SEQUENCE "kontingents_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "kontingents" DROP CONSTRAINT "kontingents_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "thema_ids" SET DATA TYPE INTEGER[],
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "kontingents_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "kontingents_id_seq" OWNED BY "kontingents"."id";

-- CREATE SEQUENCE "kostenstelles_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "kostenstelles" DROP CONSTRAINT "kostenstelles_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "kostenstelles_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "kostenstelles_id_seq" OWNED BY "kostenstelles"."id";

-- CREATE SEQUENCE "links_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "links" DROP CONSTRAINT "links_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "links_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "links_id_seq" OWNED BY "links"."id";

-- CREATE SEQUENCE "mailer_addresses_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "mailer_addresses" DROP CONSTRAINT "mailer_addresses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mailer_addresses_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "mailer_addresses_id_seq" OWNED BY "mailer_addresses"."id";

-- CREATE SEQUENCE "mailer_ccs_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "mailer_ccs" DROP CONSTRAINT "mailer_ccs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mailer_context_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mailer_addresse_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mailer_ccs_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "mailer_ccs_id_seq" OWNED BY "mailer_ccs"."id";

-- CREATE SEQUENCE "mailer_contexts_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "mailer_contexts" DROP CONSTRAINT "mailer_contexts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "from_id" SET DATA TYPE INTEGER,
ALTER COLUMN "reply_to_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mailer_contexts_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "mailer_contexts_id_seq" OWNED BY "mailer_contexts"."id";

-- CREATE SEQUENCE "mailer_tos_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "mailer_tos" DROP CONSTRAINT "mailer_tos_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mailer_context_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mailer_addresse_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mailer_tos_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "mailer_tos_id_seq" OWNED BY "mailer_tos"."id";

-- CREATE SEQUENCE "merkmal_options_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "merkmal_options" DROP CONSTRAINT "merkmal_options_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "merkmal_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "merkmal_options_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "merkmal_options_id_seq" OWNED BY "merkmal_options"."id";

-- CREATE SEQUENCE "merkmals_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "merkmals" DROP CONSTRAINT "merkmals_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "merkmals_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "merkmals_id_seq" OWNED BY "merkmals"."id";

-- CREATE SEQUENCE "mitarbeiter_default_eingeteilts_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "mitarbeiter_default_eingeteilts" DROP CONSTRAINT "mitarbeiter_default_eingeteilts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mitarbeiter_default_eingeteilts_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "mitarbeiter_default_eingeteilts_id_seq" OWNED BY "mitarbeiter_default_eingeteilts"."id";

-- CREATE SEQUENCE "mitarbeitermerkmals_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "mitarbeitermerkmals" DROP CONSTRAINT "mitarbeitermerkmals_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "merkmal_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mitarbeitermerkmals_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "mitarbeitermerkmals_id_seq" OWNED BY "mitarbeitermerkmals"."id";

-- CREATE SEQUENCE "mitarbeiters_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "mitarbeiters" DROP CONSTRAINT "mitarbeiters_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "funktion_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mitarbeiters_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "mitarbeiters_id_seq" OWNED BY "mitarbeiters"."id";

-- CREATE SEQUENCE "nef_fahrts_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "nef_fahrts" DROP CONSTRAINT "nef_fahrts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "notfallmedizin_register_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "nef_fahrts_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "nef_fahrts_id_seq" OWNED BY "nef_fahrts"."id";

-- CREATE SEQUENCE "nicht_einteilen_absprachens_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "nicht_einteilen_absprachens" DROP CONSTRAINT "nicht_einteilen_absprachens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumkategorie_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "nicht_einteilen_absprachens_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "nicht_einteilen_absprachens_id_seq" OWNED BY "nicht_einteilen_absprachens"."id";

-- CREATE SEQUENCE "nicht_einteilen_standort_themen_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "nicht_einteilen_standort_themen" DROP CONSTRAINT "nicht_einteilen_standort_themen_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "absprache_id" SET DATA TYPE INTEGER,
ALTER COLUMN "standort_id" SET DATA TYPE INTEGER,
ALTER COLUMN "thema_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "nicht_einteilen_standort_themen_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "nicht_einteilen_standort_themen_id_seq" OWNED BY "nicht_einteilen_standort_themen"."id";

-- CREATE SEQUENCE "note_categories_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "note_categories" DROP CONSTRAINT "note_categories_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "note_categories_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "note_categories_id_seq" OWNED BY "note_categories"."id";

-- CREATE SEQUENCE "notes_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "notes" DROP CONSTRAINT "notes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "ersteller_id" SET DATA TYPE INTEGER,
ALTER COLUMN "note_category_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "notes_id_seq" OWNED BY "notes"."id";

-- CREATE SEQUENCE "notes_histories_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "notes_histories" DROP CONSTRAINT "notes_histories_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "note_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "ersteller_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "notes_histories_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "notes_histories_id_seq" OWNED BY "notes_histories"."id";

-- CREATE SEQUENCE "notfallmedizin_registers_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "notfallmedizin_registers" DROP CONSTRAINT "notfallmedizin_registers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "notfallmedizin_status_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "notfallmedizin_registers_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "notfallmedizin_registers_id_seq" OWNED BY "notfallmedizin_registers"."id";

-- CREATE SEQUENCE "notfallmedizin_statuses_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "notfallmedizin_statuses" DROP CONSTRAINT "notfallmedizin_statuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "notfallmedizin_statuses_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "notfallmedizin_statuses_id_seq" OWNED BY "notfallmedizin_statuses"."id";

-- CREATE SEQUENCE "oauth_access_grants_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "oauth_access_grants" DROP CONSTRAINT "oauth_access_grants_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "oauth_access_grants_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "oauth_access_grants_id_seq" OWNED BY "oauth_access_grants"."id";

-- CREATE SEQUENCE "oauth_access_tokens_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "oauth_access_tokens" DROP CONSTRAINT "oauth_access_tokens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "oauth_access_tokens_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "oauth_access_tokens_id_seq" OWNED BY "oauth_access_tokens"."id";

-- CREATE SEQUENCE "oauth_applications_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "oauth_applications" DROP CONSTRAINT "oauth_applications_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "oauth_applications_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "oauth_applications_id_seq" OWNED BY "oauth_applications"."id";

-- CREATE SEQUENCE "parametersets_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "parametersets" DROP CONSTRAINT "parametersets_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "parametersets_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "parametersets_id_seq" OWNED BY "parametersets"."id";

-- CREATE SEQUENCE "plan_tabs_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "plan_tabs" DROP CONSTRAINT "plan_tabs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "plan_tabs_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "plan_tabs_id_seq" OWNED BY "plan_tabs"."id";

-- CREATE SEQUENCE "planintervals_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "planintervals" DROP CONSTRAINT "planintervals_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "planintervals_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "planintervals_id_seq" OWNED BY "planintervals"."id";

-- CREATE SEQUENCE "planparameters_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "planparameters" DROP CONSTRAINT "planparameters_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "parameterset_id" SET DATA TYPE INTEGER,
ALTER COLUMN "einteilungsstatus_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "planparameters_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "planparameters_id_seq" OWNED BY "planparameters"."id";

-- CREATE SEQUENCE "po_diensts_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "po_diensts" DROP CONSTRAINT "po_diensts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "thema_ids" SET DATA TYPE INTEGER[],
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ALTER COLUMN "kostenstelle_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "po_diensts_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "po_diensts_id_seq" OWNED BY "po_diensts"."id";

-- CREATE SEQUENCE "schichts_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "schichts" DROP CONSTRAINT "schichts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "bedarfs_eintrag_id" SET DATA TYPE INTEGER,
ALTER COLUMN "arbeitszeittyp_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "schichts_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "schichts_id_seq" OWNED BY "schichts"."id";

-- CREATE SEQUENCE "standorts_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "standorts" DROP CONSTRAINT "standorts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "standorts_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "standorts_id_seq" OWNED BY "standorts"."id";

-- CREATE SEQUENCE "stundennachweis_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "stundennachweis" DROP CONSTRAINT "stundennachweis_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "kostenstelle_id" SET DATA TYPE INTEGER,
ALTER COLUMN "stundennachweis_status_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "stundennachweis_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "stundennachweis_id_seq" OWNED BY "stundennachweis"."id";

-- CREATE SEQUENCE "stundennachweis_statuses_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "stundennachweis_statuses" DROP CONSTRAINT "stundennachweis_statuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "stundennachweis_statuses_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "stundennachweis_statuses_id_seq" OWNED BY "stundennachweis_statuses"."id";

-- CREATE SEQUENCE "tagesverteiler_layouts_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "tagesverteiler_layouts" DROP CONSTRAINT "tagesverteiler_layouts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "verteiler_vorlagen_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "tagesverteiler_layouts_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "tagesverteiler_layouts_id_seq" OWNED BY "tagesverteiler_layouts"."id";

-- CREATE SEQUENCE "tagesverteiler_user_settings_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "tagesverteiler_user_settings" DROP CONSTRAINT "tagesverteiler_user_settings_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "tagesverteiler_user_settings_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "tagesverteiler_user_settings_id_seq" OWNED BY "tagesverteiler_user_settings"."id";

-- CREATE SEQUENCE "tagesverteilers_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "tagesverteilers" DROP CONSTRAINT "tagesverteilers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "tagesverteilers_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "tagesverteilers_id_seq" OWNED BY "tagesverteilers"."id";

-- CREATE SEQUENCE "tagkategories_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "tagkategories" DROP CONSTRAINT "tagkategories_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "tagkategories_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "tagkategories_id_seq" OWNED BY "tagkategories"."id";

-- CREATE SEQUENCE "team_funktions_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "team_funktions" DROP CONSTRAINT "team_funktions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ALTER COLUMN "funktion_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "team_funktions_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "team_funktions_id_seq" OWNED BY "team_funktions"."id";

-- CREATE SEQUENCE "team_kw_krankpuffer_versions_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "team_kw_krankpuffer_versions" DROP CONSTRAINT "team_kw_krankpuffer_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "team_kw_krankpuffer_versions_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "team_kw_krankpuffer_versions_id_seq" OWNED BY "team_kw_krankpuffer_versions"."id";

-- CREATE SEQUENCE "team_kw_krankpuffers_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "team_kw_krankpuffers" DROP CONSTRAINT "team_kw_krankpuffers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "team_kw_krankpuffers_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "team_kw_krankpuffers_id_seq" OWNED BY "team_kw_krankpuffers"."id";

-- CREATE SEQUENCE "teams_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "teams" DROP CONSTRAINT "teams_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "kostenstelle_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "teams_id_seq" OWNED BY "teams"."id";

-- CREATE SEQUENCE "telefonlistes_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "telefonlistes" DROP CONSTRAINT "telefonlistes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "telefonlistes_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "telefonlistes_id_seq" OWNED BY "telefonlistes"."id";

-- CREATE SEQUENCE "themas_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "themas" DROP CONSTRAINT "themas_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "themas_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "themas_id_seq" OWNED BY "themas"."id";

-- CREATE SEQUENCE "urlaubssaldo_abspraches_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "urlaubssaldo_abspraches" DROP CONSTRAINT "urlaubssaldo_abspraches_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "urlaubssaldo_abspraches_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "urlaubssaldo_abspraches_id_seq" OWNED BY "urlaubssaldo_abspraches"."id";

-- CREATE SEQUENCE "user_versions_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "user_versions" DROP CONSTRAINT "user_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "user_versions_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "user_versions_id_seq" OWNED BY "user_versions"."id";

-- CREATE SEQUENCE "users_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "users_id_seq" OWNED BY "users"."id";

-- AlterTable
ALTER TABLE "users_gruppes" ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ALTER COLUMN "gruppe_id" SET DATA TYPE INTEGER;

-- CREATE SEQUENCE "version_associations_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "version_associations" DROP CONSTRAINT "version_associations_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "version_associations_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "version_associations_id_seq" OWNED BY "version_associations"."id";

-- CREATE SEQUENCE "versions_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "versions" DROP CONSTRAINT "versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "versions_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "versions_id_seq" OWNED BY "versions"."id";

-- CREATE SEQUENCE "verteiler_tagesverteilers_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "verteiler_tagesverteilers" DROP CONSTRAINT "verteiler_tagesverteilers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "verteiler_tagesverteilers_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "verteiler_tagesverteilers_id_seq" OWNED BY "verteiler_tagesverteilers"."id";

-- CREATE SEQUENCE "verteiler_vorlagens_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "verteiler_vorlagens" DROP CONSTRAINT "verteiler_vorlagens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplan_path_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "verteiler_vorlagens_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "verteiler_vorlagens_id_seq" OWNED BY "verteiler_vorlagens"."id";

-- CREATE SEQUENCE "verteilungsoverrides_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "verteilungsoverrides" DROP CONSTRAINT "verteilungsoverrides_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "parameterset_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstbedarf_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstverteilungstyp_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "verteilungsoverrides_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "verteilungsoverrides_id_seq" OWNED BY "verteilungsoverrides"."id";

-- CREATE SEQUENCE "vertrag_versions_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "vertrag_versions" DROP CONSTRAINT "vertrag_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertrag_versions_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "vertrag_versions_id_seq" OWNED BY "vertrag_versions"."id";

-- CREATE SEQUENCE "vertrags_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "vertrags" DROP CONSTRAINT "vertrags_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertragstyp_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertrags_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "vertrags_id_seq" OWNED BY "vertrags"."id";

-- CREATE SEQUENCE "vertrags_arbeitszeits_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "vertrags_arbeitszeits" DROP CONSTRAINT "vertrags_arbeitszeits_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertrag_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertrags_arbeitszeits_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "vertrags_arbeitszeits_id_seq" OWNED BY "vertrags_arbeitszeits"."id";

-- CREATE SEQUENCE "vertrags_phases_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "vertrags_phases" DROP CONSTRAINT "vertrags_phases_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertrag_id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertragsstufe_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertrags_phases_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "vertrags_phases_id_seq" OWNED BY "vertrags_phases"."id";

-- CREATE SEQUENCE "vertrags_variantes_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "vertrags_variantes" DROP CONSTRAINT "vertrags_variantes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertragstyp_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertrags_variantes_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "vertrags_variantes_id_seq" OWNED BY "vertrags_variantes"."id";

-- CREATE SEQUENCE "vertragsgruppes_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "vertragsgruppes" DROP CONSTRAINT "vertragsgruppes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertragstyp_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertragsgruppes_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "vertragsgruppes_id_seq" OWNED BY "vertragsgruppes"."id";

-- CREATE SEQUENCE "vertragsstuves_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "vertragsstuves" DROP CONSTRAINT "vertragsstuves_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertragsgruppe_id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertrags_variante_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertragsstuves_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "vertragsstuves_id_seq" OWNED BY "vertragsstuves"."id";

-- CREATE SEQUENCE "vertragstyps_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "vertragstyps" DROP CONSTRAINT "vertragstyps_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertragstyps_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "vertragstyps_id_seq" OWNED BY "vertragstyps"."id";

-- CREATE SEQUENCE "vorlages_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "vorlages" DROP CONSTRAINT "vorlages_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vorlages_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "vorlages_id_seq" OWNED BY "vorlages"."id";

-- CREATE SEQUENCE "wochenbilanzs_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "wochenbilanzs" DROP CONSTRAINT "wochenbilanzs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "kalenderwoche_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "wochenbilanzs_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "wochenbilanzs_id_seq" OWNED BY "wochenbilanzs"."id";

-- CREATE SEQUENCE "zeitraumkategories_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "zeitraumkategories" DROP CONSTRAINT "zeitraumkategories_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumregel_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "zeitraumkategories_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "zeitraumkategories_id_seq" OWNED BY "zeitraumkategories"."id";

-- CREATE SEQUENCE "zeitraumregels_id_seq" AS INTEGER;
-- AlterTable
ALTER TABLE "zeitraumregels" DROP CONSTRAINT "zeitraumregels_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "zeitraumregels_pkey" PRIMARY KEY ("id");
-- ALTER SEQUENCE "zeitraumregels_id_seq" OWNED BY "zeitraumregels"."id";

-- AddForeignKey
ALTER TABLE "abwesentheitenueberblick_counters" ADD CONSTRAINT "fk_rails_336f14c2e2" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "abwesentheitenueberblick_counters" ADD CONSTRAINT "fk_rails_daea018e64" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "abwesentheitenueberblick_settings" ADD CONSTRAINT "fk_rails_3d45bd1bd3" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "abwesentheitenueberblicks" ADD CONSTRAINT "fk_rails_ed4202ea8e" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "account_infos" ADD CONSTRAINT "fk_rails_58245fd0a4" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "allgemeine_vorlages" ADD CONSTRAINT "fk_rails_01e0e49755" FOREIGN KEY ("dienstplan_path_id") REFERENCES "dienstplan_paths"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "allgemeine_vorlages" ADD CONSTRAINT "fk_rails_0c44f45c22" FOREIGN KEY ("vorlage_id") REFERENCES "vorlages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antraege_histories" ADD CONSTRAINT "fk_rails_6b4c176fee" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antraege_histories" ADD CONSTRAINT "fk_rails_702e44afb0" FOREIGN KEY ("antragsstatus_id") REFERENCES "antragsstatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antraege_histories" ADD CONSTRAINT "fk_rails_d2c22a9e1a" FOREIGN KEY ("antraege_id") REFERENCES "antraeges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antraeges" ADD CONSTRAINT "fk_rails_0101e13655" FOREIGN KEY ("antragsstatus_id") REFERENCES "antragsstatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antraeges" ADD CONSTRAINT "fk_rails_a5f48af37e" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antraeges" ADD CONSTRAINT "fk_rails_f887e40996" FOREIGN KEY ("antragstyp_id") REFERENCES "antragstyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antragstyps" ADD CONSTRAINT "fk_rails_3734c17d7f" FOREIGN KEY ("check_alternative_po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antragstyps" ADD CONSTRAINT "fk_rails_5dd7757f25" FOREIGN KEY ("we_holiday_po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antragstyps" ADD CONSTRAINT "fk_rails_8ac569efac" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antragstyps" ADD CONSTRAINT "fk_rails_a43ad8c57f" FOREIGN KEY ("alternative_po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "arbeitsplatzs" ADD CONSTRAINT "fk_rails_1029690348" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "arbeitsplatzs" ADD CONSTRAINT "fk_rails_4ce8e3dfb0" FOREIGN KEY ("standort_id") REFERENCES "standorts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "arbeitszeit_absprachens" ADD CONSTRAINT "fk_rails_3d5cc996a1" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "arbeitszeit_absprachens" ADD CONSTRAINT "fk_rails_4a9339ea11" FOREIGN KEY ("zeitraumkategorie_id") REFERENCES "zeitraumkategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "arbeitszeitverteilungs" ADD CONSTRAINT "fk_rails_7b802cfd89" FOREIGN KEY ("dienstgruppe_id") REFERENCES "dienstgruppes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "arbeitszeitverteilungs" ADD CONSTRAINT "fk_rails_fe777cf5f2" FOREIGN KEY ("pre_dienstgruppe_id") REFERENCES "dienstgruppes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "automatische_einteilungens" ADD CONSTRAINT "fk_rails_03e173cb8b" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "automatische_einteilungens" ADD CONSTRAINT "fk_rails_2286cd78f3" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "automatische_einteilungens" ADD CONSTRAINT "fk_rails_3651daf545" FOREIGN KEY ("zeitraumkategorie_id") REFERENCES "zeitraumkategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "fk_rails_00545eb639" FOREIGN KEY ("dienstplanbedarf_id") REFERENCES "dienstplanbedarves"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "fk_rails_08c867c460" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "fk_rails_0f89581c7b" FOREIGN KEY ("dienstverteilungstyp_id") REFERENCES "dienstverteilungstyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "fk_rails_aa2e3d95aa" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "fk_rails_e18eeada6a" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "fk_rails_e8f3cb8e16" FOREIGN KEY ("dienstbedarf_id") REFERENCES "dienstbedarves"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "benachrichtigungs" ADD CONSTRAINT "fk_rails_2d4826acc2" FOREIGN KEY ("benachrichtigungs_status_id") REFERENCES "benachrichtigungs_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "benachrichtigungs" ADD CONSTRAINT "fk_rails_d72e570086" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bereich_tagesverteilers" ADD CONSTRAINT "fk_rails_082f661ba0" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bereich_tagesverteilers" ADD CONSTRAINT "fk_rails_c9d75975f6" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bereich_tagesverteilers" ADD CONSTRAINT "fk_rails_fdf23f3f87" FOREIGN KEY ("tagesverteiler_id") REFERENCES "tagesverteilers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bereich_wochenverteilers" ADD CONSTRAINT "fk_rails_2430b21746" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bereich_wochenverteilers" ADD CONSTRAINT "fk_rails_ef32afba54" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channel_room_users" ADD CONSTRAINT "fk_rails_07d9c65830" FOREIGN KEY ("channel_room_id") REFERENCES "channel_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channel_room_users" ADD CONSTRAINT "fk_rails_fa37f889bb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "fk_rails_05b1cdbc7e" FOREIGN KEY ("dienstverteilungstyp_id") REFERENCES "dienstverteilungstyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "fk_rails_2b3b1e6b71" FOREIGN KEY ("arbeitszeitverteilung_id") REFERENCES "arbeitszeitverteilungs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "fk_rails_434a8ef988" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "fk_rails_495258659a" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "fk_rails_9ae4035ecf" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "fk_rails_a8c5f3913d" FOREIGN KEY ("zeitraumkategories_id") REFERENCES "zeitraumkategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "fk_rails_0c69b8191a" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "fk_rails_2a437cd8da" FOREIGN KEY ("einteilungsstatus_id") REFERENCES "einteilungsstatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "fk_rails_37afbd5ac9" FOREIGN KEY ("dienstplan_id") REFERENCES "dienstplans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "fk_rails_8d2ed7f2ce" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "fk_rails_f7e8479926" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "fk_rails_3a9471d624" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "fk_rails_7c27a8ab72" FOREIGN KEY ("freigabetyp_id") REFERENCES "freigabetyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "fk_rails_8328bf76e2" FOREIGN KEY ("standort_id") REFERENCES "standorts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "fk_rails_ab3f7cd811" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "fk_rails_b201a8e9f5" FOREIGN KEY ("freigabestatus_id") REFERENCES "freigabestatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstkategorie_teams" ADD CONSTRAINT "fk_rails_10d49ef0f8" FOREIGN KEY ("dienstkategorie_id") REFERENCES "dienstkategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstkategorie_teams" ADD CONSTRAINT "fk_rails_8c261f9aef" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstkategoriethemas" ADD CONSTRAINT "fk_rails_27dd54d2f6" FOREIGN KEY ("dienstkategorie_id") REFERENCES "dienstkategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstkategoriethemas" ADD CONSTRAINT "fk_rails_a1ff9468f4" FOREIGN KEY ("thema_id") REFERENCES "themas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplan_custom_counters" ADD CONSTRAINT "fk_rails_cc48ac5d4f" FOREIGN KEY ("dienstplan_custom_feld_id") REFERENCES "dienstplan_custom_felds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplan_custom_felds" ADD CONSTRAINT "fk_rails_3b768fab84" FOREIGN KEY ("vorlage_id") REFERENCES "vorlages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplan_paths" ADD CONSTRAINT "fk_rails_1ef594e615" FOREIGN KEY ("planinterval_id") REFERENCES "planintervals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplan_paths" ADD CONSTRAINT "fk_rails_5a0e779422" FOREIGN KEY ("plan_tab_id") REFERENCES "plan_tabs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplaner_user_farbgruppens" ADD CONSTRAINT "fk_rails_d0e228908c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplaner_user_settings" ADD CONSTRAINT "fk_rails_0e9ce655bd" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplaners_teams" ADD CONSTRAINT "fk_rails_75274a3398" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplaners_teams" ADD CONSTRAINT "fk_rails_ae25869849" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplaners_verteiler_vorlagens" ADD CONSTRAINT "fk_rails_4924e39a88" FOREIGN KEY ("vorlage_id") REFERENCES "verteiler_vorlagens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplaners_verteiler_vorlagens" ADD CONSTRAINT "fk_rails_9e9354836f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplans" ADD CONSTRAINT "fk_rails_36027a91b3" FOREIGN KEY ("dienstplanbedarf_id") REFERENCES "dienstplanbedarves"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplans" ADD CONSTRAINT "fk_rails_55a766d44f" FOREIGN KEY ("dienstplanstatus_id") REFERENCES "dienstplanstatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplans" ADD CONSTRAINT "fk_rails_5f55bd1d2e" FOREIGN KEY ("parameterset_id") REFERENCES "parametersets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstratings" ADD CONSTRAINT "fk_rails_514befc444" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstratings" ADD CONSTRAINT "fk_rails_661abcf60e" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstwunsches" ADD CONSTRAINT "fk_rails_0839dc09ce" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstwunsches" ADD CONSTRAINT "fk_rails_28e8d817f4" FOREIGN KEY ("dienstkategorie_id") REFERENCES "dienstkategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einteilung_rotations" ADD CONSTRAINT "fk_rails_0754d2d566" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einteilung_rotations" ADD CONSTRAINT "fk_rails_5eeae3bb85" FOREIGN KEY ("kontingent_id") REFERENCES "kontingents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "freistellungs" ADD CONSTRAINT "fk_rails_f7bfd583fd" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "funktions" ADD CONSTRAINT "fk_rails_1a9f2cf982" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "geraetepasses" ADD CONSTRAINT "fk_rails_01560b5637" FOREIGN KEY ("geraet_id") REFERENCES "geraets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "geraetepasses" ADD CONSTRAINT "fk_rails_e3a3b73828" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "geraets" ADD CONSTRAINT "fk_rails_87c8fbadfa" FOREIGN KEY ("geraeteklasse_id") REFERENCES "geraeteklasses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jahresbilanzs" ADD CONSTRAINT "fk_rails_5221012030" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kontingent_po_diensts" ADD CONSTRAINT "fk_rails_3d72be3049" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kontingent_po_diensts" ADD CONSTRAINT "fk_rails_e01ed6b5a5" FOREIGN KEY ("kontingent_id") REFERENCES "kontingents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kontingents" ADD CONSTRAINT "fk_rails_99108947ac" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mailer_ccs" ADD CONSTRAINT "fk_rails_6fb0b59cad" FOREIGN KEY ("mailer_context_id") REFERENCES "mailer_contexts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mailer_ccs" ADD CONSTRAINT "fk_rails_75d69d0976" FOREIGN KEY ("mailer_addresse_id") REFERENCES "mailer_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mailer_contexts" ADD CONSTRAINT "fk_rails_35af776dcd" FOREIGN KEY ("from_id") REFERENCES "mailer_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mailer_contexts" ADD CONSTRAINT "fk_rails_d9811e872a" FOREIGN KEY ("reply_to_id") REFERENCES "mailer_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mailer_tos" ADD CONSTRAINT "fk_rails_08dc607943" FOREIGN KEY ("mailer_context_id") REFERENCES "mailer_contexts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mailer_tos" ADD CONSTRAINT "fk_rails_3324b483bd" FOREIGN KEY ("mailer_addresse_id") REFERENCES "mailer_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "merkmal_options" ADD CONSTRAINT "fk_rails_e746e9188c" FOREIGN KEY ("merkmal_id") REFERENCES "merkmals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mitarbeiter_default_eingeteilts" ADD CONSTRAINT "fk_rails_893ef3958e" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mitarbeiter_default_eingeteilts" ADD CONSTRAINT "fk_rails_8dc3d88f3b" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mitarbeitermerkmals" ADD CONSTRAINT "fk_rails_41412590af" FOREIGN KEY ("merkmal_id") REFERENCES "merkmals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mitarbeitermerkmals" ADD CONSTRAINT "fk_rails_c1efcdc64d" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mitarbeiters" ADD CONSTRAINT "fk_rails_5006408ec6" FOREIGN KEY ("funktion_id") REFERENCES "funktions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nef_fahrts" ADD CONSTRAINT "fk_rails_be395c9f8e" FOREIGN KEY ("notfallmedizin_register_id") REFERENCES "notfallmedizin_registers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nicht_einteilen_absprachens" ADD CONSTRAINT "fk_rails_c13db17963" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nicht_einteilen_absprachens" ADD CONSTRAINT "fk_rails_f981032257" FOREIGN KEY ("zeitraumkategorie_id") REFERENCES "zeitraumkategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nicht_einteilen_standort_themen" ADD CONSTRAINT "fk_rails_44fd8a9177" FOREIGN KEY ("absprache_id") REFERENCES "nicht_einteilen_absprachens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nicht_einteilen_standort_themen" ADD CONSTRAINT "fk_rails_77f147e42b" FOREIGN KEY ("standort_id") REFERENCES "standorts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nicht_einteilen_standort_themen" ADD CONSTRAINT "fk_rails_fd8449d811" FOREIGN KEY ("thema_id") REFERENCES "themas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "fk_rails_660860a381" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "fk_rails_e70fa12604" FOREIGN KEY ("note_category_id") REFERENCES "note_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notes_histories" ADD CONSTRAINT "fk_rails_22a7972a2b" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notes_histories" ADD CONSTRAINT "fk_rails_2de2e64c38" FOREIGN KEY ("ersteller_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notes_histories" ADD CONSTRAINT "fk_rails_863d1cabe1" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notfallmedizin_registers" ADD CONSTRAINT "fk_rails_7e6262d50a" FOREIGN KEY ("notfallmedizin_status_id") REFERENCES "notfallmedizin_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notfallmedizin_registers" ADD CONSTRAINT "fk_rails_8497fb4436" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "planparameters" ADD CONSTRAINT "fk_rails_024b3ff545" FOREIGN KEY ("parameterset_id") REFERENCES "parametersets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "planparameters" ADD CONSTRAINT "fk_rails_ca3ff20b34" FOREIGN KEY ("einteilungsstatus_id") REFERENCES "einteilungsstatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_diensts" ADD CONSTRAINT "fk_rails_4223136f27" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_diensts" ADD CONSTRAINT "fk_rails_6ac1abf20e" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schichts" ADD CONSTRAINT "fk_rails_b62a6b1ca3" FOREIGN KEY ("arbeitszeittyp_id") REFERENCES "arbeitszeittyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schichts" ADD CONSTRAINT "fk_rails_bd78a44984" FOREIGN KEY ("bedarfs_eintrag_id") REFERENCES "bedarfs_eintrags"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stundennachweis" ADD CONSTRAINT "fk_rails_05b269d564" FOREIGN KEY ("stundennachweis_status_id") REFERENCES "stundennachweis_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stundennachweis" ADD CONSTRAINT "fk_rails_745ff2de6c" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stundennachweis" ADD CONSTRAINT "fk_rails_f7210f061b" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tagesverteiler_layouts" ADD CONSTRAINT "fk_rails_9293af7154" FOREIGN KEY ("verteiler_vorlagen_id") REFERENCES "verteiler_vorlagens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_funktions" ADD CONSTRAINT "fk_rails_0043aa77c2" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_funktions" ADD CONSTRAINT "fk_rails_bec8e126a9" FOREIGN KEY ("funktion_id") REFERENCES "funktions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_kw_krankpuffers" ADD CONSTRAINT "fk_rails_5eded83672" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "fk_rails_9d14807ce7" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "urlaubssaldo_abspraches" ADD CONSTRAINT "fk_rails_cdbde270f4" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_gruppes" ADD CONSTRAINT "fk_rails_0c3453aa77" FOREIGN KEY ("gruppe_id") REFERENCES "gruppes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_gruppes" ADD CONSTRAINT "fk_rails_cec3e4ee8f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "verteiler_vorlagens" ADD CONSTRAINT "fk_rails_02b7f85cbd" FOREIGN KEY ("dienstplan_path_id") REFERENCES "dienstplan_paths"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "verteilungsoverrides" ADD CONSTRAINT "fk_rails_171044f6f2" FOREIGN KEY ("dienstverteilungstyp_id") REFERENCES "dienstverteilungstyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "verteilungsoverrides" ADD CONSTRAINT "fk_rails_4383eac96c" FOREIGN KEY ("parameterset_id") REFERENCES "parametersets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "verteilungsoverrides" ADD CONSTRAINT "fk_rails_e75f8ddeae" FOREIGN KEY ("dienstbedarf_id") REFERENCES "dienstbedarves"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vertrags" ADD CONSTRAINT "fk_rails_b20fe19842" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vertrags" ADD CONSTRAINT "fk_rails_f2cec23b66" FOREIGN KEY ("vertragstyp_id") REFERENCES "vertragstyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vertrags_arbeitszeits" ADD CONSTRAINT "fk_rails_8e47624856" FOREIGN KEY ("vertrag_id") REFERENCES "vertrags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vertrags_phases" ADD CONSTRAINT "fk_rails_4db5fece40" FOREIGN KEY ("vertrag_id") REFERENCES "vertrags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vertrags_phases" ADD CONSTRAINT "fk_rails_f9b8646f70" FOREIGN KEY ("vertragsstufe_id") REFERENCES "vertragsstuves"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vertrags_variantes" ADD CONSTRAINT "fk_rails_e70c474827" FOREIGN KEY ("vertragstyp_id") REFERENCES "vertragstyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vertragsgruppes" ADD CONSTRAINT "fk_rails_26cb34c5df" FOREIGN KEY ("vertragstyp_id") REFERENCES "vertragstyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vertragsstuves" ADD CONSTRAINT "fk_rails_75bdf87379" FOREIGN KEY ("vertragsgruppe_id") REFERENCES "vertragsgruppes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vertragsstuves" ADD CONSTRAINT "fk_rails_91403e2823" FOREIGN KEY ("vertrags_variante_id") REFERENCES "vertrags_variantes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vorlages" ADD CONSTRAINT "fk_rails_176adae085" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vorlages" ADD CONSTRAINT "fk_rails_69e32bd9f7" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wochenbilanzs" ADD CONSTRAINT "fk_rails_4e802b69e3" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wochenbilanzs" ADD CONSTRAINT "fk_rails_eb52f30dad" FOREIGN KEY ("kalenderwoche_id") REFERENCES "kalenderwoches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "zeitraumkategories" ADD CONSTRAINT "fk_rails_cf637e5e41" FOREIGN KEY ("zeitraumregel_id") REFERENCES "zeitraumregels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
