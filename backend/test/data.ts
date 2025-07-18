/**
 * @file Data that is used for unit tests.
 */
import { v4 as uuidv4 } from 'uuid';
import { Route } from '../src/routes/entity/route';
import { RouteSegment } from '../src/routes.segments/entity/routes.segment';
import {
  CreateRouteDto,
  CreateRouteSegmentDto, CreateTripDto,
  DbImageDto, ImageDto,
  RouteDto,
  RouteSegmentDto,
  RouteWithoutSegmentsDto, TripDto,
} from '../src/dto';
import { GPXRoute, GPXRouteSegment } from '../src/dto/convert';


export const date = new Date('05 Jan 2000 12:15:00 GMT');

export const wkt = 'LINESTRING Z(30 10 0,10 30 0,40 40 0)';
export const updatedWkt = 'LINESTRING Z(30 10 0,10 30 0)';

export const tripName = 'test_trip';
export const routeId = 0;
export const tripId = 0;
export const routeName = 'test_route';
export const routeDescription = 'test_route_description';
export const updatedRouteDescription = 'updated_test_route_description';

export const segmentId = 42;
export const segmentName = 'test_route_segment';
export const segmentDescription = 'test_route_segment_description';
export const updatedSegmentName = 'updated_test_route_segment';
export const updatedSegmentDescription =
  'updated_test_route_segment_description';
export const updatedName = 'updated_test_route';

export const coordinates: Array<[number, number, number]> = [
  [30, 10, 0],
  [10, 30, 0],
  [40, 40, 0],
];

export const segments: RouteSegmentDto[] = [
  {
    id: segmentId,
    name: 'test_route_segment',
    description: segmentDescription,
    coordinates,
  },
];

export const gpxSegments: GPXRouteSegment[] = [
  {
    name: 'test_route_segment',
    coordinates,
  },
];

export const updatedCoordinates: Array<[number, number, number]> = [
  [30, 10, 0],
  [10, 30, 0],
];

export const route: RouteDto = {
  id: routeId,
  tripId: routeId,
  name: routeName,
  description: routeDescription,
  segments,
};

export const routeWithoutSegments: RouteWithoutSegmentsDto = {
  id: routeId,
  tripId: routeId,
  name: routeName,
  description: routeDescription
};

export const routeWithEmptySegments: RouteDto = {
  id: routeId,
  tripId: routeId,
  name: routeName,
  description: routeDescription,
  segments: []
};

export const gpxRoute: GPXRoute = {
  name: routeName,
  segments: gpxSegments,
};

export const routeSegment: RouteSegmentDto = {
  id: segmentId,
  name: segmentName,
  description: segmentDescription,
  coordinates,
};

export const updatedRouteSegment: RouteSegmentDto = {
  id: segmentId,
  name: updatedSegmentName,
  coordinates: updatedCoordinates,
};

export const newRoute: CreateRouteDto = {
  name: 'new_test_route',
  description: 'new test route description',
  segments,
  tripId: 0
};

export const newRouteWithoutSegments: CreateRouteDto = {
  name: 'new_test_route',
  description: '',
  tripId: 0
};

export const newRouteSegment: CreateRouteSegmentDto = {
  routeId: routeId,
  name: segmentName,
  coordinates,
};

export const routeWithEmptyName: RouteDto = {
  id: routeId,
  tripId: routeId,
  name: '',
  description: '',
  segments,
};

export const routes: RouteDto[] = [route];

export const dbRouteSegment: RouteSegment = {
  id: segmentId,
  name: segmentName,
  description: segmentDescription,
  coordinates: wkt,
};

export const dbRouteSegmentWithUpdatedCoordinates: RouteSegment = {
  id: segmentId,
  name: segmentName,
  description: segmentDescription,
  coordinates: updatedWkt,
};

export const dbRouteSegmentWithUpdatedName: RouteSegment = {
  id: segmentId,
  name: updatedSegmentName,
  description: segmentDescription,
  coordinates: wkt,
};

export const dbRouteSegmentWithUpdatedDescription: RouteSegment = {
  id: segmentId,
  name: segmentName,
  description: updatedSegmentDescription,
  coordinates: wkt,
};

export const dbRoute: Route = {
  id: 0,
  tripId: 0,
  name: routeName,
  description: routeDescription,
  segments: [dbRouteSegment],
};

export const dbRouteWithUpdatedName: RouteWithoutSegmentsDto = {
  id: routeId,
  tripId: routeId,
  name: updatedName,
  description: routeDescription,
  //segments: [dbRouteSegment],
};

export const dbRouteWithUpdatedDescription: RouteWithoutSegmentsDto = {
  id: routeId,
  tripId: routeId,
  name: routeName,
  description: updatedRouteDescription,
};

export const dbRouteWithUpdatedNameAndDescription: RouteWithoutSegmentsDto = {
  id: routeId,
  tripId: routeId,
  name: updatedName,
  description: updatedRouteDescription,
};

export const dbRouteWithUpdatedCoordinates: Route = {
  id: routeId,
  tripId: routeId,
  name: routeName,
  description: routeDescription,
  segments: [dbRouteSegmentWithUpdatedCoordinates],
};

export const dbRouteWithUpdatedNameAndCoordinates: Route = {
  id: routeId,
  tripId: routeId,
  name: updatedName,
  description: routeDescription,
  segments: [dbRouteSegmentWithUpdatedCoordinates],
};

export const dbRoutes: Route[] = [dbRoute];

const uuid = uuidv4();
export const dbImages: DbImageDto[] = [
  {
    id: uuid.toString(),
    timestamp: date,
    coordinates: 'POINT(47.17970059972222 10.893711999999999)',
    mime_type: 'image/jpeg',
  },
];

export const images: ImageDto[] = [
  {
    id: uuid.toString(),
    name: 'not_implemented',
    timestamp: date,
    coordinates: [47.17970059972222, 10.893711999999999],
    url: `${uuid.toString()}.jpg`,
  },
];

const multipleImages: ImageDto[] = [];

for (let i = 0; i < 3; i++) {
  multipleImages.push({
    id: uuid.toString(),
    name: 'not_implemented',
    timestamp: date,
    coordinates: [47.17970059972222, 10.893711999999999],
    url: `${uuid.toString()}.jpg`,
  });
}

const multipleDbImages: DbImageDto[] = [];

for (let i = 0; i < 3; i++) {
  multipleDbImages.push({
    id: uuid.toString(),
    timestamp: date,
    coordinates: 'POINT(47.17970059972222 10.893711999999999)',
    mime_type: 'image/jpeg',
  });
}

export const dbTrip: TripDto = {
  id: routeId,
  name: tripName,
  layout: {} as unknown,
};

export const newTrip: CreateTripDto = {
  name: tripName,
  layout: {},
};

export const dbTripWithUpdatedLayout: TripDto = {
  id: routeId,
  name: routeName,
  layout: { test: "value" },
};
export { multipleImages, multipleDbImages };
