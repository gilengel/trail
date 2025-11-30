import {expect, describe, it, beforeEach} from 'vitest';

import {UpdateElementAttribute} from "./updateElementAttribute";
import type {EditorElementInstance} from "../../instances/instanceRegistry";
import {createMockElement} from "./__mocks__";

describe('updateElementAttribute', () => {
    let mockElement: EditorElementInstance<any>;

    beforeEach(() => {
        mockElement = createMockElement();
    })

    it('should update the attribute on redo', async () => {

        const updateElementAttribute = new UpdateElementAttribute(mockElement, "level", 1);
        await updateElementAttribute.redo();

        expect(mockElement.properties.level).toBe(1);
    });

    it('should set the attribute to the old value on undo', async () => {

        const updateElementAttribute = new UpdateElementAttribute(mockElement, "level", 1);
        await updateElementAttribute.redo();

        expect(mockElement.properties.level).toBe(1);

        await updateElementAttribute.undo()
        expect(mockElement.properties.level).toBe(0);
    });
});
