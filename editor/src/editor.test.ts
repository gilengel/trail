import {beforeEach, describe, expect, it, vi} from "vitest";
import {BuilderMode, Editor} from "./editor";
import {createTestGrid} from "./undoredo/actions/test.helper";
import type {IUndoRedoAction} from "./undoredo";
import type {EditorElementInstance} from "./editorElementInstanceRegistry";
import {LogLevel} from "./handler/logger";
import {EditorElementDefinition} from "./configuration/elementDefinition";

describe("Editor", () => {
    const now = new Date();

    const mockElement: EditorElementInstance<EditorElementDefinition<{}, [], []>> = {
        instanceId: "test-id",
        elementId: "",
        properties: {},
        defaults: {
            properties: {},
            providedProperties: [],
            consumedProperties: []
        },
        connections: {
            consumed: {},
            provided: {}
        },
        selected: false,
        created: now,
        modified: now
    };

    const mockPersist = vi.fn().mockResolvedValue(undefined);
    let editor: Editor;


    beforeEach(() => {
        editor = new Editor(createTestGrid(1, 2), mockPersist);
    })

    it('returns "undefined" if an element was not found"', () => {
        expect(editor.findElementWithId("test-id")).toBe(undefined);
    })

    it("returns the element within the grid with the given id", () => {
        editor.grid.rows[0]!.columns[0]!.element = mockElement;
        expect(editor.findElementWithId("test-id")).toStrictEqual(mockElement);
    })

    it("highlights the newly selected element", () => {
        expect(editor.selectedElement.value).toBeUndefined();
        editor.selectElement(mockElement);
        expect(editor.selectedElement.value).toStrictEqual(mockElement);
    })

    it("clears highlight of selected elements", () => {
        editor.selectElement(mockElement);
        expect(editor.getIdsOfAllHighlightedElements()).toStrictEqual(new Set(["test-id"]));
        editor.clearSelectedElements();
        expect(editor.getIdsOfAllHighlightedElements()).toStrictEqual(new Set());
    })

    it("switches the mode", () => {
        expect(editor.activeMode).toStrictEqual(BuilderMode.Create)
        editor.switchMode(BuilderMode.ConnectProperty, {property: ""});
        expect(editor.activeMode).toStrictEqual(BuilderMode.ConnectProperty);
    })

    it("executes an action", async () => {
        const mockAction = {
            undo: vi.fn().mockResolvedValue(undefined),
            redo: vi.fn().mockResolvedValue(undefined)
        } as unknown as IUndoRedoAction;


        const executeSpy = vi.spyOn(editor['_undoRedoHandler'], 'execute');

        await editor.executeAction(mockAction);

        expect(executeSpy).toHaveBeenCalledWith(mockAction);
        expect(executeSpy).toHaveBeenCalledTimes(1);
    })

    it("logs a message", async () => {

        const executeSpy = vi.spyOn(editor['_loggingHandler'], 'push');

        editor.log("test log", LogLevel.Warning)

        expect(executeSpy).toHaveBeenCalledWith("test log", LogLevel.Warning);
    })
})