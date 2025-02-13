// tests/setup/fetchMock.ts
import {vi} from 'vitest';

/**
 * Mocks all fetch codes.
 */
export function mockFetch() {
    vi.stubGlobal(
        '$fetch',
        Object.assign(
            vi.fn((url: string) => {
                if (url === '/api/user') {
                    return Promise.resolve({id: 1, name: 'John Doe'});
                }
                return Promise.resolve({data: 'default response'});
            }),
            {
                raw: vi.fn(() => Promise.resolve('raw response')),
                create: vi.fn(() => $fetch),
            }
        )
    );
}
