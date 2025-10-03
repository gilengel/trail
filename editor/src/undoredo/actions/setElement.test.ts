import {beforeEach, describe, expect, it} from "vitest";
import {type Column} from "../../grid"
import {SetElement} from "./setElement";
import type {EditorElementInstance} from "../../editorElementInstanceRegistry";
import {createMockElement} from "./__mocks__";

describe("SetElement", () => {
    let mockColumn: Column;
    let mockElement: EditorElementInstance<any>;

    beforeEach(() => {
        mockColumn = {id: '0', width: 0, element: undefined as unknown as EditorElementInstance<any>};
        mockElement = createMockElement();
    });

    it("should set a new element and store the old one", async () => {
        const setElementAction = new SetElement(mockColumn, mockElement);

        expect(mockColumn.element).toBeUndefined();

        await setElementAction.redo();

        expect(mockColumn.element).toEqual(mockElement);
    });


    it("should undo and revert to the previous element", async () => {
        const setElementAction = new SetElement(mockColumn, mockElement);

        await setElementAction.redo();

        expect(mockColumn.element).toEqual(mockElement);

        await setElementAction.undo();

        expect(mockColumn.element).toBeUndefined();
    });

    it("should redo and restore the new element", async () => {
        const setElementAction = new SetElement(mockColumn, mockElement);

        await setElementAction.redo();

        await setElementAction.undo();

        expect(mockColumn.element).toBeUndefined();

        await setElementAction.redo();

        expect(mockColumn.element).toEqual(mockElement);
    });

    it("should cache the old element if one exists", async () => {
        const existingElement = createMockElement(); // Different element for testing
        mockColumn.element = existingElement;

        const newElement = createMockElement();
        const setElementAction = new SetElement(mockColumn, newElement);

        await setElementAction.redo();

        expect(mockColumn.element).toEqual(newElement);

        await setElementAction.undo();
        expect(mockColumn.element).toEqual(existingElement);

        await setElementAction.redo();
        expect(mockColumn.element).toEqual(newElement);
    });

    it("should handle undefined elements correctly", async () => {
        const setElementAction = new SetElement(mockColumn, mockElement);

        expect(mockColumn.element).toBeUndefined();

        await setElementAction.redo();
        expect(mockColumn.element).toEqual(mockElement);

        await setElementAction.undo();
        expect(mockColumn.element).toBeUndefined();

        await setElementAction.redo();
        expect(mockColumn.element).toEqual(mockElement);
    });

});
