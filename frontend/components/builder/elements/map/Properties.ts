export interface MapProperties {
    routeId?: number,
    segmentsIds?: number[],
}

export type ProvidedProperties = (keyof MapProperties)[];
export type ConsumedProperties = (keyof MapProperties)[];
