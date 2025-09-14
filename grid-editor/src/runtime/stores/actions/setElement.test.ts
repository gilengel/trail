import {beforeEach, describe, expect, it} from "vitest";
import {type Column, Element} from "../../types/grid";
import {SetElement} from "../../stores/actions/setElement";

// Mocks for Column and Element types


describe("SetElement", () => {
  let mockColumn: Column;
  let mockElement: Element<object, [], []>;

  beforeEach(() => {
    mockColumn = {id: '0', width: 0, element: undefined};
    mockElement = new Element<object, [], []>('0', "heading" as never, {}, [], [], {}, {});
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
    const existingElement = new Element<object, [], []>('0', "text" as never, {}, [], [], [], []); // Different element for testing
    mockColumn.element = existingElement;

    const newElement = new Element<object, [], []>('0', "text" as never, {}, [], [], [], []);
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
