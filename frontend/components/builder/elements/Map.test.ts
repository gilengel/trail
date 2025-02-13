import {describe, it, expect} from 'vitest'
import MapComponent from '@/components/builder/elements/Map.vue'
import {shallowMount} from "@vue/test-utils";

describe('Component', () => {
    describe('Map', () => {
        it('renders', async () => {
            const component = shallowMount(MapComponent, {
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
