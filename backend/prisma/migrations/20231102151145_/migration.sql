CREATE EXTENSION postgis;

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coords" geometry(Point, 4326) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "coordinates" geometry(Linestring, 4326) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "coordinates" geometry(Point, 4326) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "location_idx" ON "Location" USING GIST ("coords");

-- CreateIndex
CREATE INDEX "route_idx" ON "Route" USING GIST ("coordinates");

-- CreateIndex
CREATE INDEX "image_idx" ON "Image" USING GIST ("coordinates");
