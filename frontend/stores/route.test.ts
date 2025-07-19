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

    it('getByTripId fetches nothing if the trip has no routes', async () => {
        const spy = vi.spyOn(apiFetchModule, 'useApiFetch');

        mockUseApiFetch.mockResolvedValue({data: {id: 1, tripId: 10}});
        const store = useRouteStore();

        const routesForTripWithId = await store.getByTripId(1);
        expect(routesForTripWithId).toEqual(null);
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
});
