import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import HeadingComponent from '~/components/builder/elements/heading/Element.vue';
import {mountSuspended} from "@nuxt/test-utils/runtime";
import {Element, ElementType} from "~/types/grid";
import type {HeadingProperties} from "~/components/builder/elements/heading/Properties";

describe('Component', () => {
    describe('Heading', () => {
        beforeEach(() => {
            const target = document.createElement('div');
            target.setAttribute('id', 'editor-primary-toolbar');
            document.body.appendChild(target);
        });

        afterEach(() => {
            const target = document.getElementById('teleport-target');
            if (target) target.remove();
        });


        const defaultElement = new Element<HeadingProperties, [], []>(
            '0',
            ElementType.Heading,
            {level: 0, color: '#F00', text: 'Heading', alignment: 'left'}, [], [], {}, {});
        const defaultProps = {
            element: defaultElement,
            selected: true,
            highlighted: false,
            grid: {tripId: 0, rows: []}
        };

        it('renders', async () => {
            const component = await mountSuspended(HeadingComponent, {
                props: defaultProps
            });
            expect(component.text()).toContain('Heading');
        });

        it('renders h2 based on prop', async () => {
            const customProps = {
                ...defaultProps,
                element: {
                    ...defaultProps.element,
                    attributes: {
                        ...defaultProps.element.attributes,
                        level: 1,
                    }
                }
            };

            const component = await mountSuspended(HeadingComponent, {
                props: customProps
            });
            expect(component.element.querySelectorAll('h2').length).toBe(1);
        });

        it('renders it red based on prop', async () => {
            const component = await mountSuspended(HeadingComponent, {
                props: defaultProps
            });

            expect(component.vm.style).toBe("color: #F00; text-align: left");
        });
    });
});
