import type {EditorElementDefinition} from "../definition/elementDefinition";
import type {EventPayload} from "./eventManager";
import type {EditorElementInstance} from "../instances/instance";

export interface IEventManager {
    subscribe(
        publisherId: string,
        eventName: string,
        subscriberId: string,
    ): boolean

    unsubscribe(
        publisherId: string,
        eventName: string,
        subscriberId: string,
    ): boolean

    emit<Definition extends EditorElementDefinition>(
        publisherId: string,
        eventName: string,
        payload: EventPayload<Definition>,
    ): void

    getSubscribers(
        publisherId: string,
        eventName: string,
    ): EditorElementInstance[]

    getCallbacks(instance: EditorElementInstance): Record<string, (...args: any[]) => void>

    executeCallback(
        subscriber: EditorElementInstance,
        eventName: string,
        ...args: any[]
    ): void
}