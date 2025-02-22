import {MapLibreRoute, routeDto2MapLibreTrip, type TripDto} from "~/types/route";
import {createDefaultGrid} from "~/stores/grid";
import {defineStore} from 'pinia';
import type {RouteDto, RouteSegmentDto} from "~/types/route.dto";

/**
 * Store that can catch routes for multiple trips. It hides all network related functionality that the user
 * does not care about configuration etc.
 * @returns Get function to fetch the routes either from local cache or backend (backend is triggered if the trip
 * was not requested before).
 */
export const useRouteStore = () =>
    defineStore('routeStore', () => {

        const dtoRoutes = reactive(new Map<number, RouteDto[]>());
        const convertedRoutes = reactive(new Map<number, MapLibreRoute[]>());

        /**
         * Returns all associated routes of a trip from the backend.
         *
         * @param tripId - The id of the trip as number.
         * @returns Promise with the trip.
         */
        async function getForTrip(tripId: number): Promise<RouteDto[] | null> {
            if (dtoRoutes.has(tripId)) {
                return dtoRoutes.get(tripId) as RouteDto[];
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


            dtoRoutes.set(tripId, updatedRoutes);

            return updatedRoutes;
        }

        /**
         * Returns all associated routes of a trip from the backend converted in a format that can be displayed by MapLibre.
         *
         * @param tripId - The id of the trip as number.
         * @returns Promise with the trip.
         */
        async function getMapLibreRoutesForTrip(tripId: number): Promise<MapLibreRoute[] | null> {
            if (convertedRoutes.has(tripId)) {
                return convertedRoutes.get(tripId) as MapLibreRoute[];
            }

            if (dtoRoutes.has(tripId)) {
                const routes = dtoRoutes.get(tripId);
                convertedRoutes.set(tripId, routes!.map(routeDto2MapLibreTrip));

                return convertedRoutes.get(tripId) as MapLibreRoute[];
            }

            const routes = await getForTrip(tripId);
            if (!routes) {
                return null;
            }

            convertedRoutes.set(tripId, routes!.map(routeDto2MapLibreTrip));

            return convertedRoutes.get(tripId) as MapLibreRoute[];
        }

        return {
            getForTrip,
            getMapLibreRoutesForTrip
        }
    })();
