import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import TextComponent from '~/components/builder/elements/text/Element.vue';
import {mountSuspended} from "@nuxt/test-utils/runtime";
import {ElementType} from "~/types/grid";

describe('Component', () => {
    describe('Text', () => {
        beforeEach(() => {
            const target = document.createElement('div');
            target.setAttribute('id', 'editor-primary-toolbar');
            document.body.appendChild(target);
        });

        afterEach(() => {
            const target = document.getElementById('teleport-target');
            if (target) target.remove();
        });

        const props = {
            element: {
                id: '0',
                type: ElementType.Image,
                attributes: {
                    text: 'Text'

                }
            }, selected: true
        };

        it('renders', async () => {
            const component = await mountSuspended(TextComponent, { props });
            expect(component.text()).toContain('Text');
        });
    });
});
