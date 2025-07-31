import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import TextComponent from '~/components/builder/elements/text/Element.vue';
import {mountSuspended} from "@nuxt/test-utils/runtime";
import {Element, ElementType} from "~/types/grid";
import type {TextProperties} from "~/components/builder/elements/text/Properties";

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
            element: new Element<TextProperties, [], []>('0', ElementType.Text, {text: 'Text'}, [], [], {}, {}),
            selected: true,
            highlighted: false,
            grid: {tripId: 0, rows: []}
        };

        it('renders', async () => {
            const component = await mountSuspended(TextComponent, {props});
            expect(component.text()).toContain('Text');
        });
    });
});
