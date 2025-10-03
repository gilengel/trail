import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import HeadingComponent from '~/components/builder/elements/heading/Element.vue';
import {createMockElement} from "~/components/builder/elements/heading/__mocks__";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import {mount} from "@vue/test-utils";
import {createGlobal} from "~/components/builder/elements/__mocks__";
import type {EditorElementProperties} from "@trail/grid-editor/grid";
import {createVuetify} from "vuetify";

describe('Component', () => {
    describe('Heading', () => {
        let global: ReturnType<typeof createGlobal>;
        let defaultProps: EditorElementProperties<any>;

        vi.mock('~/components/Editor.vue', () => ({
            default: {
                name: 'Editor',
                template: '<div class="mock-editor"><h2>{{ content }}</h2></div>',
                props: ['content', 'formatting', 'text', 'undoredo', 'customNode'],
                emits: ['on-text-changed'],
                setup() {
                    return {
                        setColor: vi.fn(),
                        getChain: vi.fn(() => ({
                            focus: vi.fn().mockReturnThis(),
                            setNodeSelection: vi.fn().mockReturnThis(),
                            updateAttributes: vi.fn().mockReturnThis(),
                            run: vi.fn()
                        }))
                    }
                }
            }
        }))

        beforeEach(() => {
            global = createGlobal();

            defaultProps = {
                element: createMockElement(),
                grid: global.provide[EditorInjectionKey].grid
            };

            const target = document.createElement('div');
            target.setAttribute('id', 'editor-primary-toolbar');
            document.body.appendChild(target);
        });

        afterEach(() => {
            const target = document.getElementById('teleport-target');
            if (target) target.remove();
        });


        it('renders', async () => {
            const component = mount(HeadingComponent, {
                global: {
                    plugins: [createVuetify()],
                    ...global
                },
                props: defaultProps
            })

            console.log(component.html())
            expect(component.text()).toContain('Heading');
        });

        it('renders h2 based on prop', async () => {
            const customProps: EditorElementProperties<any> = {
                ...defaultProps,
                element: {
                    ...defaultProps.element,
                    properties: {
                        ...defaultProps.element.properties,
                        level: 1,
                    }
                }
            };

            const component = mount(HeadingComponent, {
                global: {
                    plugins: [createVuetify()],
                    ...global
                },
                props: customProps
            });
            expect(component.element.querySelectorAll('h2').length).toBe(1);
        });

        it('renders it red based on prop', async () => {
            const customProps: EditorElementProperties<any> = {
                ...defaultProps,
                element: {
                    ...defaultProps.element,
                    properties: {
                        ...defaultProps.element.properties,
                        color: "#F00",
                    }
                }
            };

            const component = mount(HeadingComponent, {
                global: {
                    plugins: [createVuetify()],
                    ...global
                },
                props: customProps
            });

            expect(component.vm.style).toBe("color: #F00; text-align: left");
        });
    });
});
