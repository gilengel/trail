/**
 * @file Contains data for unit tests of route segments.
 */
import { CreateRouteSegmentPublic } from "./dto/create.route.segment.dto";
import { RouteSegment } from "./dto/route.segment.dto";
import { DB as SegmentDB } from "./route.segments.database";
import * as DTO from '../../dto'

export const segmentId = 42;
export const segmentName = 'test_route_segment';
export const segmentDescription = 'test_route_segment_description';
export const updatedSegmentName = 'updated_test_route_segment';
export const updatedSegmentDescription =
  'updated_test_route_segment_description';

export const wkt = 'LINESTRING Z(30 10 0,10 30 0,40 40 0)';
export const updatedWkt = 'LINESTRING Z(30 10 0,10 30 0)';

export const coordinates: Array<[number, number, number]> = [
  [30, 10, 0],
  [10, 30, 0],
  [40, 40, 0],
];

export const updatedCoordinates: Array<[number, number, number]> = [
  [30, 10, 0],
  [10, 30, 0],
];


export const newRouteSegment: CreateRouteSegmentPublic = {
  routeId: 0,
  name: segmentName,
  coordinates,
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DB {
  export const RouteSegmentWithUpdatedCoordinates: SegmentDB.RouteSegment = {
    id: segmentId,
    routeId: 0,
    name: segmentName,
    description: segmentDescription,
    coordinates: wkt,
  };

  export const RouteSegmentWithUpdatedName: SegmentDB.RouteSegment = {
    id: segmentId,
    routeId: 0,
    name: updatedSegmentName,
    description: segmentDescription,
    coordinates: wkt,
  };

  export const RouteSegmentWithUpdatedDescription: SegmentDB.RouteSegment = {
    id: segmentId,
    routeId: 0,
    name: segmentName,
    description: updatedSegmentDescription,
    coordinates: wkt,
  };

  export const RouteSegment: SegmentDB.RouteSegment = {
    id: segmentId,
    routeId: 0,
    name: segmentName,
    description: segmentDescription,
    coordinates: wkt
  };

  export const Segments: SegmentDB.RouteSegment[] = [
    {
      id: segmentId,
      routeId: 0,
      name: 'test_route_segment',
      description: segmentDescription,
      coordinates: wkt,
    },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Entities {
  export const RouteSegmentWithUpdatedCoordinates: DTO.RouteSegment = {
    id: segmentId,
    name: segmentName,
    description: segmentDescription,
    coordinates,
  };

  export const RouteSegmentWithUpdatedName: DTO.RouteSegment = {
    id: segmentId,
    name: updatedSegmentName,
    description: segmentDescription,
    coordinates,
  };

  export const RouteSegmentWithUpdatedDescription: DTO.RouteSegment = {
    id: segmentId,
    name: segmentName,
    description: updatedSegmentDescription,
    coordinates,
  };

  export const RouteSegment: DTO.RouteSegment = {
    id: segmentId,
    name: segmentName,
    description: segmentDescription,
    coordinates
  };

  export const Segments: DTO.RouteSegment[] = [
    {
      id: segmentId,
      name: 'test_route_segment',
      description: segmentDescription,
      coordinates,
    },
  ];
}

export const updatedRouteSegment: RouteSegment = {
  id: segmentId,
  description: '',
  name: updatedSegmentName,
  coordinates: updatedCoordinates,
};

export const routeSegment: DTO.RouteSegment = {
  id: segmentId,
  name: segmentName,
  description: segmentDescription,
  coordinates: coordinates,
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Entities {
  export const segment: DTO.RouteSegment = {
    id: segmentId,
    name: 'test_route_segment',
    description: segmentDescription,
    coordinates,
  }

  export const segmentWithUpdatedName: DTO.RouteSegment = {
    id: segmentId,
    name: updatedSegmentName,
    description: segmentDescription,
    coordinates,
  }

  export const segmentWithUpdatedDescription: DTO.RouteSegment = {
    id: segmentId,
    name: updatedSegmentName,
    description: updatedSegmentDescription,
    coordinates,
  }

  export const segmentWithUpdatedCoordinates: DTO.RouteSegment = {
    id: segmentId,
    name: segmentName,
    description: segmentDescription,
    coordinates: updatedCoordinates,
  }
}

export const segments: RouteSegment[] = [
  {
    id: segmentId,
    name: 'test_route_segment',
    description: segmentDescription,
    coordinates,
  },
];

export const newSegments: DTO.CreateRouteSegmentPrivate[] = [
  {
    name: 'test_route_segment',
    description: segmentDescription,
    coordinates,
  },
];