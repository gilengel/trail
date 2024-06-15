export interface RouteDto {
  id: number
  name: string
  segments: RouteSegmentDto[]
}

export interface RouteSegmentDto {
  id: number
  name: string
  coordinates: number[][]
  color: string
}
