import {describe, it, expect} from 'vitest';
import {mountSuspended} from "@nuxt/test-utils/runtime";
import DraggableContainer from "~/components/builder/elements/image/DraggableContainer.vue";
import {ImagePosition, ImageSize} from "~/components/builder/elements/image/Properties";

describe('Component', () => {
    describe('DraggableContainer', () => {
        it('renders', async () => {
            const component = await mountSuspended(DraggableContainer, {
                props: {
                    enabled: true,
                    sizeType: ImageSize.Free,
                    source: "https://picsum.photos/200/300",

                    aspectRatio: 1,
                    scale: {origin: {x: 0, y: 0}, value: 1},
                    position: {x: 0, y: 0},
                    positionType: ImagePosition.Free
                }
            });


            const container = component.find('[data-testid="draggable-container"]');
            expect(container.exists).toBeTruthy();
        });

        it('emits onImageScaleChange if zoomed in via mouse wheel', async () => {
            const component = await mountSuspended(DraggableContainer, {
                props: {
                    enabled: true,
                    sizeType: ImageSize.Free,
                    source: "https://picsum.photos/200/300",

                    aspectRatio: 1,
                    scale: {origin: {x: 0, y: 0}, value: 1},
                    position: {x: 0, y: 0},
                    positionType: ImagePosition.Free
                }
            });

            const container = component.find('[data-testid="draggable-container"]');

            await container.trigger('wheel', {deltaY: 123});
            expect(component.emitted('onImageScaleChange')).toBeTruthy();
        });
    });
});
