import {describe, it, expect, vi, beforeEach, type MockInstance} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';
import * as apiFetchModule from '~/composables/apiFetch';

const mockUseApiFetch = vi.fn();

// 👇 Mock the module where useApiFetch is defined
vi.mock('~/composables/apiFetch', () => ({
    useApiFetch: async (request: unknown, opts?: unknown) => mockUseApiFetch(request, opts),
}));

describe('useRouteStore (no internal state access)', () => {
    let spy: MockInstance;

    beforeEach(() => {
        setActivePinia(createPinia());

        spy = vi.spyOn(apiFetchModule, 'useApiFetch');
    });

    const expectedValue = {
        id: 0, name: 'trip', layout: {
            tripId: 0
        }
    };
    it('get fetches a trip from the backend via api', async () => {
        const store = useTripStore();
        mockUseApiFetch.mockResolvedValue({data: {value: {id: 0, name: 'trip', layout: {}}}});

        const firstCallGoingToRemote = await store.get(0);
        expect(firstCallGoingToRemote).toEqual(expectedValue);
        expect(spy).toBeCalledTimes(1);

    });

    it('get fetches nothing if the trip is empty', async () => {
        const store = useTripStore();
        mockUseApiFetch.mockResolvedValue({data: {value: null}});

        const firstCallGoingToRemote = await store.get(0);
        expect(firstCallGoingToRemote).toEqual(null);
        expect(spy).toBeCalledTimes(1);
    });


    it('get fetches a trip from the backend via api and caches it implicitly', async () => {
        const store = useTripStore();
        mockUseApiFetch.mockResolvedValue({data: {value: {id: 0, name: 'trip', layout: {}}}});

        const firstCallGoingToRemote = await store.get(0);
        expect(firstCallGoingToRemote).toEqual(expectedValue);
        expect(spy).toBeCalledTimes(1);

        const secondCallGoingToLocalCache = await store.get(0);
        expect(secondCallGoingToLocalCache).toEqual(expectedValue);
        expect(spy).toBeCalledTimes(1);
    });

    it('get gets all cached trips', async () => {
        const store = useTripStore();

        const cachedTrips = await store.all(false);
        expect(cachedTrips.keys().next().done).toBeTruthy();
        expect(spy).toBeCalledTimes(0);
    });
});
