import type {Point2D} from "~/types/point";

export enum ImagePosition {
    Free,
    Centered,
}

export enum ImageSize {
    FitHorizontally,
    FitVertically,
    Free
}

export interface ImageProperties {
    aspectRatio: number;
    scale: { origin: Point2D, value: number };
    sizeType: ImageSize;
    position?: Point2D;
    positionType: ImagePosition
}