import { RouteSegmentDto } from '../src/routes.segments/dto/route.segment.dto';
import { DbImageDto, ImageDto } from '../src/images/dto/image.dto';
import { CreateRouteDto } from '../src/routes/dto/create.route.dto';
import { RouteDto } from '../src/routes/dto/route.dto';
import { v4 as uuidv4 } from 'uuid';
import { CreateRouteSegmentDto } from '../src/routes.segments/dto/create-route.segment.dto';
import { Route } from '../src/routes/entity/route';
import { RouteSegment } from '../src/routes.segments/entity/routes.segment';

export const wkt = 'LINESTRING(30 10,10 30,40 40)';
export const updatedWkt = 'LINESTRING(30 10,10 30)';

export const routeId = 0;
export const name = 'test_route';
export const segmentId = 42;
export const segmentName = 'test_route_segment';
export const updatedSegmentName = 'updated_test_route_segment';
export const updatedName = 'updated_test_route';

export const coordinates = [
  [30, 10],
  [10, 30],
  [40, 40],
];

export const segments: RouteSegmentDto[] = [
  {
    id: segmentId,
    name: 'test_route_segment',
    coordinates,
  },
];

export const updatedCoordinates = [
  [30, 10],
  [10, 30],
];

export const route: RouteDto = {
  id: routeId,
  name,
  segments,
};

export const routeSegment: RouteSegmentDto = {
  id: segmentId,
  name: segmentName,
  coordinates,
};

export const updatedRouteSegment: RouteSegmentDto = {
  id: segmentId,
  name: updatedSegmentName,
  coordinates: updatedCoordinates,
};

export const newRoute: CreateRouteDto = {
  name: 'new_test_route',
  segments,
};

export const newRouteSegment: CreateRouteSegmentDto = {
  routeId: routeId,
  name: segmentName,
  coordinates,
};

export const newRouteWithNotEnoughCoordinates: CreateRouteDto = {
  name: 'invalid_test_route',
  segments: [
    {
      name: 'invalid_segment',
      coordinates: [[0]],
    },
  ],
};

export const routeWithEmptyName: RouteDto = {
  id: routeId,
  name: '',
  segments,
};

export const routes: RouteDto[] = [route];

export const dbRouteSegment: RouteSegment = {
  id: segmentId,
  name: segmentName,
  coordinates: wkt,
};

export const dbRouteSegmentWithUpdatedCoordinates: RouteSegment = {
  id: segmentId,
  name: segmentName,
  coordinates: updatedWkt,
};

export const dbRouteSegmentWithUpdatedName: RouteSegment = {
  id: segmentId,
  name: updatedSegmentName,
  coordinates: wkt,
};

export const dbRoute: Route = {
  id: 0,
  name,
  segments: [dbRouteSegment],
};

export const dbRouteWithUpdatedName: Route = {
  id: routeId,
  name: updatedName,
  segments: [dbRouteSegment],
};

export const dbRouteWithUpdatedCoordinates: Route = {
  id: routeId,
  name,
  segments: [dbRouteSegmentWithUpdatedCoordinates],
};

export const dbRouteWithUpdatedNameAndCoordinates: Route = {
  id: routeId,
  name: updatedName,
  segments: [dbRouteSegmentWithUpdatedCoordinates],
};

export const dbRoutes: Route[] = [dbRoute];

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
