import {createDefaultGrid} from "~/stores/grid";
import {defineStore} from 'pinia';
import {useUpload} from "~/composables/useUpload";
import {useDelete} from "~/composables/useDelete";
import type {Grid} from "~/types/grid";
import type {TripDto} from "~/types/dto";
import type {CreateTripDto} from "~/types/dto";

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
        async function get(id: number): Promise<TripDto | null> {
            if (trips.has(id)) {
                return trips.get(id) as TripDto;
            }

            const {data: trip} = await useApiFetch<TripDto>(
                `/api/trips/${id}`
            );

            if (trip.value === null) {
                return null;
            }

            // TripId is not stored inside the grid on database level
            if (trip.value.layout) {
                (trip.value.layout as Grid).tripId = trip.value.id;
            }

            trips.set(id, trip.value);

            return trip.value;
        }

        /**
         * Get all trips, either from locale cache or from backend.
         * @param fetch - If true, will do a backend requests and update the locale cache, otherwise
         * only local stored trips are returned.
         * @returns A map containing where the key of each entry is the trip id and the value the dto of the trip.
         */
        async function all(fetch: boolean = true): Promise<Map<number, TripDto>> {
            if (!fetch) {
                return trips;
            }

            const {data: dbTrips} = await useFetch<TripDto[]>('/api/trips')
            dbTrips.value?.forEach(trip => {
                if (!trips.has(trip.id)) {
                    trips.set(trip.id, trip);
                }
            })

            return trips;
        }

        /**
         * Creates a new trip in the locale cache and in the backend.
         * @param trip - The dto of the new trip to be created.
         * @returns The dto of newly created trip if successful.
         */
        async function create(trip: CreateTripDto): Promise<TripDto> {
            const newTrip = await useUpload<TripDto>('/api/trips', {
                name: trip.name,
                layout: createDefaultGrid(0)
            });

            trips.set(newTrip.id, newTrip);

            return newTrip;
        }

        /**
         * Deletes a trip to the locale cache and in the backend.
         * @param trip - The dto of the trip to be deleted.
         * @returns The dto of newly created trip if successful.
         */
        async function remove(trip: TripDto): Promise<TripDto> {
            const deletedTrip = await useDelete<TripDto>(`/api/trips/${trip.id}`);

            trips.delete(trip.id);

            return deletedTrip;
        }


        return {
            create,
            get,
            all,
            remove
        }
    })();
