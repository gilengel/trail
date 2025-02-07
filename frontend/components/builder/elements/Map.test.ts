import {describe, it, expect} from 'vitest'
import MapComponent from '@/components/builder/elements/Map.vue'
import {mountSuspended} from "@nuxt/test-utils/runtime";

describe('Component', () => {
    describe('Text', () => {
        it('renders', async () => {
            const component = await mountSuspended(MapComponent, {
                global: {
                    stubs: {
                        TMap: {
                            template: '<div>Mocked Map</div>'
                        }
                    }
                }
            });
            expect(component.exists).toBeTruthy();
        })
    })
})
