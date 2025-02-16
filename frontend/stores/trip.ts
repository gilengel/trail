import {type TripDto} from "~/types/route";
import {createDefaultGrid} from "~/stores/grid";
import {defineStore} from 'pinia';

/**
 * Store that can catch (multiple) trips. It hides all network related functionality that the user
 * does not care about configuration etc.
 * @returns Get function to fetch a trip either from local cache or backend (backend is triggered if the trip
 * was not requested before).
 */
export const useTripStore = () =>
    defineStore('tripStore', () => {

        const trips = reactive(new Map<number, TripDto>());

        /**
         * Returns the trip if it was already loaded before, if not it will try to fetch it
         * from the backend.
         * @param id - The id of the trip as number.
         * @returns Promise with the trip.
         */
        async function get(id: number) : Promise<TripDto | null> {
            if (trips.has(id)) {
                return trips.get(id) as TripDto;
            }

            const {data: trip} = await useApiFetch<TripDto>(
                `/api/trips/${id}`
            );

            if (trip.value === null) {
                return null;
            }

            if (JSON.stringify(trip.value.layout) === "{}") {
                trip.value.layout = createDefaultGrid();
            }

            trips.set(id, trip.value);

            return trip.value;
        }

        return {
            get
        }
    })();
