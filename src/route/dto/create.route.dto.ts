export interface CreateRouteDto {
  name: string;

  /**
   * limits:
   * minimum: two coordinates 2d or 3d
   * maximum: one million coordinates 2d or 3d (although we highly recommend to not store such long routes as querying them will be slow)
   *
   * all coordinates must be either 2d or 3d - mixing is not allowed and shall return an error by the backend
   */
  coordinates: Array<Array<number>>;
}
