export interface RouteProperty {
    routeId?: number
    segmentsIds?: number[]
}

const RoutePropertyKeys = ["segmentsIds", "routeId"] as const;
export type ProvidedPropertiesRoute = typeof RoutePropertyKeys;
export type ConsumedPropertiesRoute = typeof RoutePropertyKeys;

