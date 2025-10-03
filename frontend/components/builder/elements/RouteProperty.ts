import type {Color} from "~/types/color";

export type ColoredProperty = {
    color?: Color
};

export type RouteProperty = {
    routeId?: number
    segmentsIds?: number[]
} & ColoredProperty;

const RoutePropertyKeys = ["segmentsIds", "routeId"] as const;
export type ProvidedPropertiesRoute = typeof RoutePropertyKeys;
export type ConsumedPropertiesRoute = typeof RoutePropertyKeys;

