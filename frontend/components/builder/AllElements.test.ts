import {describe, it, expect} from "vitest";
import {createElement} from "~/components/builder/AllElements";
import {ElementType} from "~/types/grid";

describe('Free Function', () => {

    it('creates a new element with default values', async () => {
        const element = createElement(ElementType.Text);
        expect(element.attributes).deep.eq({text: 'Hello World'});
    });

});
