export interface LeafletSegment {
  id: number
  name: string
  color: string
  start: L.Marker
  end: L.Marker
  route: L.Polyline
  length: number
}
