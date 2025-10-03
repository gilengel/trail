import {beforeEach, describe, expect, it} from "vitest";
import {type Column} from "../../grid"
import {SetElement} from "./setElement";
import type {EditorElementInstance} from "../../editorElementInstanceRegistry";
import {createMockElement} from "./__mocks__";
import {AddConnection} from "./addConnection";

describe("AddConnection", () => {
    let providingElement: EditorElementInstance<any>;
    let consumingElement: EditorElementInstance<any>;

    beforeEach(() => {
        providingElement = createMockElement("0");
        consumingElement = createMockElement("1");
    });

    it("should set a new element and store the old one on redo", async () => {
        const addConnectionAction = new AddConnection(providingElement, consumingElement, "test");
        await addConnectionAction.redo()

        expect(providingElement.connections.consumed["test"]).toBe("1")
        expect(consumingElement.connections.provided["test"]).toBe("0")
    });

    it("should reset the connection on undo", async () => {
        const addConnectionAction = new AddConnection(providingElement, consumingElement, "test");
        await addConnectionAction.redo()

        expect(providingElement.connections.consumed["test"]).toBe("1")
        expect(consumingElement.connections.provided["test"]).toBe("0")

        await addConnectionAction.undo()
        expect(providingElement.connections.consumed["test"]).toBeUndefined()
        expect(consumingElement.connections.provided["test"]).toBeUndefined()
    });
});
