import {MapLibreRoute, routeDto2MapLibreTrip} from "~/types/route";
import {defineStore} from 'pinia';
import {type RouteDto, type RouteSegmentDto} from "~/types/dto";

/**
 * Store that can catch routes for multiple trips. It hides all network related functionality that the user
 * does not care about configuration etc.
 * @returns Get function to fetch the routes either from local cache or backend (backend is triggered if the trip
 * was not requested before).
 */
export const useRouteStore = () =>
    defineStore('routeStore', () => {

        const dtoRoutesByTripId = reactive(new Map<number, RouteDto[]>());
        const dtoRoutesByRouteId = reactive(new Map<number, RouteDto>());
        const convertedRoutesByTripId = reactive(new Map<number, MapLibreRoute[]>());
        const convertedRoutesByRouteId = reactive(new Map<number, MapLibreRoute>());

        /**
         * Get a route by its ID.
         * @param routeId - The ID of the route. Must be positive value.
         * @returns The route dto if found, null otherwise.
         */
        async function getByRouteId(routeId: number): Promise<RouteDto | null> {
            if (dtoRoutesByRouteId.has(routeId)) {
                return dtoRoutesByRouteId.get(routeId) as RouteDto;
            }


            const {data: routeDTO} = await useApiFetch<RouteDto>(
                `/api/routes/${routeId}`
            );

            if (!routeDTO.value) {
                return null;
            }

            const route = routeDTO.value;
            if (dtoRoutesByTripId.has(route.tripId)) {
                const existingRoutesPerTrip: RouteDto[] = dtoRoutesByTripId.get(route.tripId)!;
                const existing: RouteDto | undefined = existingRoutesPerTrip.find((route) => route.id === route?.id);

                if (!existing) {
                    existingRoutesPerTrip.push(route);
                }
            } else {
                dtoRoutesByRouteId.set(routeId, route);
                dtoRoutesByTripId.set(route!.tripId, [route!]);
            }

            return route;
        }

        /**
         * Returns all associated routes of a trip from the backend.
         * @param tripId - The id of the trip as number.
         * @returns Promise with the trip.
         */
        async function getByTripId(tripId: number): Promise<RouteDto[] | null> {
            if (dtoRoutesByTripId.has(tripId)) {
                return dtoRoutesByTripId.get(tripId) as RouteDto[];
            }

            const {data: routeDTOs} = await useApiFetch<RouteDto[]>(
                `/api/routes/trip/${tripId}`
            );

            if (!routeDTOs.value) {
                return null;
            }

            const updatedRoutes = await Promise.all(routeDTOs.value.map(async (route: RouteDto) => {
                const segments = await $fetch<RouteSegmentDto[]>(`/api/routes/segment/route/${route.id}`);
                return {...route, segments};
            }));

            dtoRoutesByTripId.set(tripId, updatedRoutes);

            updatedRoutes.forEach(route => {
                dtoRoutesByRouteId.set(route.id, route);
            });


            return updatedRoutes;
        }


        /**
         * Returns all associated routes of a trip from the backend converted in a format that MapLibre can display.
         * @param tripId - The id of the trip as number.
         * @returns Promise with the trip.
         */
        async function getMapLibreRoutesForTrip(tripId: number): Promise<MapLibreRoute[] | null> {
            if (convertedRoutesByTripId.has(tripId)) {
                return convertedRoutesByTripId.get(tripId) as MapLibreRoute[];
            }

            if (dtoRoutesByTripId.has(tripId)) {
                const routes = dtoRoutesByTripId.get(tripId);
                convertedRoutesByTripId.set(tripId, routes!.map(routeDto2MapLibreTrip));

                return convertedRoutesByTripId.get(tripId) as MapLibreRoute[];
            }

            const routes = await getByTripId(tripId);
            if (!routes) {
                return null;
            }

            const convertedRoutes = routes!.map(routeDto2MapLibreTrip);
            convertedRoutesByTripId.set(tripId, convertedRoutes);
            convertedRoutes.forEach(route => {
                convertedRoutesByRouteId.set(route.id, route);
            });

            return convertedRoutesByTripId.get(tripId) as MapLibreRoute[];
        }

        /**
         * Get a route by its ID converted to a map libre object.
         * @param routeId - The ID of the route. Must be positive value.
         * @returns The converted route if found, null otherwise.
         */
        async function getMapLibreRoute(routeId: number): Promise<MapLibreRoute | null> {
            if (convertedRoutesByRouteId.has(routeId)) {
                return convertedRoutesByRouteId.get(routeId) as MapLibreRoute;
            }

            const routeDTO = await getByRouteId(routeId);
            if (!routeDTO) {
                return null;
            }

            const convertedRoute = routeDto2MapLibreTrip(routeDTO);
            convertedRoutesByRouteId.set(routeDTO.id, convertedRoute);
            if (!convertedRoutesByTripId.has(routeDTO.tripId)) {
                convertedRoutesByTripId.set(routeDTO.tripId, [convertedRoute]);
            }

            return convertedRoutesByRouteId.get(routeId) as MapLibreRoute;
        }

        return {
            getByRouteId,
            getByTripId,
            getMapLibreRoute,
            getMapLibreRoutesForTrip
        };
    })();
