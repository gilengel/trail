import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest'
import {EditorElementInstanceRegistry} from "~/components/GridEditor/editorElementInstanceRegistry";
import type {EditorElementDefinition} from "~/components/GridEditor/editorConfiguration";


describe('EditorElementInstanceRegistry', () => {
    let registry: EditorElementInstanceRegistry
    let mockDefinition: EditorElementDefinition<any, any, any>
    let mockDate: Date

    beforeEach(() => {
        registry = new EditorElementInstanceRegistry()

        // Mock Date to have predictable timestamps
        mockDate = new Date('2023-01-01T00:00:00.000Z')
        vi.useFakeTimers()
        vi.setSystemTime(mockDate)

        // Create a mock definition
        mockDefinition = {
            id: 'test-element',
            name: 'Test Element',
            category: 'test',
            components: {
                element: {} as any,
                properties: {} as any,
            },
            defaults: {
                properties: {
                    content: 'default content',
                    fontSize: 16,
                    color: '#000000'
                },
                providedProperties: ['content'] as const,
                consumedProperties: [] as const,
            },
            metadata: {
                description: 'Test element',
                tags: ['test'],
            }
        }
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    describe('createInstance', () => {
        it('creates a new instance with default properties', () => {
            const instance = registry.createInstance(mockDefinition)

            expect(instance).not.toBeNull()
            expect(instance!.elementId).toBe('test-element')
            expect(instance!.properties).toEqual({
                content: 'default content',
                fontSize: 16,
                color: '#000000'
            })
            expect(instance!.defaults).toBe(mockDefinition.defaults)
            expect(instance!.connections).toEqual({
                consumed: {},
                provided: {}
            })
            expect(instance!.selected).toBe(false)
            expect(instance!.highlighted).toBe(false)
            expect(instance!.created).toEqual(mockDate)
            expect(instance!.modified).toEqual(mockDate)
        })

        it('creates instance with overridden properties', () => {
            const config = {
                properties: {
                    content: 'custom content',
                    fontSize: 24
                }
            }

            const instance = registry.createInstance(mockDefinition, config)

            expect(instance!.properties).toEqual({
                content: 'custom content',
                fontSize: 24,
                color: '#000000' // default value preserved
            })
        })

        it('creates instance with partial property overrides', () => {
            const config = {
                properties: {
                    color: '#ff0000'
                }
            }

            const instance = registry.createInstance(mockDefinition, config)

            expect(instance!.properties).toEqual({
                content: 'default content',
                fontSize: 16,
                color: '#ff0000'
            })
        })

        it('stores the instance in the registry', () => {
            const instance = registry.createInstance(mockDefinition)
            const retrievedInstance = registry.getInstance(instance!.instanceId)

            expect(retrievedInstance).toBe(instance)
        })

        it('creates instance with empty config object', () => {
            const instance = registry.createInstance(mockDefinition, {})

            expect(instance).not.toBeNull()
            expect(instance!.properties).toEqual(mockDefinition.defaults.properties)
        })
    })

    describe('updateInstance', () => {
        let instanceId: string

        beforeEach(() => {
            const instance = registry.createInstance(mockDefinition)
            instanceId = instance!.instanceId
        })

        it('updates instance properties successfully', () => {
            // Advance time to test modified timestamp
            const newDate = new Date('2023-01-02T00:00:00.000Z')
            vi.setSystemTime(newDate)

            const result = registry.updateInstance(instanceId, {
                properties: {
                    content: 'updated content',
                    fontSize: 20
                }
            })

            expect(result).toBe(true)

            const instance = registry.getInstance(instanceId)
            expect(instance!.properties).toEqual({
                content: 'updated content',
                fontSize: 20,
                color: '#000000' // unchanged
            })
            expect(instance!.modified).toEqual(newDate)
            expect(instance!.created).toEqual(mockDate) // should not change
        })

        it('updates instance with partial properties', () => {
            const result = registry.updateInstance(instanceId, {
                properties: {
                    color: '#ff0000'
                }
            })

            expect(result).toBe(true)

            const instance = registry.getInstance(instanceId)
            expect(instance!.properties).toEqual({
                content: 'default content',
                fontSize: 16,
                color: '#ff0000'
            })
        })

        it('returns false for non-existent instance', () => {
            const result = registry.updateInstance('non-existent-id', {
                properties: {content: 'test'}
            })

            expect(result).toBe(false)
        })

        it('updates modified timestamp when no properties are provided', () => {
            const newDate = new Date('2023-01-02T00:00:00.000Z')
            vi.setSystemTime(newDate)

            const result = registry.updateInstance(instanceId, {})

            expect(result).toBe(true)

            const instance = registry.getInstance(instanceId)
            expect(instance!.modified).toEqual(newDate)
        })

        it('does not modify properties when properties update is undefined', () => {
            const originalProperties = {...mockDefinition.defaults.properties}

            const result = registry.updateInstance(instanceId, {
                properties: undefined
            })

            expect(result).toBe(true)

            const instance = registry.getInstance(instanceId)
            expect(instance!.properties).toEqual(originalProperties)
        })
    })

    describe('getInstance', () => {
        it('returns instance when it exists', () => {
            const created = registry.createInstance(mockDefinition)
            const retrieved = registry.getInstance(created!.instanceId)

            expect(retrieved).toBe(created)
        })

        it('returns undefined for non-existent instance', () => {
            const retrieved = registry.getInstance('non-existent-id')

            expect(retrieved).toBeUndefined()
        })
    })

    describe('getInstancesByElementId', () => {
        it('returns instances matching element id', () => {
            const instance1 = registry.createInstance(mockDefinition)
            const instance2 = registry.createInstance(mockDefinition)

            // Create instance with different element id
            const otherDefinition = {...mockDefinition, id: 'other-element'}
            const instance3 = registry.createInstance(otherDefinition)

            const instances = registry.getInstancesByElementId('test-element')

            expect(instances).toHaveLength(2)
            expect(instances).toContain(instance1)
            expect(instances).toContain(instance2)
            expect(instances).not.toContain(instance3)
        })

        it('returns empty array when no instances match', () => {
            const instances = registry.getInstancesByElementId('non-existent-element')

            expect(instances).toEqual([])
        })

        it('returns empty array when registry is empty', () => {
            const instances = registry.getInstancesByElementId('test-element')

            expect(instances).toEqual([])
        })
    })

    describe('getAllInstances', () => {
        it('returns all instances', () => {
            const instance1 = registry.createInstance(mockDefinition)
            const instance2 = registry.createInstance(mockDefinition)

            const allInstances = registry.getAllInstances()

            expect(allInstances).toHaveLength(2)
            expect(allInstances).toContain(instance1)
            expect(allInstances).toContain(instance2)
        })

        it('returns empty array when no instances exist', () => {
            const allInstances = registry.getAllInstances()

            expect(allInstances).toEqual([])
        })
    })

    describe('removeInstance', () => {
        let instanceId: string

        beforeEach(() => {
            const instance = registry.createInstance(mockDefinition)
            instanceId = instance!.instanceId
        })

        it('removes existing instance and returns true', () => {
            const result = registry.removeInstance(instanceId)

            expect(result).toBe(true)
            expect(registry.getInstance(instanceId)).toBeUndefined()
            expect(registry.getAllInstances()).toHaveLength(0)
        })

        it('returns false for non-existent instance', () => {
            const result = registry.removeInstance('non-existent-id')

            expect(result).toBe(false)
            expect(registry.getAllInstances()).toHaveLength(1) // original instance still there
        })

        it('only removes the specified instance', () => {
            const instance2 = registry.createInstance(mockDefinition)

            const result = registry.removeInstance(instanceId)

            expect(result).toBe(true)
            expect(registry.getInstance(instanceId)).toBeUndefined()
            expect(registry.getInstance(instance2!.instanceId)).toBe(instance2)
            expect(registry.getAllInstances()).toHaveLength(1)
        })
    })

    describe('integration tests', () => {
        it('handles complete lifecycle of multiple instances', () => {
            // Create instances
            const instance1 = registry.createInstance(mockDefinition, {
                properties: {content: 'instance 1'}
            })
            const instance2 = registry.createInstance(mockDefinition, {
                properties: {content: 'instance 2'}
            })

            expect(registry.getAllInstances()).toHaveLength(2)

            // Update an instance
            registry.updateInstance(instance1!.instanceId, {
                properties: {fontSize: 20}
            })

            const updated = registry.getInstance(instance1!.instanceId)
            expect(updated!.properties.fontSize).toBe(20)
            expect(updated!.properties.content).toBe('instance 1')

            // Remove an instance
            registry.removeInstance(instance2!.instanceId)

            expect(registry.getAllInstances()).toHaveLength(1)
            expect(registry.getInstance(instance1!.instanceId)).toBeDefined()
            expect(registry.getInstance(instance2!.instanceId)).toBeUndefined()
        })

        it('handles instances with different element definitions', () => {
            const definition2 = {
                ...mockDefinition,
                id: 'other-element',
                defaults: {
                    ...mockDefinition.defaults,
                    properties: {title: 'default title', size: 'medium'}
                }
            }

            const instance1 = registry.createInstance(mockDefinition)
            const instance2 = registry.createInstance(definition2)

            expect(registry.getInstancesByElementId('test-element')).toHaveLength(1)
            expect(registry.getInstancesByElementId('other-element')).toHaveLength(1)
            expect(registry.getAllInstances()).toHaveLength(2)
        })
    })
})