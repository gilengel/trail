import type {Color} from "~/types/color";

export type ColoredProperty = {
    color?: Color
};

export type Route = {
    id: number,
    segmentIds: number[],
}

export type RouteMarker = {
    lng: number,
    lat: number
}

export type RouteProperty = {
    route: Route,
    marker?: RouteMarker
} & ColoredProperty;

type RoutePropertyKeys = ["route", "color"];
export type ProvidedPropertiesRoute = RoutePropertyKeys;
export type ConsumedPropertiesRoute = RoutePropertyKeys;

