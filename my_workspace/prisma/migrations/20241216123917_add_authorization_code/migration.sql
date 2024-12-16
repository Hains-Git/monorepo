/*
  Warnings:

  - Made the column `user_id` on table `users_gruppes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gruppe_id` on table `users_gruppes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "abwesentheitenueberblick_counters" DROP CONSTRAINT "fk_rails_daea018e64";

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
ALTER TABLE "users_gruppes" DROP CONSTRAINT "fk_rails_0c3453aa77";

-- DropForeignKey
ALTER TABLE "users_gruppes" DROP CONSTRAINT "fk_rails_cec3e4ee8f";

-- DropForeignKey
ALTER TABLE "vertrags" DROP CONSTRAINT "fk_rails_b20fe19842";

-- AlterTable
ALTER TABLE "abwesentheitenueberblick_settings" ADD COLUMN     "mitarbeitersId" INTEGER;

-- AlterTable
ALTER TABLE "account_infos" ADD COLUMN     "usersId" INTEGER;

-- AlterTable
ALTER TABLE "users_gruppes" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "gruppe_id" SET NOT NULL,
ADD CONSTRAINT "users_gruppes_pkey" PRIMARY KEY ("user_id", "gruppe_id");

-- CreateTable
CREATE TABLE "oauth_authorization_codes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "client_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_authorization_codes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "abwesentheitenueberblick_counters" ADD CONSTRAINT "abwesentheitenueberblick_counters_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abwesentheitenueberblick_counters" ADD CONSTRAINT "abwesentheitenueberblick_counters_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abwesentheitenueberblick_settings" ADD CONSTRAINT "abwesentheitenueberblick_settings_mitarbeitersId_fkey" FOREIGN KEY ("mitarbeitersId") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abwesentheitenueberblicks" ADD CONSTRAINT "abwesentheitenueberblicks_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_infos" ADD CONSTRAINT "account_infos_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allgemeine_vorlages" ADD CONSTRAINT "allgemeine_vorlages_dienstplan_path_id_fkey" FOREIGN KEY ("dienstplan_path_id") REFERENCES "dienstplan_paths"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allgemeine_vorlages" ADD CONSTRAINT "allgemeine_vorlages_vorlage_id_fkey" FOREIGN KEY ("vorlage_id") REFERENCES "vorlages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antraege_histories" ADD CONSTRAINT "antraege_histories_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antraege_histories" ADD CONSTRAINT "antraege_histories_antragsstatus_id_fkey" FOREIGN KEY ("antragsstatus_id") REFERENCES "antragsstatuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antraege_histories" ADD CONSTRAINT "antraege_histories_antraege_id_fkey" FOREIGN KEY ("antraege_id") REFERENCES "antraeges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antraeges" ADD CONSTRAINT "antraeges_antragsstatus_id_fkey" FOREIGN KEY ("antragsstatus_id") REFERENCES "antragsstatuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antraeges" ADD CONSTRAINT "antraeges_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antraeges" ADD CONSTRAINT "antraeges_antragstyp_id_fkey" FOREIGN KEY ("antragstyp_id") REFERENCES "antragstyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antragstyps" ADD CONSTRAINT "antragstyps_check_alternative_po_dienst_id_fkey" FOREIGN KEY ("check_alternative_po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antragstyps" ADD CONSTRAINT "antragstyps_we_holiday_po_dienst_id_fkey" FOREIGN KEY ("we_holiday_po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antragstyps" ADD CONSTRAINT "antragstyps_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antragstyps" ADD CONSTRAINT "antragstyps_alternative_po_dienst_id_fkey" FOREIGN KEY ("alternative_po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbeitsplatzs" ADD CONSTRAINT "arbeitsplatzs_bereich_id_fkey" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbeitsplatzs" ADD CONSTRAINT "arbeitsplatzs_standort_id_fkey" FOREIGN KEY ("standort_id") REFERENCES "standorts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbeitszeit_absprachens" ADD CONSTRAINT "arbeitszeit_absprachens_vertrags_phase_id_fkey" FOREIGN KEY ("vertrags_phase_id") REFERENCES "vertrags_phases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbeitszeit_absprachens" ADD CONSTRAINT "arbeitszeit_absprachens_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbeitszeit_absprachens" ADD CONSTRAINT "arbeitszeit_absprachens_zeitraumkategorie_id_fkey" FOREIGN KEY ("zeitraumkategorie_id") REFERENCES "zeitraumkategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbeitszeitverteilungs" ADD CONSTRAINT "arbeitszeitverteilungs_dienstgruppe_id_fkey" FOREIGN KEY ("dienstgruppe_id") REFERENCES "dienstgruppes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbeitszeitverteilungs" ADD CONSTRAINT "arbeitszeitverteilungs_pre_dienstgruppe_id_fkey" FOREIGN KEY ("pre_dienstgruppe_id") REFERENCES "dienstgruppes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automatische_einteilungens" ADD CONSTRAINT "automatische_einteilungens_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automatische_einteilungens" ADD CONSTRAINT "automatische_einteilungens_vertrags_phase_id_fkey" FOREIGN KEY ("vertrags_phase_id") REFERENCES "vertrags_phases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automatische_einteilungens" ADD CONSTRAINT "automatische_einteilungens_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automatische_einteilungens" ADD CONSTRAINT "automatische_einteilungens_zeitraumkategorie_id_fkey" FOREIGN KEY ("zeitraumkategorie_id") REFERENCES "zeitraumkategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_dienstplanbedarf_id_fkey" FOREIGN KEY ("dienstplanbedarf_id") REFERENCES "dienstplanbedarves"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_dienstverteilungstyp_id_fkey" FOREIGN KEY ("dienstverteilungstyp_id") REFERENCES "dienstverteilungstyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_kostenstelle_id_fkey" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_bereich_id_fkey" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bedarfs_eintrags" ADD CONSTRAINT "bedarfs_eintrags_dienstbedarf_id_fkey" FOREIGN KEY ("dienstbedarf_id") REFERENCES "dienstbedarves"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "dienstbedarves_dienstverteilungstyp_id_fkey" FOREIGN KEY ("dienstverteilungstyp_id") REFERENCES "dienstverteilungstyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "dienstbedarves_arbeitszeitverteilung_id_fkey" FOREIGN KEY ("arbeitszeitverteilung_id") REFERENCES "arbeitszeitverteilungs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "dienstbedarves_bereich_id_fkey" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "dienstbedarves_kostenstelle_id_fkey" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "dienstbedarves_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstbedarves" ADD CONSTRAINT "dienstbedarves_zeitraumkategories_id_fkey" FOREIGN KEY ("zeitraumkategories_id") REFERENCES "zeitraumkategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "diensteinteilungs_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "diensteinteilungs_einteilungsstatus_id_fkey" FOREIGN KEY ("einteilungsstatus_id") REFERENCES "einteilungsstatuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "diensteinteilungs_dienstplan_id_fkey" FOREIGN KEY ("dienstplan_id") REFERENCES "dienstplans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "diensteinteilungs_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diensteinteilungs" ADD CONSTRAINT "diensteinteilungs_bereich_id_fkey" FOREIGN KEY ("bereich_id") REFERENCES "bereiches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "dienstfreigabes_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "dienstfreigabes_freigabetyp_id_fkey" FOREIGN KEY ("freigabetyp_id") REFERENCES "freigabetyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "dienstfreigabes_standort_id_fkey" FOREIGN KEY ("standort_id") REFERENCES "standorts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "dienstfreigabes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstfreigabes" ADD CONSTRAINT "dienstfreigabes_freigabestatus_id_fkey" FOREIGN KEY ("freigabestatus_id") REFERENCES "freigabestatuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "dienstplan_paths" ADD CONSTRAINT "dienstplan_paths_planinterval_id_fkey" FOREIGN KEY ("planinterval_id") REFERENCES "planintervals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplan_paths" ADD CONSTRAINT "dienstplan_paths_plan_tab_id_fkey" FOREIGN KEY ("plan_tab_id") REFERENCES "plan_tabs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplaner_user_farbgruppens" ADD CONSTRAINT "dienstplaner_user_farbgruppens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplaner_user_settings" ADD CONSTRAINT "dienstplaner_user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplaners_teams" ADD CONSTRAINT "dienstplaners_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplaners_teams" ADD CONSTRAINT "dienstplaners_teams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplaners_verteiler_vorlagens" ADD CONSTRAINT "dienstplaners_verteiler_vorlagens_vorlage_id_fkey" FOREIGN KEY ("vorlage_id") REFERENCES "verteiler_vorlagens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstplaners_verteiler_vorlagens" ADD CONSTRAINT "dienstplaners_verteiler_vorlagens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "dienstwunsches" ADD CONSTRAINT "dienstwunsches_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dienstwunsches" ADD CONSTRAINT "dienstwunsches_dienstkategorie_id_fkey" FOREIGN KEY ("dienstkategorie_id") REFERENCES "dienstkategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "einteilung_rotations" ADD CONSTRAINT "einteilung_rotations_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "einteilung_rotations" ADD CONSTRAINT "einteilung_rotations_kontingent_id_fkey" FOREIGN KEY ("kontingent_id") REFERENCES "kontingents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "kontingent_po_diensts" ADD CONSTRAINT "kontingent_po_diensts_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kontingent_po_diensts" ADD CONSTRAINT "kontingent_po_diensts_kontingent_id_fkey" FOREIGN KEY ("kontingent_id") REFERENCES "kontingents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kontingents" ADD CONSTRAINT "kontingents_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailer_ccs" ADD CONSTRAINT "mailer_ccs_mailer_context_id_fkey" FOREIGN KEY ("mailer_context_id") REFERENCES "mailer_contexts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailer_ccs" ADD CONSTRAINT "mailer_ccs_mailer_addresse_id_fkey" FOREIGN KEY ("mailer_addresse_id") REFERENCES "mailer_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailer_contexts" ADD CONSTRAINT "mailer_contexts_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "mailer_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailer_contexts" ADD CONSTRAINT "mailer_contexts_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "mailer_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailer_tos" ADD CONSTRAINT "mailer_tos_mailer_context_id_fkey" FOREIGN KEY ("mailer_context_id") REFERENCES "mailer_contexts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailer_tos" ADD CONSTRAINT "mailer_tos_mailer_addresse_id_fkey" FOREIGN KEY ("mailer_addresse_id") REFERENCES "mailer_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merkmal_options" ADD CONSTRAINT "merkmal_options_merkmal_id_fkey" FOREIGN KEY ("merkmal_id") REFERENCES "merkmals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitarbeiter_default_eingeteilts" ADD CONSTRAINT "mitarbeiter_default_eingeteilts_po_dienst_id_fkey" FOREIGN KEY ("po_dienst_id") REFERENCES "po_diensts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitarbeiter_default_eingeteilts" ADD CONSTRAINT "mitarbeiter_default_eingeteilts_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "nicht_einteilen_absprachens" ADD CONSTRAINT "nicht_einteilen_absprachens_vertrags_phase_id_fkey" FOREIGN KEY ("vertrags_phase_id") REFERENCES "vertrags_phases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "notes_histories" ADD CONSTRAINT "notes_histories_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes_histories" ADD CONSTRAINT "notes_histories_ersteller_id_fkey" FOREIGN KEY ("ersteller_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes_histories" ADD CONSTRAINT "notes_histories_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notfallmedizin_registers" ADD CONSTRAINT "notfallmedizin_registers_notfallmedizin_status_id_fkey" FOREIGN KEY ("notfallmedizin_status_id") REFERENCES "notfallmedizin_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notfallmedizin_registers" ADD CONSTRAINT "notfallmedizin_registers_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planparameters" ADD CONSTRAINT "planparameters_parameterset_id_fkey" FOREIGN KEY ("parameterset_id") REFERENCES "parametersets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planparameters" ADD CONSTRAINT "planparameters_einteilungsstatus_id_fkey" FOREIGN KEY ("einteilungsstatus_id") REFERENCES "einteilungsstatuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_diensts" ADD CONSTRAINT "po_diensts_kostenstelle_id_fkey" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_diensts" ADD CONSTRAINT "po_diensts_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schichts" ADD CONSTRAINT "schichts_arbeitszeittyp_id_fkey" FOREIGN KEY ("arbeitszeittyp_id") REFERENCES "arbeitszeittyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schichts" ADD CONSTRAINT "schichts_bedarfs_eintrag_id_fkey" FOREIGN KEY ("bedarfs_eintrag_id") REFERENCES "bedarfs_eintrags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stundennachweis" ADD CONSTRAINT "stundennachweis_stundennachweis_status_id_fkey" FOREIGN KEY ("stundennachweis_status_id") REFERENCES "stundennachweis_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stundennachweis" ADD CONSTRAINT "stundennachweis_kostenstelle_id_fkey" FOREIGN KEY ("kostenstelle_id") REFERENCES "kostenstelles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stundennachweis" ADD CONSTRAINT "stundennachweis_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tagesverteiler_layouts" ADD CONSTRAINT "tagesverteiler_layouts_verteiler_vorlagen_id_fkey" FOREIGN KEY ("verteiler_vorlagen_id") REFERENCES "verteiler_vorlagens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_funktions" ADD CONSTRAINT "team_funktions_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_funktions" ADD CONSTRAINT "team_funktions_funktion_id_fkey" FOREIGN KEY ("funktion_id") REFERENCES "funktions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "verteilungsoverrides" ADD CONSTRAINT "verteilungsoverrides_dienstverteilungstyp_id_fkey" FOREIGN KEY ("dienstverteilungstyp_id") REFERENCES "dienstverteilungstyps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verteilungsoverrides" ADD CONSTRAINT "verteilungsoverrides_parameterset_id_fkey" FOREIGN KEY ("parameterset_id") REFERENCES "parametersets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verteilungsoverrides" ADD CONSTRAINT "verteilungsoverrides_dienstbedarf_id_fkey" FOREIGN KEY ("dienstbedarf_id") REFERENCES "dienstbedarves"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vertrags" ADD CONSTRAINT "vertrags_vertragsgruppe_id_fkey" FOREIGN KEY ("vertragsgruppe_id") REFERENCES "vertragsgruppes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "vertragsstuves" ADD CONSTRAINT "vertragsstuves_vertragsgruppe_id_fkey" FOREIGN KEY ("vertragsgruppe_id") REFERENCES "vertragsgruppes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vertragsstuves" ADD CONSTRAINT "vertragsstuves_vertrags_variante_id_fkey" FOREIGN KEY ("vertrags_variante_id") REFERENCES "vertrags_variantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vorlages" ADD CONSTRAINT "vorlages_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vorlages" ADD CONSTRAINT "vorlages_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wochenbilanzs" ADD CONSTRAINT "wochenbilanzs_mitarbeiter_id_fkey" FOREIGN KEY ("mitarbeiter_id") REFERENCES "mitarbeiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wochenbilanzs" ADD CONSTRAINT "wochenbilanzs_kalenderwoche_id_fkey" FOREIGN KEY ("kalenderwoche_id") REFERENCES "kalenderwoches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zeitraumkategories" ADD CONSTRAINT "zeitraumkategories_zeitraumregel_id_fkey" FOREIGN KEY ("zeitraumregel_id") REFERENCES "zeitraumregels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
