-- AlterTable
CREATE SEQUENCE datei_typ_gruppe_id_seq;
ALTER TABLE "datei_typ_gruppe" ALTER COLUMN "id" SET DEFAULT nextval('datei_typ_gruppe_id_seq');
ALTER SEQUENCE datei_typ_gruppe_id_seq OWNED BY "datei_typ_gruppe"."id";

-- AlterTable
CREATE SEQUENCE geraet_dateis_id_seq;
ALTER TABLE "geraet_dateis" ALTER COLUMN "id" SET DEFAULT nextval('geraet_dateis_id_seq');
ALTER SEQUENCE geraet_dateis_id_seq OWNED BY "geraet_dateis"."id";

-- AlterTable
CREATE SEQUENCE mitarbeiter_dateis_id_seq;
ALTER TABLE "mitarbeiter_dateis" ALTER COLUMN "id" SET DEFAULT nextval('mitarbeiter_dateis_id_seq');
ALTER SEQUENCE mitarbeiter_dateis_id_seq OWNED BY "mitarbeiter_dateis"."id";

-- AlterTable
CREATE SEQUENCE oauth_access_tokens_new_id_seq;
ALTER TABLE "oauth_access_tokens_new" ALTER COLUMN "id" SET DEFAULT nextval('oauth_access_tokens_new_id_seq');
ALTER SEQUENCE oauth_access_tokens_new_id_seq OWNED BY "oauth_access_tokens_new"."id";

-- AlterTable
CREATE SEQUENCE oauth_authorization_codes_id_seq;
ALTER TABLE "oauth_authorization_codes" ALTER COLUMN "id" SET DEFAULT nextval('oauth_authorization_codes_id_seq');
ALTER SEQUENCE oauth_authorization_codes_id_seq OWNED BY "oauth_authorization_codes"."id";

-- AlterTable
CREATE SEQUENCE oauth_clients_id_seq;
ALTER TABLE "oauth_clients" ALTER COLUMN "id" SET DEFAULT nextval('oauth_clients_id_seq');
ALTER SEQUENCE oauth_clients_id_seq OWNED BY "oauth_clients"."id";

-- AlterTable
CREATE SEQUENCE oauth_refresh_tokens_id_seq;
ALTER TABLE "oauth_refresh_tokens" ALTER COLUMN "id" SET DEFAULT nextval('oauth_refresh_tokens_id_seq');
ALTER SEQUENCE oauth_refresh_tokens_id_seq OWNED BY "oauth_refresh_tokens"."id";

-- AlterTable
CREATE SEQUENCE planungsinformations_id_seq;
ALTER TABLE "planungsinformations" ALTER COLUMN "id" SET DEFAULT nextval('planungsinformations_id_seq');
ALTER SEQUENCE planungsinformations_id_seq OWNED BY "planungsinformations"."id";

-- AlterTable
CREATE SEQUENCE team_kopf_soll_id_seq;
ALTER TABLE "team_kopf_soll" ALTER COLUMN "id" SET DEFAULT nextval('team_kopf_soll_id_seq');
ALTER SEQUENCE team_kopf_soll_id_seq OWNED BY "team_kopf_soll"."id";

-- AlterTable
CREATE SEQUENCE team_vk_soll_id_seq;
ALTER TABLE "team_vk_soll" ALTER COLUMN "id" SET DEFAULT nextval('team_vk_soll_id_seq');
ALTER SEQUENCE team_vk_soll_id_seq OWNED BY "team_vk_soll"."id";

-- AlterTable
CREATE SEQUENCE telefonliste_joomla_id_seq;
ALTER TABLE "telefonliste_joomla" ALTER COLUMN "id" SET DEFAULT nextval('telefonliste_joomla_id_seq');
ALTER SEQUENCE telefonliste_joomla_id_seq OWNED BY "telefonliste_joomla"."id";

-- AlterTable
CREATE SEQUENCE telefonliste_label_id_seq;
ALTER TABLE "telefonliste_label" ALTER COLUMN "id" SET DEFAULT nextval('telefonliste_label_id_seq');
ALTER SEQUENCE telefonliste_label_id_seq OWNED BY "telefonliste_label"."id";
