import {beforeEach, describe, expect, it} from 'vitest';
import {createMockElement} from "~/stores/editor/actions/__mocks__";
import {HighlightHandler} from "~/components/GridEditor/editorHighlight";


describe('EditorHighlight', () => {
    const mockElement = createMockElement()
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
