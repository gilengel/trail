import {describe, it, expect, beforeEach, vi} from 'vitest';
import {EventManager} from './eventManager';
import {defineCallback} from "./eventRegistry";
import type {ElementInstanceId} from "../instances/instance";

const makeInstance = (id: string) => ({
    id,
    elementId: id + '-def',
    connections: {
        provided: {
            events: {
                listeners: {
                    onClick: []
                }
            }
        }
    }
});

describe('EventManager (Vitest)', () => {
    let definitionRegistry: any;
    let instanceRegistry: any;
    let eventManager: EventManager;

    beforeEach(() => {
        definitionRegistry = {
            get: vi.fn()
        };

        instanceRegistry = {
            getInstance: vi.fn()
        };

        eventManager = new EventManager(definitionRegistry, instanceRegistry);
    });

    it('subscribes a subscriber to an event', () => {
        const publisher = makeInstance('publisher');
        instanceRegistry.getInstance.mockReturnValue(publisher);

        const result = eventManager.subscribe('publisher', 'onClick', 'sub1');

        expect(result).toBe(true);
        expect(publisher.connections.provided.events.listeners.onClick).toEqual(['sub1']);
    });

    it('returns false if publisher does not exist', () => {
        instanceRegistry.getInstance.mockReturnValue(null);

        const result = eventManager.subscribe('missing', 'onClick', 'sub1');
        expect(result).toBe(false);
    });

    it('does not duplicate subscribers', () => {
        const publisher = makeInstance('publisher');
        publisher.connections.provided.events.listeners.onClick = ['sub1'];

        instanceRegistry.getInstance.mockReturnValue(publisher);

        eventManager.subscribe('publisher', 'onClick', 'sub1');

        expect(publisher.connections.provided.events.listeners.onClick).toEqual(['sub1']);
    });

    it('removes subscribers on unsubscribe', () => {
        const publisher = makeInstance('publisher');
        publisher.connections.provided.events.listeners.onClick = ['sub1', 'sub2'];

        instanceRegistry.getInstance.mockReturnValue(publisher);

        const result = eventManager.unsubscribe('publisher', 'onClick', 'sub1');

        expect(result).toBe(true);
        expect(publisher.connections.provided.events.listeners.onClick).toEqual(['sub2']);
    });

    it('returns false if publisher missing during unsubscribe', () => {
        instanceRegistry.getInstance.mockReturnValue(null);

        const result = eventManager.unsubscribe('x', 'onClick', 'sub1');
        expect(result).toBe(false);
    });

    it('emits and executes callback for subscribers', () => {
        const publisher = makeInstance('publisher');
        publisher.connections.provided.events.listeners.onClick = ['sub1'];

        const subscriber = makeInstance('sub1');

        const mockCallback = vi.fn();

        definitionRegistry.get.mockReturnValue({
            defaults: {
                connections: {
                    provided: {
                        events: {
                            'onClick': {
                                name: 'onClick',
                                label: 'executed on click',
                                description: 'executed on click',
                                payloadType: 'custom',
                                payloadSchema: {}
                            }
                        }
                    },
                    consumed: {
                        callbacks: {
                            'onClick': defineCallback(
                                {},
                                mockCallback,
                                {name: 'onClick', label: 'Segment hovered'}
                            )
                        }
                    }
                }
            }
        });

        instanceRegistry.getInstance.mockImplementation((id: ElementInstanceId) => {
            if (id === 'publisher') {
                return publisher;
            }
            if (id === 'sub1') {
                return subscriber;
            }
        });

        eventManager.emit('publisher', 'onClick', {data: 123});

        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(subscriber, {data: 123});
    });


    it('does nothing if event not defined in definition', () => {
        const publisher = makeInstance('publisher');
        instanceRegistry.getInstance.mockReturnValue(publisher);

        definitionRegistry.get.mockReturnValue({
            defaults: {
                connections: {
                    provided: {events: {}}
                }
            }
        });

        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        });

        eventManager.emit('publisher', 'onClick', {});
        expect(warnSpy).toHaveBeenCalledOnce();

        warnSpy.mockRestore();
    });

    it('returns subscribers as instances', () => {
        const publisher = makeInstance('publisher');
        publisher.connections.provided.events.listeners.onClick = ['sub1', 'sub2'];

        const sub1 = makeInstance('sub1');
        const sub2 = makeInstance('sub2');

        instanceRegistry.getInstance.mockImplementation((id: ElementInstanceId) => {
                if (id === 'publisher') {
                    return publisher;
                }

                if (id === 'sub1') {
                    return sub1;
                }

                if (id === 'sub2') {
                    return sub2;
                }
            }
        );

        const subs = eventManager.getSubscribers('publisher', 'onClick');
        expect(subs).toEqual([sub1, sub2]);
    });

    it('returns empty array if publisher missing', () => {
        instanceRegistry.getInstance.mockReturnValue(null);

        expect(eventManager.getSubscribers('x', 'event')).toEqual([]);
    });
});
