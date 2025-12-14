/**
 * @file Test data for routes api.
 */
import * as Data from "../segments/__data__";

import * as DTO from '../../dto'

export const routeId = 0;
export const routeName = 'test_route';
export const routeDescription = 'test_route_description';
export const updatedRouteDescription = 'updated_test_route_description';
export const updatedRouteName = 'updated_test_route';

import { Route as PrismaRoute } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DB {
  export const Route = {
    id: 0,
    tripId: 0,
    name: routeName,
    description: routeDescription,
    segments: [Data.DB.RouteSegmentWithUpdatedCoordinates],
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
export namespace Enties {
  export const Route = {
    id: 0,
    tripId: 0,
    name: routeName,
    description: routeDescription,
    segments: [Data.Entities.RouteSegmentWithUpdatedCoordinates],
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


export const newRoute: DTO.CreateRoutePublic = {
  name: 'new_test_route',
  tripId: 0,
  description: 'new test route description',
  segments: Data.newSegments
};

export const newRouteWithoutSegments: DTO.CreateRoutePublic = {
  name: 'new_test_route',
  tripId: 0,
  description: ''
};

export const routeWithEmptyName: DTO.Route = {
  id: routeId,
  name: '',
  description: '',
  segments: Data.segments

};

export const route: DTO.Route = {
  id: routeId,
  name: routeName,
  description: routeDescription,
  segments: Data.segments

};

export const routes: DTO.Route[] = [route];

export const routeWithoutSegments = {
  id: routeId,
  name: routeName,
  description: routeDescription,
};

export const routeWithEmptySegments: DTO.Route = {
  id: routeId,
  name: routeName,
  description: routeDescription,
  segments: [],
};

/*
export const gpxSegments: GPXRouteSegment[] = [
  {
    name: 'test_route_segment',
    coordinates,
  },
];

export const gpxRoute: GPXRoute = {
  name: routeName,
  segments: gpxSegments,
};
*/
