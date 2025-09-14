import {beforeEach, vi} from 'vitest';
import {mockFetch} from './fetchMock';
import 'vuetify/styles';

beforeEach(() => {
    vi.restoreAllMocks();
    mockFetch();
});

