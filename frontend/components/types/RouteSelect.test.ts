import {beforeEach, describe, expect, it} from 'vitest';
import RouteSelectTypeComponent from '@/components/types/RouteSelect.vue';
import {createGlobal} from "~/components/builder/elements/__mocks__";
import {createDefaultGrid} from "@trail/grid-editor/grid";
import {createVuetify} from "vuetify/framework";
import {mount} from "@vue/test-utils";

describe('GridEditor', () => {
    describe('Types', () => {
        describe('RouteSelect', () => {
            let global: ReturnType<typeof createGlobal>;

            beforeEach(() => {
                global = createGlobal(createDefaultGrid(0));

            });

            it('renders', () => {
                const component = mount(RouteSelectTypeComponent, {
                    global: {
                        ...global,
                        plugins: [createVuetify()]
                    },
                    props: {
                        config: {
                            type: 'custom',
                            label: 'text'
                        },
                        propertyKey: '',
                        modelValue: {
                            id: 0,
                            segmentIds: []
                        }
                    }
                });
                expect(component.exists()).toBeTruthy();
            });
        })
    });
});
