import {beforeEach, describe, expect, it} from 'vitest';
import {Element} from "~/types/grid";
import {HighlightHandler} from "~/types/editor/editor.highlight";


describe('EditorHighlight', () => {
    const mockElement = new Element<object, [], []>('0', "heading" as never, {}, [], [], {}, {});
    let highlightHandler: HighlightHandler;

    beforeEach(() => {
        highlightHandler = new HighlightHandler();
    })

    it('adds an element', async () => {
        expect(highlightHandler.get().size).toBe(0);
        highlightHandler.add(mockElement);
        expect(highlightHandler.get().size).toBe(1);
    });

    it('removes an element', async () => {
        highlightHandler.add(mockElement);
        expect(highlightHandler.get().size).toBe(1);
        highlightHandler.remove(mockElement);
        expect(highlightHandler.get().size).toBe(0);
    });

    it('removes all elements', async () => {
        expect(highlightHandler.get().size).toBe(0);
        highlightHandler.add(mockElement);
        expect(highlightHandler.get().size).toBe(1);
        highlightHandler.clear();
        expect(highlightHandler.get().size).toBe(0);
    });

    it('returns that an element is highlighted', async () => {
        expect(highlightHandler.get().size).toBe(0);
        highlightHandler.add(mockElement);
        expect(highlightHandler.get().size).toBe(1);
        expect(highlightHandler.isHighlighted(mockElement)).toBeTruthy();
    });

    it('returns that an element not highlighted', async () => {
        expect(highlightHandler.get().size).toBe(0);
        expect(highlightHandler.isHighlighted(mockElement)).toBeFalsy();
    });
});
