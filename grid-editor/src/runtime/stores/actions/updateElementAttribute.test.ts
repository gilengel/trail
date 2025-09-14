import {UpdateColumnWidth} from './updateColumnWidth';
import {expect, describe, it, beforeEach} from 'vitest';
import {UpdateElementAttribute} from "../../stores/actions/updateElementAttribute";
import {type Column, Element} from "../../types/grid";

describe('updateElementAttribute', () => {
  let mockElement: Element<{ level: number }, [], []>;

  beforeEach(() => {
    mockElement = new Element<{ level: number }, [], []>('0', "heading" as never, {level: 0}, [], [], {}, {});
  });

  it('should update the attribute on redo', async () => {

    const updateElementAttribute = new UpdateElementAttribute(mockElement, "level", 1);
    await updateElementAttribute.redo();

    expect(mockElement.attributes.level).toBe(1);
  });

  it('should set the attribute to the old value on undo', async () => {

    const updateElementAttribute = new UpdateElementAttribute(mockElement, "level", 1);
    await updateElementAttribute.redo();

    expect(mockElement.attributes.level).toBe(1);

    await updateElementAttribute.undo()
    expect(mockElement.attributes.level).toBe(0);
  });
});
