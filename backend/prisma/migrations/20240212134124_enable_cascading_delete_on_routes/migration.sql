-- DropForeignKey
ALTER TABLE "RouteSegment" DROP CONSTRAINT "RouteSegment_routeId_fkey";

-- AddForeignKey
ALTER TABLE "RouteSegment" ADD CONSTRAINT "RouteSegment_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;
