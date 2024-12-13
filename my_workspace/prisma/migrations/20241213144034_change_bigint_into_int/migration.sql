/*
  Warnings:

  - The primary key for the `abwesentheiten_spaltens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `abwesentheiten_spaltens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
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
  - You are about to alter the column `vertrags_phase_id` on the `arbeitszeit_absprachens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
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
  - You are about to alter the column `vertrags_phase_id` on the `automatische_einteilungens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
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
  - You are about to alter the column `vertrags_phase_id` on the `nicht_einteilen_absprachens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
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
  - The primary key for the `oauth_access_tokens_new` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `oauth_access_tokens_new` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `user_id` on the `oauth_access_tokens_new` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `client_id` on the `oauth_access_tokens_new` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `refresh_token_id` on the `oauth_access_tokens_new` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `oauth_applications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `oauth_applications` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `oauth_clients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `oauth_clients` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `oauth_refresh_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `oauth_refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `user_id` on the `oauth_refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `client_id` on the `oauth_refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
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
  - The primary key for the `vertrags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_id` on the `vertrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vertragstyp_id` on the `vertrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vertragsgruppe_id` on the `vertrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vertrags_aenderungs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertrags_aenderungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vertrags_phases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertrags_phases` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vertrag_id` on the `vertrags_phases` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
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
ALTER TABLE "abwesentheitenueberblick_counters" DROP CONSTRAINT "fk_rails_daea018e64";

-- DropForeignKey
ALTER TABLE "account_infos" DROP CONSTRAINT "fk_rails_58245fd0a4";

-- DropForeignKey
ALTER TABLE "benachrichtigungs" DROP CONSTRAINT "fk_rails_2d4826acc2";

-- DropForeignKey
ALTER TABLE "dienstbedarves" DROP CONSTRAINT "fk_rails_05b1cdbc7e";

-- DropForeignKey
ALTER TABLE "dienstbedarves" DROP CONSTRAINT "fk_rails_434a8ef988";

-- DropForeignKey
ALTER TABLE "dienstbedarves" DROP CONSTRAINT "fk_rails_9ae4035ecf";

-- DropForeignKey
ALTER TABLE "diensteinteilungs" DROP CONSTRAINT "fk_rails_0c69b8191a";

-- DropForeignKey
ALTER TABLE "diensteinteilungs" DROP CONSTRAINT "fk_rails_2a437cd8da";

-- DropForeignKey
ALTER TABLE "diensteinteilungs" DROP CONSTRAINT "fk_rails_37afbd5ac9";

-- DropForeignKey
ALTER TABLE "diensteinteilungs" DROP CONSTRAINT "fk_rails_8d2ed7f2ce";

-- DropForeignKey
ALTER TABLE "dienstfreigabes" DROP CONSTRAINT "fk_rails_3a9471d624";

-- DropForeignKey
ALTER TABLE "dienstfreigabes" DROP CONSTRAINT "fk_rails_7c27a8ab72";

-- DropForeignKey
ALTER TABLE "dienstfreigabes" DROP CONSTRAINT "fk_rails_ab3f7cd811";

-- DropForeignKey
ALTER TABLE "dienstfreigabes" DROP CONSTRAINT "fk_rails_b201a8e9f5";

-- DropForeignKey
ALTER TABLE "dienstplans" DROP CONSTRAINT "fk_rails_55a766d44f";

-- DropForeignKey
ALTER TABLE "einteilung_rotations" DROP CONSTRAINT "fk_rails_0754d2d566";

-- DropForeignKey
ALTER TABLE "einteilung_rotations" DROP CONSTRAINT "fk_rails_5eeae3bb85";

-- DropForeignKey
ALTER TABLE "freistellungs" DROP CONSTRAINT "fk_rails_f7bfd583fd";

-- DropForeignKey
ALTER TABLE "notfallmedizin_registers" DROP CONSTRAINT "fk_rails_7e6262d50a";

-- DropForeignKey
ALTER TABLE "oauth_access_tokens_new" DROP CONSTRAINT "oauth_access_tokens_new_client_id_fkey";

-- DropForeignKey
ALTER TABLE "oauth_access_tokens_new" DROP CONSTRAINT "oauth_access_tokens_new_refresh_token_id_fkey";

-- DropForeignKey
ALTER TABLE "oauth_access_tokens_new" DROP CONSTRAINT "oauth_access_tokens_new_user_id_fkey";

-- DropForeignKey
ALTER TABLE "oauth_refresh_tokens" DROP CONSTRAINT "oauth_refresh_tokens_client_id_fkey";

-- DropForeignKey
ALTER TABLE "oauth_refresh_tokens" DROP CONSTRAINT "oauth_refresh_tokens_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users_gruppes" DROP CONSTRAINT "fk_rails_0c3453aa77";

-- DropForeignKey
ALTER TABLE "users_gruppes" DROP CONSTRAINT "fk_rails_cec3e4ee8f";

-- DropForeignKey
ALTER TABLE "vertrags" DROP CONSTRAINT "fk_rails_b20fe19842";

-- AlterTable
ALTER TABLE "abwesentheiten_spaltens" DROP CONSTRAINT "abwesentheiten_spaltens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "abwesentheiten_spaltens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "abwesentheitenueberblick_counters" DROP CONSTRAINT "abwesentheitenueberblick_counters_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "abwesentheitenueberblick_counters_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "abwesentheitenueberblick_settings" DROP CONSTRAINT "abwesentheitenueberblick_settings_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "abwesentheitenueberblick_settings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "abwesentheitenueberblicks" DROP CONSTRAINT "abwesentheitenueberblicks_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "abwesentheitenueberblicks_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "account_infos" DROP CONSTRAINT "account_infos_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "account_infos_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "active_admin_comments" DROP CONSTRAINT "active_admin_comments_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "active_admin_comments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "active_storage_attachments" DROP CONSTRAINT "active_storage_attachments_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "active_storage_attachments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "active_storage_blobs" DROP CONSTRAINT "active_storage_blobs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "active_storage_blobs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "admin_users" DROP CONSTRAINT "admin_users_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "allgemeine_vorlages" DROP CONSTRAINT "allgemeine_vorlages_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vorlage_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplan_path_id" SET DATA TYPE INTEGER,
ALTER COLUMN "pdf_zusatz_dienste" SET DATA TYPE INTEGER[],
ADD CONSTRAINT "allgemeine_vorlages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "antraege_histories" DROP CONSTRAINT "antraege_histories_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "antraege_id" SET DATA TYPE INTEGER,
ALTER COLUMN "antragsstatus_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "antraege_histories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "antraeges" DROP CONSTRAINT "antraeges_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "antragstyp_id" SET DATA TYPE INTEGER,
ALTER COLUMN "antragsstatus_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "antraeges_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "antragsstatuses" DROP CONSTRAINT "antragsstatuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "antragsstatuses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "antragstyps" DROP CONSTRAINT "antragstyps_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ALTER COLUMN "we_holiday_po_dienst_id" SET DATA TYPE INTEGER,
ALTER COLUMN "check_alternative_po_dienst_id" SET DATA TYPE INTEGER,
ALTER COLUMN "alternative_po_dienst_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "antragstyps_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "arbeitsplatzs" DROP CONSTRAINT "arbeitsplatzs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "bereich_id" SET DATA TYPE INTEGER,
ALTER COLUMN "standort_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "arbeitsplatzs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "arbeitszeit_absprachens" DROP CONSTRAINT "arbeitszeit_absprachens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumkategorie_id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertrags_phase_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "arbeitszeit_absprachens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "arbeitszeittyps" DROP CONSTRAINT "arbeitszeittyps_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "arbeitszeittyps_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "arbeitszeitverteilungs" DROP CONSTRAINT "arbeitszeitverteilungs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstgruppe_id" SET DATA TYPE INTEGER,
ALTER COLUMN "pre_dienstgruppe_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "arbeitszeitverteilungs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "automatische_einteilungens" DROP CONSTRAINT "automatische_einteilungens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertrags_phase_id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumkategorie_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "automatische_einteilungens_pkey" PRIMARY KEY ("id");

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

-- AlterTable
ALTER TABLE "benachrichtigungs" DROP CONSTRAINT "benachrichtigungs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "benachrichtigungs_status_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "benachrichtigungs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "benachrichtigungs_statuses" DROP CONSTRAINT "benachrichtigungs_statuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "benachrichtigungs_statuses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "benachrichtigungs_typs" DROP CONSTRAINT "benachrichtigungs_typs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "benachrichtigungs_typs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "bereich_tagesverteilers" DROP CONSTRAINT "bereich_tagesverteilers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "tagesverteiler_id" SET DATA TYPE INTEGER,
ALTER COLUMN "bereich_id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "bereich_tagesverteilers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "bereich_wochenverteilers" DROP CONSTRAINT "bereich_wochenverteilers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "bereich_id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "bereich_wochenverteilers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "bereiches" DROP CONSTRAINT "bereiches_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "bereiches_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "bereiches_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "channel_room_users" DROP CONSTRAINT "channel_room_users_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "channel_room_id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "channel_room_users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "channel_rooms" DROP CONSTRAINT "channel_rooms_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "channel_rooms_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "datei_typs" DROP CONSTRAINT "datei_typs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "datei_typs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dateis" DROP CONSTRAINT "dateis_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dateis_pkey" PRIMARY KEY ("id");

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

-- AlterTable
ALTER TABLE "dienstbedarveshistory" DROP CONSTRAINT "dienstbedarveshistory_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstbedarf_id" SET DATA TYPE INTEGER,
ALTER COLUMN "arbeitszeitverteilungs_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstbedarveshistory_pkey" PRIMARY KEY ("id");

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

-- AlterTable
ALTER TABLE "diensteinteilungs_versions" DROP CONSTRAINT "diensteinteilungs_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "diensteinteilungs_versions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstfreigabe_versions" DROP CONSTRAINT "dienstfreigabe_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstfreigabe_versions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstfreigabes" DROP CONSTRAINT "dienstfreigabes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "freigabetyp_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "freigabestatus_id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ALTER COLUMN "standort_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstfreigabes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstgruppes" DROP CONSTRAINT "dienstgruppes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienste" SET DATA TYPE INTEGER[],
ADD CONSTRAINT "dienstgruppes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstkategorie_teams" DROP CONSTRAINT "dienstkategorie_teams_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstkategorie_id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstkategorie_teams_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstkategories" DROP CONSTRAINT "dienstkategories_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstkategories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstkategoriethemas" DROP CONSTRAINT "dienstkategoriethemas_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstkategorie_id" SET DATA TYPE INTEGER,
ALTER COLUMN "thema_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstkategoriethemas_pkey" PRIMARY KEY ("id");

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

-- AlterTable
ALTER TABLE "dienstplan_custom_felds" DROP CONSTRAINT "dienstplan_custom_felds_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vorlage_id" SET DATA TYPE INTEGER,
ALTER COLUMN "index" SET DATA TYPE INTEGER,
ALTER COLUMN "count_all_typ" SET DATA TYPE INTEGER,
ALTER COLUMN "custom_counter_ids" SET DATA TYPE INTEGER[],
ADD CONSTRAINT "dienstplan_custom_felds_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstplan_paths" DROP CONSTRAINT "dienstplan_paths_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "planinterval_id" SET DATA TYPE INTEGER,
ALTER COLUMN "plan_tab_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplan_paths_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstplanbedarves" DROP CONSTRAINT "dienstplanbedarves_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienste" SET DATA TYPE INTEGER[],
ADD CONSTRAINT "dienstplanbedarves_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstplaner_user_farbgruppens" DROP CONSTRAINT "dienstplaner_user_farbgruppens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ALTER COLUMN "pos" SET DATA TYPE INTEGER,
ALTER COLUMN "dienste_ids" SET DATA TYPE INTEGER[],
ALTER COLUMN "dienstkategorien_ids" SET DATA TYPE INTEGER[],
ADD CONSTRAINT "dienstplaner_user_farbgruppens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstplaner_user_settings" DROP CONSTRAINT "dienstplaner_user_settings_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplaner_user_settings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstplaners_teams" DROP CONSTRAINT "dienstplaners_teams_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplaners_teams_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstplaners_verteiler_vorlagens" DROP CONSTRAINT "dienstplaners_verteiler_vorlagens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ALTER COLUMN "vorlage_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplaners_verteiler_vorlagens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstplans" DROP CONSTRAINT "dienstplans_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "parameterset_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplanstatus_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplanbedarf_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplans_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstplanstatuses" DROP CONSTRAINT "dienstplanstatuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplanstatuses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstratings" DROP CONSTRAINT "dienstratings_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstratings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "diensts" DROP CONSTRAINT "diensts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "diensts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstverteilungstyps" DROP CONSTRAINT "dienstverteilungstyps_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstverteilungstyps_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstwunsches" DROP CONSTRAINT "dienstwunsches_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstkategorie_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstwunsches_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "einteilung_rotations" DROP CONSTRAINT "einteilung_rotations_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "kontingent_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "einteilung_rotations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "einteilung_versions" DROP CONSTRAINT "einteilung_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "einteilung_versions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "einteilungskontexts" DROP CONSTRAINT "einteilungskontexts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "einteilungskontexts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "einteilungsstatuses" DROP CONSTRAINT "einteilungsstatuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "einteilungsstatuses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "feiertages" DROP CONSTRAINT "feiertages_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "feiertages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "freigabestatuses" DROP CONSTRAINT "freigabestatuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "freigabestatuses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "freigabetyps" DROP CONSTRAINT "freigabetyps_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "freigabetyps_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "freistellungs" DROP CONSTRAINT "freistellungs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "freistellungs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "funktions" DROP CONSTRAINT "funktions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "funktions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "geraetebereiches" DROP CONSTRAINT "geraetebereiches_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "geraetebereiches_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "geraeteklasses" DROP CONSTRAINT "geraeteklasses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "geraeteklasses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "geraetepasses" DROP CONSTRAINT "geraetepasses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "geraet_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "geraetepasses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "geraets" DROP CONSTRAINT "geraets_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "geraeteklasse_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "geraets_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "gruppes" DROP CONSTRAINT "gruppes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "gruppes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "hains_tasks" DROP CONSTRAINT "hains_tasks_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "benachrichtigungs_typ_id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumkategorie_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "hains_tasks_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "jahresbilanzs" DROP CONSTRAINT "jahresbilanzs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "jahresbilanzs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "kalendermarkierungs" DROP CONSTRAINT "kalendermarkierungs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "kalendermarkierungs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "kalenderwoches" DROP CONSTRAINT "kalenderwoches_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "kalenderwoches_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "kontingent_po_diensts" DROP CONSTRAINT "kontingent_po_diensts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "kontingent_id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "kontingent_po_diensts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "kontingents" DROP CONSTRAINT "kontingents_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "thema_ids" SET DATA TYPE INTEGER[],
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "kontingents_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "kostenstelles" DROP CONSTRAINT "kostenstelles_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "kostenstelles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "links" DROP CONSTRAINT "links_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "links_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "mailer_addresses" DROP CONSTRAINT "mailer_addresses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mailer_addresses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "mailer_ccs" DROP CONSTRAINT "mailer_ccs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mailer_context_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mailer_addresse_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mailer_ccs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "mailer_contexts" DROP CONSTRAINT "mailer_contexts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "from_id" SET DATA TYPE INTEGER,
ALTER COLUMN "reply_to_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mailer_contexts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "mailer_tos" DROP CONSTRAINT "mailer_tos_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mailer_context_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mailer_addresse_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mailer_tos_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "merkmal_options" DROP CONSTRAINT "merkmal_options_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "merkmal_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "merkmal_options_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "merkmals" DROP CONSTRAINT "merkmals_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "merkmals_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "mitarbeiter_default_eingeteilts" DROP CONSTRAINT "mitarbeiter_default_eingeteilts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "po_dienst_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mitarbeiter_default_eingeteilts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "mitarbeitermerkmals" DROP CONSTRAINT "mitarbeitermerkmals_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "merkmal_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mitarbeitermerkmals_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "mitarbeiters" DROP CONSTRAINT "mitarbeiters_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "funktion_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mitarbeiters_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "nef_fahrts" DROP CONSTRAINT "nef_fahrts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "notfallmedizin_register_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "nef_fahrts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "nicht_einteilen_absprachens" DROP CONSTRAINT "nicht_einteilen_absprachens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumkategorie_id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertrags_phase_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "nicht_einteilen_absprachens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "nicht_einteilen_standort_themen" DROP CONSTRAINT "nicht_einteilen_standort_themen_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "absprache_id" SET DATA TYPE INTEGER,
ALTER COLUMN "standort_id" SET DATA TYPE INTEGER,
ALTER COLUMN "thema_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "nicht_einteilen_standort_themen_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "note_categories" DROP CONSTRAINT "note_categories_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "note_categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notes" DROP CONSTRAINT "notes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "ersteller_id" SET DATA TYPE INTEGER,
ALTER COLUMN "note_category_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notes_histories" DROP CONSTRAINT "notes_histories_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "note_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "ersteller_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "notes_histories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notfallmedizin_registers" DROP CONSTRAINT "notfallmedizin_registers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "notfallmedizin_status_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "notfallmedizin_registers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notfallmedizin_statuses" DROP CONSTRAINT "notfallmedizin_statuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "notfallmedizin_statuses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "oauth_access_grants" DROP CONSTRAINT "oauth_access_grants_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "oauth_access_grants_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "oauth_access_tokens" DROP CONSTRAINT "oauth_access_tokens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "oauth_access_tokens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "oauth_access_tokens_new" DROP CONSTRAINT "oauth_access_tokens_new_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ALTER COLUMN "client_id" SET DATA TYPE INTEGER,
ALTER COLUMN "refresh_token_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "oauth_access_tokens_new_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "oauth_applications" DROP CONSTRAINT "oauth_applications_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "oauth_applications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "oauth_clients" DROP CONSTRAINT "oauth_clients_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "oauth_refresh_tokens" DROP CONSTRAINT "oauth_refresh_tokens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ALTER COLUMN "client_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "oauth_refresh_tokens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "parametersets" DROP CONSTRAINT "parametersets_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "parametersets_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "plan_tabs" DROP CONSTRAINT "plan_tabs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "plan_tabs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "planintervals" DROP CONSTRAINT "planintervals_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "planintervals_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "planparameters" DROP CONSTRAINT "planparameters_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "parameterset_id" SET DATA TYPE INTEGER,
ALTER COLUMN "einteilungsstatus_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "planparameters_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "po_diensts" DROP CONSTRAINT "po_diensts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "thema_ids" SET DATA TYPE INTEGER[],
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ALTER COLUMN "kostenstelle_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "po_diensts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "schichts" DROP CONSTRAINT "schichts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "bedarfs_eintrag_id" SET DATA TYPE INTEGER,
ALTER COLUMN "arbeitszeittyp_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "schichts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "standorts" DROP CONSTRAINT "standorts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "standorts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "stundennachweis" DROP CONSTRAINT "stundennachweis_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "kostenstelle_id" SET DATA TYPE INTEGER,
ALTER COLUMN "stundennachweis_status_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "stundennachweis_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "stundennachweis_statuses" DROP CONSTRAINT "stundennachweis_statuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "stundennachweis_statuses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tagesverteiler_layouts" DROP CONSTRAINT "tagesverteiler_layouts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "verteiler_vorlagen_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "tagesverteiler_layouts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tagesverteiler_user_settings" DROP CONSTRAINT "tagesverteiler_user_settings_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "tagesverteiler_user_settings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tagesverteilers" DROP CONSTRAINT "tagesverteilers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "tagesverteilers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tagkategories" DROP CONSTRAINT "tagkategories_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "tagkategories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "team_funktions" DROP CONSTRAINT "team_funktions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ALTER COLUMN "funktion_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "team_funktions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "team_kw_krankpuffer_versions" DROP CONSTRAINT "team_kw_krankpuffer_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "team_kw_krankpuffer_versions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "team_kw_krankpuffers" DROP CONSTRAINT "team_kw_krankpuffers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "team_kw_krankpuffers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "teams" DROP CONSTRAINT "teams_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "kostenstelle_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "telefonlistes" DROP CONSTRAINT "telefonlistes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "telefonlistes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "themas" DROP CONSTRAINT "themas_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "themas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_versions" DROP CONSTRAINT "user_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "user_versions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users_gruppes" ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ALTER COLUMN "gruppe_id" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "version_associations" DROP CONSTRAINT "version_associations_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "version_associations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "versions" DROP CONSTRAINT "versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "versions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "verteiler_tagesverteilers" DROP CONSTRAINT "verteiler_tagesverteilers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "verteiler_tagesverteilers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "verteiler_vorlagens" DROP CONSTRAINT "verteiler_vorlagens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplan_path_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "verteiler_vorlagens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "verteilungsoverrides" DROP CONSTRAINT "verteilungsoverrides_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "parameterset_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstbedarf_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstverteilungstyp_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "verteilungsoverrides_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vertrags" DROP CONSTRAINT "vertrags_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertragstyp_id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertragsgruppe_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertrags_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vertrags_aenderungs" DROP CONSTRAINT "vertrags_aenderungs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertrags_aenderungs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vertrags_phases" DROP CONSTRAINT "vertrags_phases_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertrag_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertrags_phases_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vertrags_variantes" DROP CONSTRAINT "vertrags_variantes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertragstyp_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertrags_variantes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vertragsgruppes" DROP CONSTRAINT "vertragsgruppes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertragstyp_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertragsgruppes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vertragsstuves" DROP CONSTRAINT "vertragsstuves_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertragsgruppe_id" SET DATA TYPE INTEGER,
ALTER COLUMN "vertrags_variante_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertragsstuves_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vertragstyps" DROP CONSTRAINT "vertragstyps_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertragstyps_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vorlages" DROP CONSTRAINT "vorlages_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vorlages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "wochenbilanzs" DROP CONSTRAINT "wochenbilanzs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "kalenderwoche_id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "wochenbilanzs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "zeitraumkategories" DROP CONSTRAINT "zeitraumkategories_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumregel_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "zeitraumkategories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "zeitraumregels" DROP CONSTRAINT "zeitraumregels_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "zeitraumregels_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "abwesentheitenueberblick_counters" ADD CONSTRAINT "fk_rails_daea018e64" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "account_infos" ADD CONSTRAINT "fk_rails_58245fd0a4" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "benachrichtigungs" ADD CONSTRAINT "fk_rails_2d4826acc2" FOREIGN KEY ("benachrichtigungs_status_id") REFERENCES "benachrichtigungs_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "fk_rails_05b1cdbc7e" FOREIGN KEY ("dienstverteilungstyp_id") REFERENCES "dienstverteilungstyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "fk_rails_434a8ef988" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "fk_rails_9ae4035ecf" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "fk_rails_0c69b8191a" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "fk_rails_2a437cd8da" FOREIGN KEY ("einteilungsstatus_id") REFERENCES "einteilungsstatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "fk_rails_37afbd5ac9" FOREIGN KEY ("dienstplan_id") REFERENCES "dienstplans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "fk_rails_8d2ed7f2ce" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "fk_rails_3a9471d624" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "fk_rails_7c27a8ab72" FOREIGN KEY ("freigabetyp_id") REFERENCES "freigabetyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "fk_rails_ab3f7cd811" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "fk_rails_b201a8e9f5" FOREIGN KEY ("freigabestatus_id") REFERENCES "freigabestatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplans" ADD CONSTRAINT "fk_rails_55a766d44f" FOREIGN KEY ("dienstplanstatus_id") REFERENCES "dienstplanstatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einteilung_rotations" ADD CONSTRAINT "fk_rails_0754d2d566" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "einteilung_rotations" ADD CONSTRAINT "fk_rails_5eeae3bb85" FOREIGN KEY ("kontingent_id") REFERENCES "kontingents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "freistellungs" ADD CONSTRAINT "fk_rails_f7bfd583fd" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notfallmedizin_registers" ADD CONSTRAINT "fk_rails_7e6262d50a" FOREIGN KEY ("notfallmedizin_status_id") REFERENCES "notfallmedizin_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "oauth_access_tokens_new" ADD CONSTRAINT "oauth_access_tokens_new_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_access_tokens_new" ADD CONSTRAINT "oauth_access_tokens_new_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "oauth_clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_access_tokens_new" ADD CONSTRAINT "oauth_access_tokens_new_refresh_token_id_fkey" FOREIGN KEY ("refresh_token_id") REFERENCES "oauth_refresh_tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "oauth_clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_gruppes" ADD CONSTRAINT "fk_rails_0c3453aa77" FOREIGN KEY ("gruppe_id") REFERENCES "gruppes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_gruppes" ADD CONSTRAINT "fk_rails_cec3e4ee8f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vertrags" ADD CONSTRAINT "fk_rails_b20fe19842" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
