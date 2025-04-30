/*
  Warnings:

  - The primary key for the `abwesentheiten_spaltens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `abwesentheiten_spaltens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `abwesentheitenueberblick_counters` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `abwesentheitenueberblick_counters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `abwesentheitenueberblick_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `abwesentheitenueberblick_settings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `abwesentheitenueberblicks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `abwesentheitenueberblicks` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `nameKurz` on the `account_infos` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `telephone` on the `account_infos` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `privateEmail` on the `account_infos` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `privateTelephone` on the `account_infos` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - The primary key for the `active_admin_comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `active_admin_comments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `resource_id` on the `active_admin_comments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `author_id` on the `active_admin_comments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `active_storage_attachments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `active_storage_attachments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `record_id` on the `active_storage_attachments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `blob_id` on the `active_storage_attachments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
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
  - You are about to alter the column `antraege_id` on the `antraege_histories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `antragsstatus_id` on the `antraege_histories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `antraeges` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `antraeges` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `antragstyp_id` on the `antraeges` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `antragsstatus_id` on the `antraeges` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `antragsstatuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `antragsstatuses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `antragstyps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `antragstyps` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `arbeitsplatzs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `arbeitsplatzs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `arbeitszeit_absprachens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `arbeitszeit_absprachens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `zeitraumkategorie_id` on the `arbeitszeit_absprachens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `arbeitszeittyps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `arbeitszeittyps` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `arbeitszeitverteilungs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `arbeitszeitverteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstgruppe_id` on the `arbeitszeitverteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `pre_dienstgruppe_id` on the `arbeitszeitverteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `automatische_einteilungens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `automatische_einteilungens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `zeitraumkategorie_id` on the `automatische_einteilungens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `bedarfs_eintrags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `bedarfs_eintrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstplanbedarf_id` on the `bedarfs_eintrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstverteilungstyp_id` on the `bedarfs_eintrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `first_entry` on the `bedarfs_eintrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `kostenstelle_id` on the `bedarfs_eintrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `benachrichtigungs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `benachrichtigungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `benachrichtigungs_status_id` on the `benachrichtigungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `benachrichtigungs_statuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `benachrichtigungs_statuses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `benachrichtigungs_typs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `benachrichtigungs_typs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `bereich_tagesverteilers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `bereich_tagesverteilers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `tagesverteiler_id` on the `bereich_tagesverteilers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `bereich_wochenverteilers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `bereich_wochenverteilers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `name` on the `bereiches` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `name_url` on the `bereiches` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `bereiches_id` on the `bereiches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `channel_room_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `channel_room_users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `channel_room_id` on the `channel_room_users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `channel_rooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `channel_rooms` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `datei_typs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `datei_typs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dateis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `datei_typs_id` on the `dateis` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `dateis` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `ersteller_id` on the `dateis` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `besitzer_id` on the `dateis` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstverteilungstyp_id` on the `dienstbedarves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `arbeitszeitverteilung_id` on the `dienstbedarves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `zeitraumkategories_id` on the `dienstbedarves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `kostenstelle_id` on the `dienstbedarves` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstbedarveshistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstbedarveshistory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstbedarf_id` on the `dienstbedarveshistory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `arbeitszeitverteilungs_id` on the `dienstbedarveshistory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `einteilungsstatus_id` on the `diensteinteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstplan_id` on the `diensteinteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `einteilungskontext_id` on the `diensteinteilungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `diensteinteilungs_versions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `diensteinteilungs_versions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
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
  - You are about to drop the column `count_arbeitszeiten` on the `dienstplan_custom_counters` table. All the data in the column will be lost.
  - You are about to drop the column `counter_typ` on the `dienstplan_custom_counters` table. All the data in the column will be lost.
  - You are about to drop the column `index_all_type` on the `dienstplan_custom_counters` table. All the data in the column will be lost.
  - You are about to drop the column `spalten_counter_ids` on the `dienstplan_custom_counters` table. All the data in the column will be lost.
  - You are about to drop the column `team_ids` on the `dienstplan_custom_counters` table. All the data in the column will be lost.
  - You are about to drop the column `zeilen_counter_ids` on the `dienstplan_custom_counters` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `dienstplan_custom_counters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
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
  - You are about to alter the column `pos` on the `dienstplaner_user_farbgruppens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienste_ids` on the `dienstplaner_user_farbgruppens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstkategorien_ids` on the `dienstplaner_user_farbgruppens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstplaner_user_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstplaner_user_settings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstplaners_teams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstplaners_teams` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `team_id` on the `dienstplaners_teams` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstplaners_verteiler_vorlagens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstplaners_verteiler_vorlagens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
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
  - You are about to alter the column `dienstname` on the `diensts` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `mitarbeiter` on the `diensts` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - The primary key for the `dienstverteilungstyps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstverteilungstyps` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `dienstwunsches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `dienstwunsches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstkategorie_id` on the `dienstwunsches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `einteilungskontexts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `einteilungskontexts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `einteilungsstatuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `einteilungsstatuses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `feiertages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `feiertages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `mitarbeiter_planname` on the `freistellungs` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `einteilung` on the `freistellungs` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - The primary key for the `funktions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `funktions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `team_id` on the `funktions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `geraetebereiches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `geraetebereiches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `geraeteklasses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `geraeteklasses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `geraetepasses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `geraetepasses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `geraet_id` on the `geraetepasses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `geraets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `geraets` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `geraeteklasse_id` on the `geraets` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `name` on the `gruppes` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `resource_type` on the `gruppes` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - The primary key for the `hains_tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `hains_tasks` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `benachrichtigungs_typ_id` on the `hains_tasks` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `zeitraumkategorie_id` on the `hains_tasks` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `jahresbilanzs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `jahresbilanzs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `kalendermarkierungs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `kalendermarkierungs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `kalenderwoches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `kalenderwoches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `kontingent_po_diensts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `kontingent_po_diensts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
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
  - The primary key for the `mitarbeitermerkmals` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `mitarbeitermerkmals` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `merkmal_id` on the `mitarbeitermerkmals` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `name` on the `mitarbeiters` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `planname` on the `mitarbeiters` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `funktion_id` on the `mitarbeiters` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `nef_fahrts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `nef_fahrts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `notfallmedizin_register_id` on the `nef_fahrts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `nicht_einteilen_absprachens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `nicht_einteilen_absprachens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `zeitraumkategorie_id` on the `nicht_einteilen_absprachens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `nicht_einteilen_standort_themen` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `nicht_einteilen_standort_themen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `absprache_id` on the `nicht_einteilen_standort_themen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `thema_id` on the `nicht_einteilen_standort_themen` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `note_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `note_categories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `notes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `notes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `ersteller_id` on the `notes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `note_category_id` on the `notes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `notes_histories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `notes_histories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `note_id` on the `notes_histories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `notfallmedizin_registers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `notfallmedizin_registers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `notfallmedizin_status_id` on the `notfallmedizin_registers` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `notfallmedizin_statuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `notfallmedizin_statuses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `token` on the `oauth_access_grants` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `scopes` on the `oauth_access_grants` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `token` on the `oauth_access_tokens` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `refresh_token` on the `oauth_access_tokens` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `scopes` on the `oauth_access_tokens` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `name` on the `oauth_applications` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `uid` on the `oauth_applications` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `secret` on the `oauth_applications` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `scopes` on the `oauth_applications` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
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
  - You are about to alter the column `thema_ids` on the `po_diensts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `team_id` on the `po_diensts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `kostenstelle_id` on the `po_diensts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `schichts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `schichts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `bedarfs_eintrag_id` on the `schichts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `arbeitszeittyp_id` on the `schichts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `name` on the `standorts` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `name_url` on the `standorts` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `long` on the `standorts` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(10)`.
  - You are about to alter the column `lat` on the `standorts` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(10)`.
  - The primary key for the `stundennachweis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `stundennachweis` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
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
  - The primary key for the `themas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `themas` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `urlaubssaldo_abspraches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `urlaubssaldo_abspraches` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `login` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `encrypted_password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `reset_password_token` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `current_sign_in_ip` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `last_sign_in_ip` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `confirmation_token` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `unconfirmed_email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `unlock_token` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `account_info_id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `verteiler_vorlagens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `verteiler_vorlagens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstplan_path_id` on the `verteiler_vorlagens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `verteilungsoverrides` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `verteilungsoverrides` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `parameterset_id` on the `verteilungsoverrides` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dienstverteilungstyp_id` on the `verteilungsoverrides` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vertrag_versions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertrag_versions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `vertragstyp_id` on the `vertrags` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vertrags_arbeitszeits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertrags_arbeitszeits` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `vertrags_phases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vertrags_phases` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
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
  - You are about to alter the column `team_id` on the `vorlages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `wochenbilanzs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `wochenbilanzs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `kalenderwoche_id` on the `wochenbilanzs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `zeitraumkategories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `zeitraumkategories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `zeitraumregel_id` on the `zeitraumkategories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `zeitraumregels` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `zeitraumregels` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - A unique constraint covering the columns `[mitarbeiter_id]` on the table `account_infos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `account_infos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[datei_id]` on the table `antraeges` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[planname]` on the table `mitarbeiters` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[account_info_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `mitarbeiter_id` on table `antraeges` required. This step will fail if there are existing NULL values in that column.
  - Made the column `antragstyp_id` on table `antraeges` required. This step will fail if there are existing NULL values in that column.
  - Made the column `antragsstatus_id` on table `antraeges` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mitarbeiter_id` on table `automatische_einteilungens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `po_dienst_id` on table `automatische_einteilungens` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `datei_typ_id` to the `dateis` table without a default value. This is not possible if the table is not empty.
  - Made the column `geraeteklasse_id` on table `geraets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `team_id` on table `team_funktions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `funktion_id` on table `team_funktions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `team_id` on table `team_kw_krankpuffers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `teams` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `users_gruppes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gruppe_id` on table `users_gruppes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `anfang` on table `vertrags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ende` on table `vertrags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `von` on table `vertrags_arbeitszeits` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bis` on table `vertrags_arbeitszeits` required. This step will fail if there are existing NULL values in that column.
  - Made the column `von` on table `vertrags_phases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bis` on table `vertrags_phases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `von` on table `vertrags_variantes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bis` on table `vertrags_variantes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "account_infos" DROP CONSTRAINT "fk_rails_0978a630f4";

-- DropForeignKey
ALTER TABLE "active_storage_attachments" DROP CONSTRAINT "fk_rails_c3b3935057";

-- DropForeignKey
ALTER TABLE "allgemeine_vorlages" DROP CONSTRAINT "fk_rails_01e0e49755";

-- DropForeignKey
ALTER TABLE "allgemeine_vorlages" DROP CONSTRAINT "fk_rails_0c44f45c22";

-- DropForeignKey
ALTER TABLE "antraege_histories" DROP CONSTRAINT "fk_rails_702e44afb0";

-- DropForeignKey
ALTER TABLE "antraege_histories" DROP CONSTRAINT "fk_rails_d2c22a9e1a";

-- DropForeignKey
ALTER TABLE "antraeges" DROP CONSTRAINT "fk_rails_0101e13655";

-- DropForeignKey
ALTER TABLE "antraeges" DROP CONSTRAINT "fk_rails_f887e40996";

-- DropForeignKey
ALTER TABLE "arbeitszeit_absprachens" DROP CONSTRAINT "fk_rails_4a9339ea11";

-- DropForeignKey
ALTER TABLE "arbeitszeitverteilungs" DROP CONSTRAINT "fk_rails_7b802cfd89";

-- DropForeignKey
ALTER TABLE "arbeitszeitverteilungs" DROP CONSTRAINT "fk_rails_fe777cf5f2";

-- DropForeignKey
ALTER TABLE "automatische_einteilungens" DROP CONSTRAINT "fk_rails_3651daf545";

-- DropForeignKey
ALTER TABLE "bedarfs_eintrags" DROP CONSTRAINT "fk_rails_00545eb639";

-- DropForeignKey
ALTER TABLE "bedarfs_eintrags" DROP CONSTRAINT "fk_rails_0f89581c7b";

-- DropForeignKey
ALTER TABLE "bedarfs_eintrags" DROP CONSTRAINT "fk_rails_aa2e3d95aa";

-- DropForeignKey
ALTER TABLE "benachrichtigungs" DROP CONSTRAINT "fk_rails_2d4826acc2";

-- DropForeignKey
ALTER TABLE "bereich_tagesverteilers" DROP CONSTRAINT "fk_rails_fdf23f3f87";

-- DropForeignKey
ALTER TABLE "channel_room_users" DROP CONSTRAINT "fk_rails_07d9c65830";

-- DropForeignKey
ALTER TABLE "dienstbedarves" DROP CONSTRAINT "fk_rails_05b1cdbc7e";

-- DropForeignKey
ALTER TABLE "dienstbedarves" DROP CONSTRAINT "fk_rails_2b3b1e6b71";

-- DropForeignKey
ALTER TABLE "dienstbedarves" DROP CONSTRAINT "fk_rails_495258659a";

-- DropForeignKey
ALTER TABLE "dienstbedarves" DROP CONSTRAINT "fk_rails_a8c5f3913d";

-- DropForeignKey
ALTER TABLE "diensteinteilungs" DROP CONSTRAINT "fk_rails_2a437cd8da";

-- DropForeignKey
ALTER TABLE "diensteinteilungs" DROP CONSTRAINT "fk_rails_37afbd5ac9";

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
ALTER TABLE "dienstplaners_teams" DROP CONSTRAINT "fk_rails_75274a3398";

-- DropForeignKey
ALTER TABLE "dienstplaners_verteiler_vorlagens" DROP CONSTRAINT "fk_rails_4924e39a88";

-- DropForeignKey
ALTER TABLE "dienstplans" DROP CONSTRAINT "fk_rails_36027a91b3";

-- DropForeignKey
ALTER TABLE "dienstplans" DROP CONSTRAINT "fk_rails_55a766d44f";

-- DropForeignKey
ALTER TABLE "dienstplans" DROP CONSTRAINT "fk_rails_5f55bd1d2e";

-- DropForeignKey
ALTER TABLE "dienstwunsches" DROP CONSTRAINT "fk_rails_28e8d817f4";

-- DropForeignKey
ALTER TABLE "funktions" DROP CONSTRAINT "fk_rails_1a9f2cf982";

-- DropForeignKey
ALTER TABLE "geraetepasses" DROP CONSTRAINT "fk_rails_01560b5637";

-- DropForeignKey
ALTER TABLE "geraets" DROP CONSTRAINT "fk_rails_87c8fbadfa";

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
ALTER TABLE "mitarbeitermerkmals" DROP CONSTRAINT "fk_rails_41412590af";

-- DropForeignKey
ALTER TABLE "mitarbeiters" DROP CONSTRAINT "fk_rails_5006408ec6";

-- DropForeignKey
ALTER TABLE "nef_fahrts" DROP CONSTRAINT "fk_rails_be395c9f8e";

-- DropForeignKey
ALTER TABLE "nicht_einteilen_absprachens" DROP CONSTRAINT "fk_rails_f981032257";

-- DropForeignKey
ALTER TABLE "nicht_einteilen_standort_themen" DROP CONSTRAINT "fk_rails_44fd8a9177";

-- DropForeignKey
ALTER TABLE "nicht_einteilen_standort_themen" DROP CONSTRAINT "fk_rails_fd8449d811";

-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "fk_rails_e70fa12604";

-- DropForeignKey
ALTER TABLE "notes_histories" DROP CONSTRAINT "fk_rails_22a7972a2b";

-- DropForeignKey
ALTER TABLE "notfallmedizin_registers" DROP CONSTRAINT "fk_rails_7e6262d50a";

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
ALTER TABLE "verteiler_vorlagens" DROP CONSTRAINT "fk_rails_02b7f85cbd";

-- DropForeignKey
ALTER TABLE "verteilungsoverrides" DROP CONSTRAINT "fk_rails_171044f6f2";

-- DropForeignKey
ALTER TABLE "verteilungsoverrides" DROP CONSTRAINT "fk_rails_4383eac96c";

-- DropForeignKey
ALTER TABLE "vertrags" DROP CONSTRAINT "fk_rails_f2cec23b66";

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
ALTER TABLE "vorlages" DROP CONSTRAINT "fk_rails_69e32bd9f7";

-- DropForeignKey
ALTER TABLE "wochenbilanzs" DROP CONSTRAINT "fk_rails_eb52f30dad";

-- DropForeignKey
ALTER TABLE "zeitraumkategories" DROP CONSTRAINT "fk_rails_cf637e5e41";

-- DropIndex
DROP INDEX "index_dateis_on_datei_typs_id";

-- AlterTable
ALTER TABLE "abwesentheiten_spaltens" DROP CONSTRAINT "abwesentheiten_spaltens_pkey",
ADD COLUMN     "db_key" VARCHAR,
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "abwesentheiten_spaltens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "abwesentheitenueberblick_counters" DROP CONSTRAINT "abwesentheitenueberblick_counters_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "abwesentheitenueberblick_counters_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "abwesentheitenueberblick_settings" DROP CONSTRAINT "abwesentheitenueberblick_settings_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "abwesentheitenueberblick_settings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "abwesentheitenueberblicks" DROP CONSTRAINT "abwesentheitenueberblicks_pkey",
ADD COLUMN     "pu" INTEGER,
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "abwesentheitenueberblicks_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "account_infos" ADD COLUMN     "user_id" INTEGER,
ALTER COLUMN "nameKurz" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "telephone" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "privateEmail" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "privateTelephone" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "dienstEmail" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "active_admin_comments" DROP CONSTRAINT "active_admin_comments_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "resource_id" SET DATA TYPE INTEGER,
ALTER COLUMN "author_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "active_admin_comments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "active_storage_attachments" DROP CONSTRAINT "active_storage_attachments_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "record_id" SET DATA TYPE INTEGER,
ALTER COLUMN "blob_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "active_storage_attachments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "active_storage_blobs" DROP CONSTRAINT "active_storage_blobs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "active_storage_blobs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "admin_users" DROP CONSTRAINT "admin_users_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
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
ALTER COLUMN "antraege_id" SET DATA TYPE INTEGER,
ALTER COLUMN "antragsstatus_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "antraege_histories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "antraeges" DROP CONSTRAINT "antraeges_pkey",
ADD COLUMN     "datei_id" INTEGER,
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "mitarbeiter_id" SET NOT NULL,
ALTER COLUMN "antragstyp_id" SET NOT NULL,
ALTER COLUMN "antragstyp_id" SET DATA TYPE INTEGER,
ALTER COLUMN "antragsstatus_id" SET NOT NULL,
ALTER COLUMN "antragsstatus_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "antraeges_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "antragsstatuses" DROP CONSTRAINT "antragsstatuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ADD CONSTRAINT "antragsstatuses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "antragstyps" DROP CONSTRAINT "antragstyps_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "antragstyps_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "arbeitsplatzs" DROP CONSTRAINT "arbeitsplatzs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "arbeitsplatzs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "arbeitszeit_absprachens" DROP CONSTRAINT "arbeitszeit_absprachens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumkategorie_id" SET DATA TYPE INTEGER,
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
ALTER COLUMN "mitarbeiter_id" SET NOT NULL,
ALTER COLUMN "po_dienst_id" SET NOT NULL,
ALTER COLUMN "zeitraumkategorie_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "automatische_einteilungens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "bedarfs_eintrags" DROP CONSTRAINT "bedarfs_eintrags_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplanbedarf_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstverteilungstyp_id" SET DATA TYPE INTEGER,
ALTER COLUMN "first_entry" SET DATA TYPE INTEGER,
ALTER COLUMN "kostenstelle_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "bedarfs_eintrags_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "benachrichtigungs" DROP CONSTRAINT "benachrichtigungs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "benachrichtigungs_status_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "benachrichtigungs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "benachrichtigungs_statuses" DROP CONSTRAINT "benachrichtigungs_statuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ADD CONSTRAINT "benachrichtigungs_statuses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "benachrichtigungs_typs" DROP CONSTRAINT "benachrichtigungs_typs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ADD CONSTRAINT "benachrichtigungs_typs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "bereich_tagesverteilers" DROP CONSTRAINT "bereich_tagesverteilers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "tagesverteiler_id" SET DATA TYPE INTEGER,
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ADD CONSTRAINT "bereich_tagesverteilers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "bereich_wochenverteilers" DROP CONSTRAINT "bereich_wochenverteilers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "bereich_wochenverteilers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "bereiches" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "planname" SET DATA TYPE TEXT,
ALTER COLUMN "name_url" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "bereiches_id" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "channel_room_users" DROP CONSTRAINT "channel_room_users_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "channel_room_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "channel_room_users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "channel_rooms" DROP CONSTRAINT "channel_rooms_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "channel_rooms_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "datei_typs" DROP CONSTRAINT "datei_typs_pkey",
ADD COLUMN     "category" VARCHAR NOT NULL DEFAULT '',
ADD COLUMN     "owner" VARCHAR NOT NULL DEFAULT '',
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "name" SET DEFAULT '',
ADD CONSTRAINT "datei_typs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dateis" DROP CONSTRAINT "dateis_pkey",
DROP COLUMN "datei_typs_id",
ADD COLUMN     "datei_typ_id" INTEGER NOT NULL,
ADD COLUMN     "file_hash" VARCHAR DEFAULT '',
ADD COLUMN     "path" VARCHAR DEFAULT '',
ADD COLUMN     "url" VARCHAR DEFAULT '',
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "beschreibung" SET DEFAULT '',
ALTER COLUMN "ersteller_id" SET DATA TYPE INTEGER,
ALTER COLUMN "besitzer_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dateis_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstbedarves" ALTER COLUMN "min" DROP NOT NULL,
ALTER COLUMN "po_dienst_id" DROP NOT NULL,
ALTER COLUMN "bereich_id" DROP NOT NULL,
ALTER COLUMN "dienstverteilungstyp_id" SET DATA TYPE INTEGER,
ALTER COLUMN "arbeitszeitverteilung_id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumkategories_id" SET DATA TYPE INTEGER,
ALTER COLUMN "kostenstelle_id" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "dienstbedarveshistory" DROP CONSTRAINT "dienstbedarveshistory_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstbedarf_id" SET DATA TYPE INTEGER,
ALTER COLUMN "arbeitszeitverteilungs_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstbedarveshistory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "diensteinteilungs" ALTER COLUMN "einteilungsstatus_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplan_id" SET DATA TYPE INTEGER,
ALTER COLUMN "einteilungskontext_id" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "diensteinteilungs_versions" DROP CONSTRAINT "diensteinteilungs_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "diensteinteilungs_versions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstfreigabes" ADD COLUMN     "standort_id" INTEGER,
ALTER COLUMN "freigabetyp_id" DROP NOT NULL,
ALTER COLUMN "mitarbeiter_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

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
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ADD CONSTRAINT "dienstkategories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstkategoriethemas" DROP CONSTRAINT "dienstkategoriethemas_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstkategorie_id" SET DATA TYPE INTEGER,
ALTER COLUMN "thema_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstkategoriethemas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstplan_custom_counters" DROP CONSTRAINT "dienstplan_custom_counters_pkey",
DROP COLUMN "count_arbeitszeiten",
DROP COLUMN "counter_typ",
DROP COLUMN "index_all_type",
DROP COLUMN "spalten_counter_ids",
DROP COLUMN "team_ids",
DROP COLUMN "zeilen_counter_ids",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
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
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ALTER COLUMN "pos" SET DATA TYPE INTEGER,
ALTER COLUMN "dienste_ids" SET DATA TYPE INTEGER[],
ALTER COLUMN "dienstkategorien_ids" SET DATA TYPE INTEGER[],
ADD CONSTRAINT "dienstplaner_user_farbgruppens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstplaner_user_settings" DROP CONSTRAINT "dienstplaner_user_settings_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplaner_user_settings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstplaners_teams" DROP CONSTRAINT "dienstplaners_teams_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplaners_teams_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstplaners_verteiler_vorlagens" DROP CONSTRAINT "dienstplaners_verteiler_vorlagens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "vorlage_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplaners_verteiler_vorlagens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstplans" DROP CONSTRAINT "dienstplans_pkey",
ADD COLUMN     "parameter" VARCHAR,
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "parameterset_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplanstatus_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplanbedarf_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstplans_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstplanstatuses" DROP CONSTRAINT "dienstplanstatuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ADD CONSTRAINT "dienstplanstatuses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstratings" DROP CONSTRAINT "dienstratings_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstratings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "diensts" ALTER COLUMN "dienstname" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "mitarbeiter" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "dienstverteilungstyps" DROP CONSTRAINT "dienstverteilungstyps_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstverteilungstyps_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dienstwunsches" DROP CONSTRAINT "dienstwunsches_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstkategorie_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "dienstwunsches_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "einteilungskontexts" DROP CONSTRAINT "einteilungskontexts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ADD CONSTRAINT "einteilungskontexts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "einteilungsstatuses" DROP CONSTRAINT "einteilungsstatuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ADD CONSTRAINT "einteilungsstatuses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "feiertages" DROP CONSTRAINT "feiertages_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "feiertages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "freigabestatuses" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "color" SET DEFAULT '#ffffff';

-- AlterTable
ALTER TABLE "freistellungs" ALTER COLUMN "mitarbeiter_planname" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "einteilung" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "funktions" DROP CONSTRAINT "funktions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "funktions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "geraetebereiches" DROP CONSTRAINT "geraetebereiches_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ADD CONSTRAINT "geraetebereiches_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "geraeteklasses" DROP CONSTRAINT "geraeteklasses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ADD CONSTRAINT "geraeteklasses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "geraetepasses" DROP CONSTRAINT "geraetepasses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "geraet_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "geraetepasses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "geraets" DROP CONSTRAINT "geraets_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "hersteller" SET DEFAULT '',
ALTER COLUMN "typ" SET DEFAULT '',
ALTER COLUMN "geraeteklasse_id" SET NOT NULL,
ALTER COLUMN "geraeteklasse_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "geraets_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "gruppes" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "resource_type" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "hains_tasks" DROP CONSTRAINT "hains_tasks_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "benachrichtigungs_typ_id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumkategorie_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "hains_tasks_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "jahresbilanzs" DROP CONSTRAINT "jahresbilanzs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "jahresbilanzs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "kalendermarkierungs" DROP CONSTRAINT "kalendermarkierungs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ADD CONSTRAINT "kalendermarkierungs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "kalenderwoches" DROP CONSTRAINT "kalenderwoches_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "kalenderwoches_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "kontingent_po_diensts" DROP CONSTRAINT "kontingent_po_diensts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "kontingent_po_diensts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "kontingents" ALTER COLUMN "thema_ids" SET DATA TYPE INTEGER[],
ALTER COLUMN "team_id" SET DEFAULT 8,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER;

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
ADD CONSTRAINT "mitarbeiter_default_eingeteilts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "mitarbeitermerkmals" DROP CONSTRAINT "mitarbeitermerkmals_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "merkmal_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "mitarbeitermerkmals_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "mitarbeiters" ADD COLUMN     "aktiv_bis" TIMESTAMP(6),
ADD COLUMN     "aktiv_von" TIMESTAMP(6),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "planname" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "funktion_id" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "nef_fahrts" DROP CONSTRAINT "nef_fahrts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "notfallmedizin_register_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "nef_fahrts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "nicht_einteilen_absprachens" DROP CONSTRAINT "nicht_einteilen_absprachens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "zeitraumkategorie_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "nicht_einteilen_absprachens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "nicht_einteilen_standort_themen" DROP CONSTRAINT "nicht_einteilen_standort_themen_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "absprache_id" SET DATA TYPE INTEGER,
ALTER COLUMN "thema_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "nicht_einteilen_standort_themen_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "note_categories" DROP CONSTRAINT "note_categories_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "note_categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notes" DROP CONSTRAINT "notes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "ersteller_id" SET DATA TYPE INTEGER,
ALTER COLUMN "note_category_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notes_histories" DROP CONSTRAINT "notes_histories_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "note_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "notes_histories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notfallmedizin_registers" DROP CONSTRAINT "notfallmedizin_registers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "notfallmedizin_status_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "notfallmedizin_registers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notfallmedizin_statuses" DROP CONSTRAINT "notfallmedizin_statuses_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ADD CONSTRAINT "notfallmedizin_statuses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "oauth_access_grants" ALTER COLUMN "token" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "scopes" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "oauth_access_tokens" ALTER COLUMN "token" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "refresh_token" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "scopes" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "oauth_applications" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "uid" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "secret" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "scopes" SET DATA TYPE VARCHAR(255);

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
ALTER TABLE "po_diensts" ADD COLUMN     "nef_stunden" INTEGER DEFAULT 0,
ADD COLUMN     "reduziere_urlaub" BOOLEAN DEFAULT false,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "planname" SET DATA TYPE TEXT,
ALTER COLUMN "beschreibung" DROP NOT NULL,
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ALTER COLUMN "thema_ids" SET DATA TYPE INTEGER[],
ALTER COLUMN "team_id" SET DEFAULT 8,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ALTER COLUMN "kostenstelle_id" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "schichts" DROP CONSTRAINT "schichts_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "bedarfs_eintrag_id" SET DATA TYPE INTEGER,
ALTER COLUMN "arbeitszeittyp_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "schichts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "standorts" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "planname" SET DATA TYPE TEXT,
ALTER COLUMN "name_url" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "long" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "lat" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "stundennachweis" DROP CONSTRAINT "stundennachweis_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
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
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ADD CONSTRAINT "tagesverteilers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tagkategories" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "team_funktions" DROP CONSTRAINT "team_funktions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET NOT NULL,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ALTER COLUMN "funktion_id" SET NOT NULL,
ALTER COLUMN "funktion_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "team_funktions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "team_kw_krankpuffer_versions" DROP CONSTRAINT "team_kw_krankpuffer_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "team_kw_krankpuffer_versions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "team_kw_krankpuffers" DROP CONSTRAINT "team_kw_krankpuffers_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "team_id" SET NOT NULL,
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "team_kw_krankpuffers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "teams" DROP CONSTRAINT "teams_pkey",
ADD COLUMN     "color" VARCHAR NOT NULL DEFAULT '#ffffff',
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "kostenstelle_id" SET DEFAULT 2,
ALTER COLUMN "kostenstelle_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "themas" DROP CONSTRAINT "themas_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "color" SET DEFAULT '#ffffff',
ADD CONSTRAINT "themas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "urlaubssaldo_abspraches" DROP CONSTRAINT "urlaubssaldo_abspraches_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "urlaubssaldo_abspraches_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "provider" TEXT,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "uid" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "login" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "encrypted_password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "reset_password_token" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "current_sign_in_ip" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "last_sign_in_ip" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "confirmation_token" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "unconfirmed_email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "unlock_token" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "account_info_id" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "users_gruppes" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "gruppe_id" SET NOT NULL,
ADD CONSTRAINT "users_gruppes_pkey" PRIMARY KEY ("user_id", "gruppe_id");

-- AlterTable
ALTER TABLE "verteiler_vorlagens" DROP CONSTRAINT "verteiler_vorlagens_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstplan_path_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "verteiler_vorlagens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "verteilungsoverrides" DROP CONSTRAINT "verteilungsoverrides_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "parameterset_id" SET DATA TYPE INTEGER,
ALTER COLUMN "dienstverteilungstyp_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "verteilungsoverrides_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vertrag_versions" DROP CONSTRAINT "vertrag_versions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertrag_versions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vertrags" ALTER COLUMN "vertragstyp_id" SET DATA TYPE INTEGER,
ALTER COLUMN "anfang" SET NOT NULL,
ALTER COLUMN "ende" SET NOT NULL;

-- AlterTable
ALTER TABLE "vertrags_arbeitszeits" DROP CONSTRAINT "vertrags_arbeitszeits_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "von" SET NOT NULL,
ALTER COLUMN "bis" SET NOT NULL,
ADD CONSTRAINT "vertrags_arbeitszeits_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vertrags_phases" DROP CONSTRAINT "vertrags_phases_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "von" SET NOT NULL,
ALTER COLUMN "bis" SET NOT NULL,
ALTER COLUMN "vertragsstufe_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vertrags_phases_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vertrags_variantes" DROP CONSTRAINT "vertrags_variantes_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "von" SET NOT NULL,
ALTER COLUMN "bis" SET NOT NULL,
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
ALTER COLUMN "team_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "vorlages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "wochenbilanzs" DROP CONSTRAINT "wochenbilanzs_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "kalenderwoche_id" SET DATA TYPE INTEGER,
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

-- CreateTable
CREATE TABLE "datei_typ_gruppe" (
    "id" INTEGER NOT NULL,
    "datei_typ_id" INTEGER NOT NULL,
    "gruppe_id" INTEGER NOT NULL,

    CONSTRAINT "datei_typ_gruppe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geraet_dateis" (
    "id" INTEGER NOT NULL,
    "besitzer_id" INTEGER NOT NULL,
    "datei_id" INTEGER NOT NULL,

    CONSTRAINT "geraet_dateis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mitarbeiter_dateis" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR DEFAULT '',
    "beschreibung" VARCHAR DEFAULT '',
    "ersteller_id" INTEGER NOT NULL,
    "besitzer_id" INTEGER NOT NULL,
    "datei_id" INTEGER NOT NULL,

    CONSTRAINT "mitarbeiter_dateis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_access_tokens_new" (
    "id" INTEGER NOT NULL,
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
CREATE TABLE "oauth_authorization_codes" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "client_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_authorization_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_clients" (
    "id" INTEGER NOT NULL,
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
    "id" INTEGER NOT NULL,
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
CREATE TABLE "planungsinformations" (
    "id" INTEGER NOT NULL,
    "tag" DATE NOT NULL,
    "po_dienst_id" INTEGER,
    "bereich_id" INTEGER,
    "kommentar" TEXT NOT NULL,

    CONSTRAINT "planungsinformations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_kopf_soll" (
    "id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "soll" INTEGER NOT NULL,
    "von" DATE NOT NULL,
    "bis" DATE NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "team_kopf_soll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_vk_soll" (
    "id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "soll" INTEGER NOT NULL,
    "von" DATE NOT NULL,
    "bis" DATE NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "team_vk_soll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telefonliste_joomla" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "telefon" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,
    "label_id" INTEGER DEFAULT 0,

    CONSTRAINT "telefonliste_joomla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telefonliste_label" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "telefonliste_label_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "datei_typ_gruppe_datei_typ_id_gruppe_id_key" ON "datei_typ_gruppe"("datei_typ_id", "gruppe_id");

-- CreateIndex
CREATE UNIQUE INDEX "geraet_dateis_datei_id_key" ON "geraet_dateis"("datei_id");

-- CreateIndex
CREATE UNIQUE INDEX "mitarbeiter_dateis_datei_id_key" ON "mitarbeiter_dateis"("datei_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_access_tokens_new_token_key" ON "oauth_access_tokens_new"("token");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_authorization_codes_code_key" ON "oauth_authorization_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_clients_client_id_key" ON "oauth_clients"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_refresh_tokens_token_key" ON "oauth_refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "account_infos_mitarbeiter_id_key" ON "account_infos"("mitarbeiter_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_infos_user_id_key" ON "account_infos"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "antraeges_datei_id_key" ON "antraeges"("datei_id");

-- CreateIndex
CREATE INDEX "index_dateis_on_besitzer_id" ON "dateis"("besitzer_id");

-- CreateIndex
CREATE INDEX "index_dateis_on_datei_typ_id" ON "dateis"("datei_typ_id");

-- CreateIndex
CREATE INDEX "index_dateis_on_ersteller_id" ON "dateis"("ersteller_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique planname" ON "mitarbeiters"("planname");

-- CreateIndex
CREATE UNIQUE INDEX "users_account_info_id_key" ON "users"("account_info_id");

-- AddForeignKey
ALTER TABLE "allgemeine_vorlages" ADD CONSTRAINT "fk_rails_01e0e49755" FOREIGN KEY ("dienstplan_path_id") REFERENCES "dienstplan_paths"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "allgemeine_vorlages" ADD CONSTRAINT "fk_rails_0c44f45c22" FOREIGN KEY ("vorlage_id") REFERENCES "vorlages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antraege_histories" ADD CONSTRAINT "fk_rails_702e44afb0" FOREIGN KEY ("antragsstatus_id") REFERENCES "antragsstatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antraege_histories" ADD CONSTRAINT "fk_rails_d2c22a9e1a" FOREIGN KEY ("antraege_id") REFERENCES "antraeges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antraeges" ADD CONSTRAINT "fk_rails_0101e13655" FOREIGN KEY ("antragsstatus_id") REFERENCES "antragsstatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antraeges" ADD CONSTRAINT "fk_rails_f887e40996" FOREIGN KEY ("antragstyp_id") REFERENCES "antragstyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "antraeges" ADD CONSTRAINT "antraeges_datei_id_fkey" FOREIGN KEY ("datei_id") REFERENCES "dateis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbeitszeit_absprachens" ADD CONSTRAINT "fk_rails_4a9339ea11" FOREIGN KEY ("zeitraumkategorie_id") REFERENCES "zeitraumkategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "arbeitszeitverteilungs" ADD CONSTRAINT "fk_rails_7b802cfd89" FOREIGN KEY ("dienstgruppe_id") REFERENCES "dienstgruppes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "arbeitszeitverteilungs" ADD CONSTRAINT "fk_rails_fe777cf5f2" FOREIGN KEY ("pre_dienstgruppe_id") REFERENCES "dienstgruppes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "automatische_einteilungens" ADD CONSTRAINT "fk_rails_3651daf545" FOREIGN KEY ("zeitraumkategorie_id") REFERENCES "zeitraumkategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "fk_rails_00545eb639" FOREIGN KEY ("dienstplanbedarf_id") REFERENCES "dienstplanbedarves"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "fk_rails_0f89581c7b" FOREIGN KEY ("dienstverteilungstyp_id") REFERENCES "dienstverteilungstyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "fk_rails_aa2e3d95aa" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_first_entry_fkey" FOREIGN KEY ("first_entry") REFERENCES "bedarfs_eintrags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benachrichtigungs" ADD CONSTRAINT "fk_rails_2d4826acc2" FOREIGN KEY ("benachrichtigungs_status_id") REFERENCES "benachrichtigungs_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bereich_tagesverteilers" ADD CONSTRAINT "fk_rails_fdf23f3f87" FOREIGN KEY ("tagesverteiler_id") REFERENCES "tagesverteilers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channel_room_users" ADD CONSTRAINT "fk_rails_07d9c65830" FOREIGN KEY ("channel_room_id") REFERENCES "channel_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "datei_typ_gruppe" ADD CONSTRAINT "datei_typ_gruppe_datei_typ_id_fkey" FOREIGN KEY ("datei_typ_id") REFERENCES "datei_typs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "datei_typ_gruppe" ADD CONSTRAINT "datei_typ_gruppe_gruppe_id_fkey" FOREIGN KEY ("gruppe_id") REFERENCES "gruppes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dateis" ADD CONSTRAINT "dateis_besitzer_id_fkey" FOREIGN KEY ("besitzer_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dateis" ADD CONSTRAINT "dateis_ersteller_id_fkey" FOREIGN KEY ("ersteller_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dateis" ADD CONSTRAINT "dateis_datei_typ_id_fkey" FOREIGN KEY ("datei_typ_id") REFERENCES "datei_typs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "fk_rails_05b1cdbc7e" FOREIGN KEY ("dienstverteilungstyp_id") REFERENCES "dienstverteilungstyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "fk_rails_2b3b1e6b71" FOREIGN KEY ("arbeitszeitverteilung_id") REFERENCES "arbeitszeitverteilungs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "fk_rails_495258659a" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "fk_rails_a8c5f3913d" FOREIGN KEY ("zeitraumkategories_id") REFERENCES "zeitraumkategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "diensteinteilungs_einteilungskontext_id_fkey" FOREIGN KEY ("einteilungskontext_id") REFERENCES "einteilungskontexts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "fk_rails_2a437cd8da" FOREIGN KEY ("einteilungsstatus_id") REFERENCES "einteilungsstatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "fk_rails_37afbd5ac9" FOREIGN KEY ("dienstplan_id") REFERENCES "dienstplans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "fk_rails_8328bf76e2" FOREIGN KEY ("standort_id") REFERENCES "standorts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

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
ALTER TABLE "dienstplaners_teams" ADD CONSTRAINT "fk_rails_75274a3398" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplaners_verteiler_vorlagens" ADD CONSTRAINT "fk_rails_4924e39a88" FOREIGN KEY ("vorlage_id") REFERENCES "verteiler_vorlagens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplans" ADD CONSTRAINT "fk_rails_36027a91b3" FOREIGN KEY ("dienstplanbedarf_id") REFERENCES "dienstplanbedarves"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplans" ADD CONSTRAINT "fk_rails_55a766d44f" FOREIGN KEY ("dienstplanstatus_id") REFERENCES "dienstplanstatuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstplans" ADD CONSTRAINT "fk_rails_5f55bd1d2e" FOREIGN KEY ("parameterset_id") REFERENCES "parametersets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dienstwunsches" ADD CONSTRAINT "fk_rails_28e8d817f4" FOREIGN KEY ("dienstkategorie_id") REFERENCES "dienstkategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "funktions" ADD CONSTRAINT "fk_rails_1a9f2cf982" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "geraetepasses" ADD CONSTRAINT "fk_rails_01560b5637" FOREIGN KEY ("geraet_id") REFERENCES "geraets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "geraet_dateis" ADD CONSTRAINT "geraet_dateis_datei_id_fkey" FOREIGN KEY ("datei_id") REFERENCES "dateis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geraet_dateis" ADD CONSTRAINT "geraet_dateis_besitzer_id_fkey" FOREIGN KEY ("besitzer_id") REFERENCES "geraets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geraets" ADD CONSTRAINT "fk_rails_87c8fbadfa" FOREIGN KEY ("geraeteklasse_id") REFERENCES "geraeteklasses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

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
ALTER TABLE "mitarbeitermerkmals" ADD CONSTRAINT "fk_rails_41412590af" FOREIGN KEY ("merkmal_id") REFERENCES "merkmals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mitarbeiters" ADD CONSTRAINT "fk_rails_5006408ec6" FOREIGN KEY ("funktion_id") REFERENCES "funktions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mitarbeiter_dateis" ADD CONSTRAINT "mitarbeiter_dateis_datei_id_fkey" FOREIGN KEY ("datei_id") REFERENCES "dateis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitarbeiter_dateis" ADD CONSTRAINT "mitarbeiter_dateis_besitzer_id_fkey" FOREIGN KEY ("besitzer_id") REFERENCES "mitarbeiters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitarbeiter_dateis" ADD CONSTRAINT "mitarbeiter_dateis_ersteller_id_fkey" FOREIGN KEY ("ersteller_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nef_fahrts" ADD CONSTRAINT "fk_rails_be395c9f8e" FOREIGN KEY ("notfallmedizin_register_id") REFERENCES "notfallmedizin_registers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nicht_einteilen_absprachens" ADD CONSTRAINT "fk_rails_f981032257" FOREIGN KEY ("zeitraumkategorie_id") REFERENCES "zeitraumkategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nicht_einteilen_standort_themen" ADD CONSTRAINT "fk_rails_44fd8a9177" FOREIGN KEY ("absprache_id") REFERENCES "nicht_einteilen_absprachens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nicht_einteilen_standort_themen" ADD CONSTRAINT "fk_rails_fd8449d811" FOREIGN KEY ("thema_id") REFERENCES "themas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "fk_rails_e70fa12604" FOREIGN KEY ("note_category_id") REFERENCES "note_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notes_histories" ADD CONSTRAINT "fk_rails_22a7972a2b" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notfallmedizin_registers" ADD CONSTRAINT "fk_rails_7e6262d50a" FOREIGN KEY ("notfallmedizin_status_id") REFERENCES "notfallmedizin_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "oauth_access_tokens_new" ADD CONSTRAINT "oauth_access_tokens_new_refresh_token_id_fkey" FOREIGN KEY ("refresh_token_id") REFERENCES "oauth_refresh_tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_access_tokens_new" ADD CONSTRAINT "oauth_access_tokens_new_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_refresh_tokens" ADD CONSTRAINT "oauth_refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "tagesverteiler_layouts" ADD CONSTRAINT "fk_rails_9293af7154" FOREIGN KEY ("verteiler_vorlagen_id") REFERENCES "verteiler_vorlagens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_funktions" ADD CONSTRAINT "fk_rails_0043aa77c2" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_funktions" ADD CONSTRAINT "fk_rails_bec8e126a9" FOREIGN KEY ("funktion_id") REFERENCES "funktions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_kw_krankpuffers" ADD CONSTRAINT "fk_rails_5eded83672" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_kopf_soll" ADD CONSTRAINT "team_kopf_soll_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_vk_soll" ADD CONSTRAINT "team_vk_soll_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "fk_rails_9d14807ce7" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "telefonliste_joomla" ADD CONSTRAINT "telefonliste_joomla_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "telefonliste_label"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_account_info_id_fkey" FOREIGN KEY ("account_info_id") REFERENCES "account_infos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verteiler_vorlagens" ADD CONSTRAINT "fk_rails_02b7f85cbd" FOREIGN KEY ("dienstplan_path_id") REFERENCES "dienstplan_paths"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "verteilungsoverrides" ADD CONSTRAINT "fk_rails_171044f6f2" FOREIGN KEY ("dienstverteilungstyp_id") REFERENCES "dienstverteilungstyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "verteilungsoverrides" ADD CONSTRAINT "fk_rails_4383eac96c" FOREIGN KEY ("parameterset_id") REFERENCES "parametersets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vertrags" ADD CONSTRAINT "fk_rails_f2cec23b66" FOREIGN KEY ("vertragstyp_id") REFERENCES "vertragstyps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

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
ALTER TABLE "vorlages" ADD CONSTRAINT "fk_rails_69e32bd9f7" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wochenbilanzs" ADD CONSTRAINT "fk_rails_eb52f30dad" FOREIGN KEY ("kalenderwoche_id") REFERENCES "kalenderwoches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "zeitraumkategories" ADD CONSTRAINT "fk_rails_cf637e5e41" FOREIGN KEY ("zeitraumregel_id") REFERENCES "zeitraumregels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
