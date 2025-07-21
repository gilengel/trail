import {describe, it, expect} from 'vitest';
import FeedItemComponent from '@/components/trip/FeedItem.vue';
import {MapLibreSegment} from "~/types/route";
import {shallowMount} from "@vue/test-utils";

describe('Component', () => {
    describe('FeedItemComponent', () => {
        it('renders', async () => {
            const mockSegment = new MapLibreSegment(0, '', [], '', '');
            const component = shallowMount(FeedItemComponent, {
                props: {
                    segment: mockSegment
                },

                global: {
                    stubs: {
                        TripImages: {
                            template: '<div>Trip Images</div>'
                        }
                    }
                }
            });

            expect(component.exists).toBeTruthy();
        });
    });
});
