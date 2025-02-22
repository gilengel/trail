import type {GPXRoute} from "shared";
import {MapLibreRoute} from "~/types/route";

export class GPXFile extends File {
    routeDto: GPXRoute | null = null;
    route: MapLibreRoute | null = null;
}
