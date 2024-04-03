/*
  Warnings:

  - Added the required column `description` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `RouteSegment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis_raster";

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RouteSegment" ADD COLUMN     "description" TEXT NOT NULL;
