import type {RouteDto} from "~/types/route.dto";
import {MapLibreTrip, TripDto2MapLibreTrip} from "~/types/route";

/**
 * Store that can catch (multiple) trips. It hides all network related functionality that the user
 * does not care about configuration etc.
 */
export const useTripStore = defineStore('tripStore', {
    state: () => ({
        trips: reactive(new Map<number, MapLibreTrip>())
    }),
    actions: {
        /**
         * Returns the trip if it was already loaded before, if not it will try to fetch it
         * from the backend.
         * @param id - The id of the trip as number.
         * @returns Promise with the trip.
         */
        async get(id: number) {
            if (this.trips.has(id)) {
                return this.trips.get(id);
            }

            const {data: routeDto} = await useApiFetch<RouteDto>(
                `/api/routes/${id}`
            );

            if (routeDto.value) {
                this.trips.set(id, TripDto2MapLibreTrip(routeDto.value));
            }

            return this.trips.get(id) ?? null;
        }
    }
})
