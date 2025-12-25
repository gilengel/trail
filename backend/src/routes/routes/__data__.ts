/**
 * @file Test data for routes api.
 */
import * as Data from '../segments/__data__';
import * as DTO from '../../dto';

export const routeId = 0;
export const routeName = 'test_route';
export const routeDescription = 'test_route_description';
export const updatedRouteDescription = 'updated_test_route_description';
export const updatedRouteName = 'updated_test_route';

import { Route as PrismaRoute } from '@prisma/client';

const TestRoute = {
  id: 0,
  tripId: 0,
  name: routeName,
  description: routeDescription,
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DB {
  export const Route = {
    segments: [Data.DB.RouteSegmentWithUpdatedCoordinates],
    ...TestRoute,
  };

  export const RouteWithUpdatedName: PrismaRoute = {
    id: routeId,
    tripId: 0,
    name: updatedRouteName,
    description: routeDescription,
  };

  export const RouteWithUpdatedDescription: PrismaRoute = {
    id: routeId,
    tripId: 0,
    name: routeName,
    description: updatedRouteDescription,
  };

  export const RouteWithUpdatedNameAndDescription: PrismaRoute = {
    id: routeId,
    tripId: 0,
    name: updatedRouteName,
    description: updatedRouteDescription,
  };

  export const RouteWithUpdatedCoordinates = {
    id: routeId,
    tripId: 0,
    name: routeName,
    description: routeDescription,
    segments: [Data.DB.RouteSegmentWithUpdatedCoordinates],
  };

  export const RouteWithUpdatedNameAndCoordinates = {
    id: routeId,
    tripId: 0,
    name: updatedRouteName,
    description: routeDescription,
    segments: [Data.DB.RouteSegmentWithUpdatedCoordinates],
  };

  export const Routes: PrismaRoute[] = [DB.Route];
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Entities {
  export const Route = {
    segments: [Data.Entities.RouteSegmentWithUpdatedCoordinates],
    ...TestRoute,
  };

  export const RouteWithUpdatedName: PrismaRoute = {
    name: updatedRouteName,
    description: routeDescription,
    ...TestRoute,
  };

  export const RouteWithUpdatedDescription: PrismaRoute = {
    description: updatedRouteDescription,
    ...TestRoute,
  };

  export const RouteWithUpdatedNameAndDescription: PrismaRoute = {
    description: updatedRouteDescription,
    ...RouteWithUpdatedDescription,
  };

  export const RouteWithUpdatedCoordinates = {
    segments: [Data.DB.RouteSegmentWithUpdatedCoordinates],
    ...TestRoute,
  };

  export const RouteWithUpdatedNameAndCoordinates = {
    segments: [Data.DB.RouteSegmentWithUpdatedCoordinates],
    ...RouteWithUpdatedDescription,
  };

  export const Routes: PrismaRoute[] = [DB.Route];
}

export const newRoute: DTO.CreateRoutePublic = {
  name: 'new_test_route',
  tripId: 0,
  description: 'new test route description',
  segments: Data.newSegments,
};

export const newRouteWithoutSegments: DTO.CreateRoutePublic = {
  name: 'new_test_route',
  tripId: 0,
  description: '',
};

export const route: DTO.Route = {
  id: routeId,
  name: routeName,
  description: routeDescription,
  segments: Data.segments,
};
