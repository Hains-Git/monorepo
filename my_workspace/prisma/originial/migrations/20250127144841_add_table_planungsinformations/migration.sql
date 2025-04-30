-- CreateTable
CREATE TABLE "planungsinformations" (
    "id" SERIAL NOT NULL,
    "tag" DATE NOT NULL,
    "po_dienst_id" INTEGER,
    "bereich_id" INTEGER,
    "kommentar" TEXT NOT NULL,

    CONSTRAINT "planungsinformations_pkey" PRIMARY KEY ("id")
);
