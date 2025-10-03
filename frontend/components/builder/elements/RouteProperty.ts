import type {Color} from "~/types/color";

export type ColoredProperty = {
    color?: Color
};

export type RouteProperty = {
    routeId?: number
    segmentsIds?: number[]
} & ColoredProperty;

type RoutePropertyKeys = ["segmentsIds", "routeId"];
export type ProvidedPropertiesRoute = RoutePropertyKeys;
export type ConsumedPropertiesRoute = RoutePropertyKeys;

