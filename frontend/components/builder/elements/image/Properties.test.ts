import {mount} from '@vue/test-utils';
import {describe, expect, it, beforeEach} from 'vitest';
import Properties from "./Properties.vue";
import {createVuetify} from "vuetify";
import {createGlobal} from "~/components/builder/elements/__mocks__";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import type {EditorElementProperties} from "@trail/grid-editor/grid";
import {createMockElement} from "~/components/builder/elements/image/__mocks__";

describe('ImagePropertiesComponent', () => {
    let global: ReturnType<typeof createGlobal>;
    let props: EditorElementProperties<any>;

    beforeEach(() => {
        global = createGlobal();

        props = {
            element: createMockElement(),
            grid: global.provide[EditorInjectionKey].grid
        };
    });

    it('changes aspect ratio when a new one is clicked', async () => {
        const component = mount(Properties, {
            global: {
                ...global,
                plugins: [createVuetify()],
            },
            props
        });

        expect(component.find('[data-testid="ratio-0"]').exists()).toBeTruthy();

        /*
        const aspectRatioButton = wrapper.findComponent('[data-testid="ratio-0"]');
        expect(aspectRatioButton.exists()).toBeTruthy();
        await aspectRatioButton.trigger('click');


        TODO mock editor
        expect(store.updateElementAttribute).toHaveBeenCalledWith(
            mockElement,
            'aspectRatio',
            expect.any(Number)
        );
        */
    });
});
