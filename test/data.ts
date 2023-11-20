import { DbImageDto, ImageDto } from '../src/images/dto/image.dto';
import { CreateRouteDto } from '../src/routes/dto/create.route.dto';
import { DbRouteDto, RouteDto } from '../src/routes/dto/route.dto';
import { v4 as uuidv4 } from 'uuid';

export const wkt = 'LINESTRING(30 10,10 30,40 40)';
export const updatedWkt = 'LINESTRING(30 10,10 30)';

export const name = 'test_route';
export const updatedName = 'updated_test_route';

export const coordinates = [
  [30, 10],
  [10, 30],
  [40, 40],
];

export const updatedCoordinates = [
  [30, 10],
  [10, 30],
];

export const route: RouteDto = {
  id: 0,
  name,
  coordinates,
};

export const newRoute: CreateRouteDto = {
  name: 'new_test_route',
  coordinates,
};
export const routeWithEmptyName: RouteDto = {
  id: 0,
  name: '',
  coordinates,
};

export const routes: RouteDto[] = [route];

export const dbRoute: DbRouteDto = {
  id: 0,
  name,
  coordinates: wkt,
};

export const dbRouteWithUpdatedName: DbRouteDto = {
  id: 0,
  name: updatedName,
  coordinates: wkt,
};

export const dbRouteWithUpdatedCoordinates: DbRouteDto = {
  id: 0,
  name,
  coordinates: updatedWkt,
};

export const dbRouteWithUpdatedNameAndCoordinates: DbRouteDto = {
  id: 0,
  name: updatedName,
  coordinates: updatedWkt,
};

export const dbRoutes: DbRouteDto[] = [dbRoute];

const uuid = uuidv4();
export const dbImages: DbImageDto[] = [
  {
    uuid,
    timestamp: new Date(),
    coordinates: 'POINT(47.17970059972222 10.893711999999999)',
  },
];

export const images: ImageDto[] = [
  {
    uuid,
    name: 'not_implemented',
    coordinates: [47.17970059972222, 10.893711999999999],
  },
];
