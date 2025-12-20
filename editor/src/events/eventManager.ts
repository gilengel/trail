import {
    type EditorElementDefinition,
    type ElementProperties,
    extractCallbackFunctions
} from "../definition/elementDefinition";
import type {EditorElementInstance} from "../instances/instance";
import type {IEventManager} from "./ieventManager";
import type {IInstanceRegistry} from "../instances/iinstanceRegistry";
import type {IDefinitionRegistry} from "../definition/idefinitionRegistry";


export type EventPayload<Definition extends EditorElementDefinition> =
    | ElementProperties<Definition>
    | Partial<ElementProperties<Definition>>
    | Record<string, any>


export class EventManager implements IEventManager {
    constructor(private readonly _definitionRegistry: IDefinitionRegistry, private readonly _instanceRegistry: IInstanceRegistry) {
    }

    // Subscribe an element to another element's event
    subscribe(
        publisherId: string,
        eventName: string,
        subscriberId: string,
    ): boolean {
        const publisher = this._instanceRegistry.getInstance(publisherId)
        if (!publisher) return false

        const eventListeners = publisher.connections.provided.events.listeners;
        if (!eventListeners[eventName]) {
            eventListeners[eventName] = []
        }

        if (!eventListeners[eventName].includes(subscriberId)) {
            eventListeners[eventName].push(subscriberId)
        }

        return true
    }

    // Unsubscribe from an event
    unsubscribe(
        publisherId: string,
        eventName: string,
        subscriberId: string,
    ): boolean {
        const publisher = this._instanceRegistry.getInstance(publisherId)
        if (!publisher) return false

        const listeners = publisher.connections.provided.events.listeners;
        if (listeners[eventName]) {
            listeners[eventName] = listeners[eventName]
                .filter(id => id !== subscriberId)
        }

        return true
    }

    // Emit an event
    emit<T extends EditorElementDefinition>(
        publisherId: string,
        eventName: string,
        payload: EventPayload<T>,
    ): void {
        const publisher = this._instanceRegistry.getInstance(publisherId)
        if (!publisher) return

        const definition = this._definitionRegistry.get(publisher.elementId)
        if (!definition?.defaults.connections.provided.events?.[eventName]) {
            console.warn(`Event '${eventName}' not defined for element '${publisher.elementId}'`)
            return
        }

        const subscribers = publisher.connections.provided.events.listeners[eventName] || []

        for (const subscriberId of subscribers) {
            const subscriber = this._instanceRegistry.getInstance(subscriberId)
            if (!subscriber) {
                continue;
            }

            this.handleEvent(subscriber, eventName, payload)
        }
    }

    // Handle event in subscriber
    private handleEvent(
        subscriber: EditorElementInstance,
        eventName: string,
        payload: any
    ): void {
        this.executeCallback(subscriber, eventName, payload);
    }


    // Get all subscribers for an event
    getSubscribers(
        publisherId: string,
        eventName: string,
    ): EditorElementInstance[] {
        const publisher = this._instanceRegistry.getInstance(publisherId)
        if (!publisher) return []

        const subscriberIds = publisher.connections.provided.events.listeners[eventName] || []
        return subscriberIds
            .map(id => this._instanceRegistry.getInstance(id))
            .filter(Boolean) as EditorElementInstance[]
    }

    getCallbacks(
        instance: EditorElementInstance
    ): Record<string, (...args: any[]) => void> {
        const definition = this._definitionRegistry.get(instance.elementId)
        if (!definition) return {}

        return extractCallbackFunctions(definition.defaults.connections.consumed.callbacks)
    }

    executeCallback(
        subscriber: EditorElementInstance,
        eventName: string,
        ...args: any[]
    ): void {
        const callbacks = this.getCallbacks(subscriber)
        const callback = callbacks[eventName]

        if (callback) {
            callback(subscriber, ...args)
        }
    }
}