import {describe, it, expect, vi, beforeEach} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';
import * as apiFetchModule from '~/composables/apiFetch';

const mockUseApiFetch = vi.fn();

// 👇 Mock the module where useApiFetch is defined
vi.mock('~/composables/apiFetch', () => ({
    useApiFetch: async (request: unknown, opts?: unknown) => mockUseApiFetch(request, opts),
}));

describe('useRouteStore (no internal state access)', () => {

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('getByRouteId fetches route and caches it implicitly', async () => {
        const spy = vi.spyOn(apiFetchModule, 'useApiFetch');

        mockUseApiFetch.mockResolvedValue({data: {id: 1, tripId: 10, value: {}}});
        const store = useRouteStore();

        const firstCallGoingToRemote = await store.getByRouteId(1);
        expect(firstCallGoingToRemote).toEqual({});
        expect(spy).toBeCalledTimes(1);

        const secondCallGoingToLocalCache = await store.getByRouteId(1);
        expect(secondCallGoingToLocalCache).toEqual({});
        expect(spy).toBeCalledTimes(1);
    });

    it('getByRouteId fetches nothing if the trip is empty', async () => {
        const spy = vi.spyOn(apiFetchModule, 'useApiFetch');

        mockUseApiFetch.mockResolvedValue({data: {id: 1, tripId: 10}});
        const store = useRouteStore();

        const firstCallGoingToRemote = await store.getByRouteId(1);
        expect(firstCallGoingToRemote).toEqual(null);
        expect(spy).toBeCalledTimes(1);
    });

    it('getByTripId caches nothing if the trip has no routes', async () => {
        const spy = vi.spyOn(apiFetchModule, 'useApiFetch');

        mockUseApiFetch.mockResolvedValue({data: {id: 1, tripId: 10}});
        const store = useRouteStore();

        const routesForTripWithId = await store.getByTripId(1);
        expect(routesForTripWithId).toEqual(null);
        expect(spy).toBeCalledTimes(1);
    });

    it('getByTripId caches a trip with routes', async () => {
        const spy = vi.spyOn(apiFetchModule, 'useApiFetch');

        mockUseApiFetch.mockResolvedValue({
            data: {
                value: [{
                    id: 1, tripId: 10, segments: [
                        {
                            "id": 5,
                            "name": "a",
                            "description": null,
                            "coordinates": []
                        }
                    ]
                }]
            }
        });
        const store = useRouteStore();

        const firstCallForRoutesForTripWithId = await store.getByTripId(1);
        expect(firstCallForRoutesForTripWithId?.length).toEqual(1);
        expect(spy).toBeCalledTimes(1);

        const secondCallForRoutesForTripWithId = await store.getByTripId(1);
        expect(secondCallForRoutesForTripWithId?.length).toEqual(1);
        expect(spy).toBeCalledTimes(1);
    });

    it('getMapLibreRoutesForTrip fetches all routes for a trip that is not cached but returns null for a trip that does not has any routes', async () => {
        const spy = vi.spyOn(apiFetchModule, 'useApiFetch');

        mockUseApiFetch.mockResolvedValue({data: {id: 1, tripId: 10}});
        const store = useRouteStore();

        const routesForTripWithId = await store.getMapLibreRoutesForTrip(1);
        expect(routesForTripWithId).toEqual(null);
        expect(spy).toBeCalledTimes(1);
    });

    it('getMapLibreRoutesForTrip fetches all routes for a trip that is not cached and caches it', async () => {
        const spy = vi.spyOn(apiFetchModule, 'useApiFetch');

        vi.stubGlobal('$fetch', vi.fn().mockResolvedValue([]));

        mockUseApiFetch.mockResolvedValue({
            data: {
                value: [{
                    id: 1, tripId: 10, segments: [
                        {
                            "id": 5,
                            "name": "a",
                            "description": null,
                            "coordinates": []
                        }
                    ]
                }]
            }
        });
        const store = useRouteStore();

        const routesForTripWithIdFirstCall = await store.getMapLibreRoutesForTrip(1);
        expect(routesForTripWithIdFirstCall).not.toBeNull()
        expect(spy).toBeCalledTimes(1);

        const routesForTripWithIdSecondCall = await store.getMapLibreRoutesForTrip(1);
        expect(routesForTripWithIdSecondCall).not.toBeNull()
        expect(spy).toBeCalledTimes(1);
    });

    it('getMapLibreRoutesForTrip uses a caches routes for a trip that was not converted and cached in the MapLibre format', async () => {
        const spy = vi.spyOn(apiFetchModule, 'useApiFetch');

        vi.stubGlobal('$fetch', vi.fn().mockResolvedValue([]));

        mockUseApiFetch.mockResolvedValue({
            data: {
                value: {
                    id: 1, tripId: 10, segments: []
                }
            }
        });


        const store = useRouteStore();

        const tripId = 10;

        const firstCallGoingToRemote = await store.getByRouteId(1);
        expect(firstCallGoingToRemote).toEqual({id: 1, tripId, segments: []});
        expect(spy).toBeCalledTimes(1);

        const routesForTripWithIdFirstCall = await store.getMapLibreRoutesForTrip(tripId);
        expect(routesForTripWithIdFirstCall).not.toBeNull()
        expect(spy).toBeCalledTimes(1);
    });

    it('getMapLibreRoute returns null if a trip with the given tripId does not exist locally or in the backend', async () => {
        const spy = vi.spyOn(apiFetchModule, 'useApiFetch');

        mockUseApiFetch.mockResolvedValue({data: {value: null}});
        const store = useRouteStore();

        const routesForTripWithId = await store.getMapLibreRoute(1);
        expect(routesForTripWithId).toEqual(null);
        expect(spy).toBeCalledTimes(1);
    });

    it('getMapLibreRoute fetches from the backend the route, fetches it locally and returns it', async () => {
        const spy = vi.spyOn(apiFetchModule, 'useApiFetch');

        vi.stubGlobal('$fetch', vi.fn().mockResolvedValue([]));

        mockUseApiFetch.mockResolvedValue({
            data: {
                value: {
                    id: 1, tripId: 10, segments: []
                }
            }
        });
        const store = useRouteStore();

        const routesForTripWithIdFirstCall = await store.getMapLibreRoute(1);
        expect(routesForTripWithIdFirstCall?.id).toEqual(1);
        expect(spy).toBeCalledTimes(1);

        const routesForTripWithIdSecondCall = await store.getMapLibreRoute(1);
        expect(routesForTripWithIdSecondCall?.id).toEqual(1);
        expect(spy).toBeCalledTimes(1);
    });

});
