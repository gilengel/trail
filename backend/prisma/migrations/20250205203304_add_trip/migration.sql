-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "layout" JSONB NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);
