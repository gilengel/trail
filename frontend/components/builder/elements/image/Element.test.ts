import {describe, it, expect} from 'vitest'
import ImageComponent from '~/components/builder/elements/image/Element.vue'
import {mountSuspended} from "@nuxt/test-utils/runtime";
import {ElementType} from "~/types/grid";
import {ImagePosition, ImageSize} from "~/components/builder/elements/image/Props";

describe('Component', () => {
    describe('Image', () => {
        const props = {
            element: {
                id: '0',
                type: ElementType.Image,
                attributes: {
                    aspectRatio: 1,
                    scale: { origin: { x: 1, y: 1}, value: 1 },
                    sizeType: ImageSize.Free,
                    position: { x: 0, y: 0 },
                    positionType: ImagePosition.Centered

                }
            }, selected: true
        };

        it('renders', async () => {
            const component = await mountSuspended(ImageComponent, { props })

            expect(component.find('[data-testid="element-img"]').exists()).toBeTruthy();
        })
    })
})
