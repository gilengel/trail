import type { Point2D } from "~/types/point";

export enum ImagePosition {
  Free,
  Centered,
}

export enum ImageSize {
  FitHorizontally,
  FitVertically,
  Free,
}

export type ImageScaleType = {
  origin: Point2D;
  value: number;
};

export const DefaultImageScale: ImageScaleType = {
  origin: { x: 0, y: 0 },
  value: 1,
};

export type ImageProperties = {
  aspectRatio: number;
  scale: ImageScaleType;
  sizeType: ImageSize;
  position?: Point2D;
  positionType: ImagePosition;
};
