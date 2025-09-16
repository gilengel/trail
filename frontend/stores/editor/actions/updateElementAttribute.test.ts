import {expect, describe, it, beforeEach} from 'vitest';

import {Element} from "~/components/GridEditor/grid"
import {UpdateElementAttribute} from "./updateElementAttribute";

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
