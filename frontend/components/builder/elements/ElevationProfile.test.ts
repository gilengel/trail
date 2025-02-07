import {describe, it, expect} from 'vitest'
import ElevationProfileComponent from '@/components/builder/elements/ElevationProfile.vue'
import {mountSuspended} from "@nuxt/test-utils/runtime";
import {MapLibreSegment} from "~/data/routes/types";

describe('Component', () => {
    describe('ElevationProfile', () => {
        it('renders', async () => {
            const segment = new MapLibreSegment(0, 'test_segment', [], 'white');
            const component = await mountSuspended(ElevationProfileComponent, {
                props: {
                    segment: segment
                }
            });
            expect(component.exists).toBeTruthy();
        })
    })
})
