import type {GPXRoute} from "shared";
import {MapLibreTrip} from "~/types/route";

export class GPXFile extends File {
    routeDto: GPXRoute | null = null;
    route: MapLibreTrip | null = null;
}
