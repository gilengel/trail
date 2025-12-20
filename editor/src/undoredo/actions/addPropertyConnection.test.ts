import {beforeEach, describe, expect, it} from "vitest";
import type {EditorElementInstance} from "../../instances/instance";
import {createMockElement} from "./__mocks__";
import {AddPropertyConnection} from "./addPropertyConnection";

describe("AddConnection", () => {
    let providingElement: EditorElementInstance<any>;
    let consumingElement: EditorElementInstance<any>;

    beforeEach(() => {
        providingElement = createMockElement("0");
        consumingElement = createMockElement("1");
    });

    it("should set a new element and store the old one on redo", async () => {
        const addConnectionAction = new AddPropertyConnection(providingElement, consumingElement, "test");
        await addConnectionAction.redo()

        expect(providingElement.connections.consumed.properties["test"]).toBe("1")
        expect(consumingElement.connections.provided.properties["test"]).toBe("0")
    });

    it("should reset the connection on undo", async () => {
        const addConnectionAction = new AddPropertyConnection(providingElement, consumingElement, "test");
        await addConnectionAction.redo()

        expect(providingElement.connections.consumed.properties["test"]).toBe("1")
        expect(consumingElement.connections.provided.properties["test"]).toBe("0")

        await addConnectionAction.undo()
        expect(providingElement.connections.consumed.properties["test"]).toBeUndefined()
        expect(consumingElement.connections.provided.properties["test"]).toBeUndefined()
    });
});
