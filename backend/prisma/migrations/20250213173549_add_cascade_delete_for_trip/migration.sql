-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_tripId_fkey";

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
