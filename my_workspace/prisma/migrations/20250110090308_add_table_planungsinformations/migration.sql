-- CreateTable
CREATE SEQUENCE "planungsinformations_id_seq" AS INTEGER;

CREATE TABLE "planungsinformations" (
    "id" INTEGER NOT NULL DEFAULT nextval('planungsinformations_id_seq'),
    "tag" DATE,
    "po_dienst_id" INTEGER,
    "bereich_id" INTEGER,
    "kommentar" TEXT NOT NULL,

    CONSTRAINT "planungsinformations_pkey" PRIMARY KEY ("id")
);

ALTER SEQUENCE "planungsinformations_id_seq" OWNED BY "planungsinformations"."id";
