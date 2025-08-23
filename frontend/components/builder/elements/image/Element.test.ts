import {describe, it, expect} from 'vitest';
import ImageComponent from '~/components/builder/elements/image/Element.vue';
import {mountSuspended} from "@nuxt/test-utils/runtime";
import {Element, ElementType} from "~/types/grid";
import {ImagePosition, type ImageProperties, ImageSize} from "~/components/builder/elements/image/Properties";

const attributes: ImageProperties = {
    aspectRatio: 1,
    scale: {origin: {x: 1, y: 1}, value: 1},
    sizeType: ImageSize.Free,
    position: {x: 0, y: 0},
    positionType: ImagePosition.Centered
};

describe('Component', () => {
    describe('Image', () => {
        const props = {
            element: new Element<ImageProperties, [], []>('0', ElementType.Image, attributes, [], [], {}, {}),
            selected: true,
            highlighted: false,
            grid: {tripId: 0, rows: []}
        };

        it('renders', async () => {
            const component = await mountSuspended(ImageComponent, {props});

            expect(component.find('[data-testid="element-img"]').exists()).toBeTruthy();
        });
    });
});

//{ element: { id: string; type: ElementType; attributes: { aspectRatio: number; scale: { origin: { x: number; y: number; }; value: number; }; sizeType: ImageSize; position: { x: number; y: number; }; positionType: ImagePosition; }; }; selected: boolean; highlighted: boolean; grid: { ...; }; }
//{ readonly element: Element<ImageProperties, [], []>; readonly selected: boolean; readonly highlighted: boolean; readonly grid: Grid; }'.
