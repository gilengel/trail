/*
  Warnings:

  - You are about to drop the column `coordinates` on the `Route` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "route_idx";

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "coordinates";

-- CreateTable
CREATE TABLE "RouteSegment" (
    "id" SERIAL NOT NULL,
    "routeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "coordinates" geometry(Linestring, 4326) NOT NULL,

    CONSTRAINT "RouteSegment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "route_segment_idx" ON "RouteSegment" USING GIST ("coordinates");

-- AddForeignKey
ALTER TABLE "RouteSegment" ADD CONSTRAINT "RouteSegment_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
