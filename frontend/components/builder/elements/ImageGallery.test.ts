import {describe, it, expect} from 'vitest'
import ImageGalleryComponent from '@/components/builder/elements/ImageGallery.vue'
import {mountSuspended} from "@nuxt/test-utils/runtime";
import type {ImageDto} from "~/types/image.dto";

describe('Component', () => {
    describe('ImageGallery', () => {
        it('renders', async () => {
            const images: ImageDto[] = [];
            const component = await mountSuspended(ImageGalleryComponent, {
                props: {
                    images: images,
                    cols: 1
                },

                global: {
                    stubs: {
                        MasonryWall: {
                            template: '<div>Mocked Map</div>'
                        }
                    }
                }
            });
            expect(component.exists).toBeTruthy();
        })
    })
})
