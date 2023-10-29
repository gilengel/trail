import { CreateRouteDto } from './create.route.dto';

export interface RouteDto extends CreateRouteDto {
  id: number;
}

/**
 * Represents a database RouteDto object.
 */
export interface DbRouteDto {
  id: number;
  name: string;
  coordinates: string;
}
