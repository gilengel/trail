import {beforeEach, describe, expect, it} from "vitest";
import type {EditorElementInstance} from "../../instances/instance";
import {createMockElement} from "./__mocks__";
import {RemoveConnection} from "./removeConnection";

describe("RemoveConnection", () => {
    let providingElement: EditorElementInstance<any>;
    let consumingElement: EditorElementInstance<any>;

    let removeConnection: RemoveConnection;

    beforeEach(() => {
        providingElement = createMockElement("0");
        consumingElement = createMockElement("1");

        providingElement.connections.consumed.properties["test"] = "1";
        consumingElement.connections.provided.properties["test"] = "0";

        removeConnection = new RemoveConnection(providingElement, consumingElement, "test");
    });

    it("should set a new element and store the old one on redo", async () => {
        expect(providingElement.connections.consumed.properties["test"]).toBe("1")
        expect(consumingElement.connections.provided.properties["test"]).toBe("0")

        await removeConnection.redo();

        expect(providingElement.connections.consumed.properties["test"]).toBeUndefined()
        expect(consumingElement.connections.provided.properties["test"]).toBeUndefined()
    });

    it("should reset the connection on undo", async () => {
        await removeConnection.redo();

        expect(providingElement.connections.consumed.properties["test"]).toBeUndefined()
        expect(consumingElement.connections.provided.properties["test"]).toBeUndefined()

        await removeConnection.undo();

        expect(providingElement.connections.consumed.properties["test"]).toBe("1")
        expect(consumingElement.connections.provided.properties["test"]).toBe("0")
    });
});
