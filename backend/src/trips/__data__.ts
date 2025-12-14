/**
 * @file Test data for the trips api.
 */
import * as DTO from './dto'
import * as routeTestData from "../routes/routes/__data__"

export const tripName = 'test_trip';
export const tripId = 0;

export const trip: DTO.Trip = {
  id: routeTestData.routeId,
  name: tripName,
  layout: {},
  routes: []
};

export const newTrip: DTO.CreateTrip = {
  name: tripName,
  layout: {},
};

export const dbTripWithUpdatedLayout: DTO.Trip = {
  id: routeTestData.routeId,
  name: routeTestData.routeName,
  layout: { test: 'value' },
  routes: []
};