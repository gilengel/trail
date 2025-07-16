import {MapLibreRoute} from "~/types/route";
import type {GPXRoute} from "~/types/dto/convert";

export class GPXFile extends File {
    routeDto: GPXRoute | null = null;
    route: MapLibreRoute | null = null;
}
