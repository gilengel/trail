import {describe, it, expect, beforeEach} from 'vitest'
import type {EditorElementDefinition} from '~/components/GridEditor/editorConfiguration'
import {ElementDefinitionRegistry} from "~/components/GridEditor/editorElementDefinitionRegistry";

describe('ElementDefinitionRegistry', () => {
    let registry: ElementDefinitionRegistry
    let mockElement1: EditorElementDefinition<any, any, any>
    let mockElement2: EditorElementDefinition<any, any, any>
    let mockElement3: EditorElementDefinition<any, any, any>

    beforeEach(() => {
        registry = new ElementDefinitionRegistry()

        mockElement1 = {
            id: 'text-element',
            name: 'Text Element',
            category: 'content',
            components: {
                element: {} as any,
                properties: {} as any,
            },
            defaults: {
                properties: {content: 'default'},
                providedProperties: ['content'] as const,
                consumedProperties: [] as const,
            },
            metadata: {
                description: 'A text element',
                tags: ['text', 'content', 'basic'],
                icon: 'text-icon',
                version: '1.0.0',
            }
        }

        mockElement2 = {
            id: 'button-element',
            name: 'Button Element',
            category: 'interactive',
            components: {
                element: {} as any,
                properties: {} as any,
            },
            defaults: {
                properties: {label: 'Click me'},
                providedProperties: [] as const,
                consumedProperties: ['label'] as const,
            },
            metadata: {
                description: 'A button element',
                tags: ['button', 'interactive'],
                icon: 'button-icon',
                version: '1.0.0',
            }
        }

        mockElement3 = {
            id: 'container-element',
            name: 'Container Element',
            category: 'layout',
            components: {
                element: {} as any,
                properties: {} as any,
            },
            defaults: {
                properties: {padding: 10},
                providedProperties: [] as const,
                consumedProperties: [] as const,
            },
            metadata: {
                description: 'A container element',
                tags: ['container', 'layout'],
                icon: 'container-icon',
                version: '1.1.0',
            }
        }
    })

    describe('register', () => {
        it('registers a single element successfully', () => {
            const result = registry.register(mockElement1)

            expect(result).toBe(registry) // returns this for chaining
            expect(registry.has('text-element')).toBe(true)
            expect(registry.get('text-element')).toBe(mockElement1)
            expect(registry.size()).toBe(1)
        })

        it('throws error when registering element with duplicate ID', () => {
            registry.register(mockElement1)

            expect(() => registry.register(mockElement1)).toThrow(
                "Element with ID 'text-element' is already registered"
            )
        })

        it('indexes element by category correctly', () => {
            registry.register(mockElement1)

            expect(registry.getCategories()).toContain('content')
            expect(registry.getByCategory('content')).toEqual([mockElement1])
        })

        it('uses "default" category when element has no category', () => {
            const elementWithoutCategory = {...mockElement1, category: undefined}
            registry.register(elementWithoutCategory)

            expect(registry.getCategories()).toContain('default')
            expect(registry.getByCategory('default')).toEqual([elementWithoutCategory])
        })

        it('indexes element by tags correctly', () => {
            registry.register(mockElement1)

            expect(registry.getTags()).toEqual(expect.arrayContaining(['text', 'content', 'basic']))
            expect(registry.getByTag('text')).toEqual([mockElement1])
            expect(registry.getByTag('content')).toEqual([mockElement1])
            expect(registry.getByTag('basic')).toEqual([mockElement1])
        })

        it('handles element with no metadata tags', () => {
            const elementWithoutTags = {
                ...mockElement1,
                metadata: {...mockElement1.metadata!, tags: undefined}
            }
            registry.register(elementWithoutTags)

            expect(registry.getTags()).toEqual([])
            expect(registry.getByTag('any-tag')).toEqual([])
        })

        it('handles element with no metadata at all', () => {
            const elementWithoutMetadata = {...mockElement1, metadata: undefined}
            registry.register(elementWithoutMetadata)

            expect(registry.getTags()).toEqual([])
            expect(registry.has('text-element')).toBe(true)
        })

        it('handles empty tags array', () => {
            const elementWithEmptyTags = {
                ...mockElement1,
                metadata: {...mockElement1.metadata!, tags: []}
            }
            registry.register(elementWithEmptyTags)

            expect(registry.getTags()).toEqual([])
        })
    })

    describe('registerMany', () => {
        it('registers multiple elements successfully', () => {
            const elements = [mockElement1, mockElement2, mockElement3]
            const result = registry.registerMany(elements)

            expect(result).toBe(registry)
            expect(registry.size()).toBe(3)
            expect(registry.has('text-element')).toBe(true)
            expect(registry.has('button-element')).toBe(true)
            expect(registry.has('container-element')).toBe(true)
        })

        it('registers empty array without error', () => {
            const result = registry.registerMany([])

            expect(result).toBe(registry)
            expect(registry.size()).toBe(0)
        })

        it('stops at first duplicate and throws error', () => {
            registry.register(mockElement2) // Pre-register one element

            expect(() => registry.registerMany([mockElement1, mockElement2, mockElement3]))
                .toThrow("Element with ID 'button-element' is already registered")

            // Should have registered mockElement1 but not mockElement3
            expect(registry.has('text-element')).toBe(true)
            expect(registry.has('button-element')).toBe(true) // was already there
            expect(registry.has('container-element')).toBe(false) // not reached
        })

        it('indexes all elements by category and tags', () => {
            registry.registerMany([mockElement1, mockElement2, mockElement3])

            expect(registry.getCategories().sort()).toEqual(['content', 'interactive', 'layout'])
            expect(registry.getTags().sort()).toEqual(['basic', 'button', 'container', 'content', 'interactive', 'layout', 'text'])
        })
    })

    describe('get', () => {
        beforeEach(() => {
            registry.register(mockElement1)
        })

        it('returns element when it exists', () => {
            const result = registry.get('text-element')
            expect(result).toBe(mockElement1)
        })

        it('returns undefined when element does not exist', () => {
            const result = registry.get('non-existent')
            expect(result).toBeUndefined()
        })
    })

    describe('getAll', () => {
        it('returns all registered elements', () => {
            registry.registerMany([mockElement1, mockElement2, mockElement3])

            const result = registry.getAll()

            expect(result).toHaveLength(3)
            expect(result).toContain(mockElement1)
            expect(result).toContain(mockElement2)
            expect(result).toContain(mockElement3)
        })

        it('returns empty array when no elements registered', () => {
            const result = registry.getAll()
            expect(result).toEqual([])
        })

        it('returns a new array (not internal reference)', () => {
            registry.register(mockElement1)
            const result1 = registry.getAll()
            const result2 = registry.getAll()

            expect(result1).not.toBe(result2) // Different array instances
            expect(result1).toEqual(result2) // But same content
        })
    })

    describe('getByCategory', () => {
        beforeEach(() => {
            registry.registerMany([mockElement1, mockElement2, mockElement3])
        })

        it('returns elements from specific category', () => {
            const contentElements = registry.getByCategory('content')
            const interactiveElements = registry.getByCategory('interactive')
            const layoutElements = registry.getByCategory('layout')

            expect(contentElements).toEqual([mockElement1])
            expect(interactiveElements).toEqual([mockElement2])
            expect(layoutElements).toEqual([mockElement3])
        })

        it('returns empty array for non-existent category', () => {
            const result = registry.getByCategory('non-existent')
            expect(result).toEqual([])
        })

        it('returns multiple elements from same category', () => {
            const anotherContentElement = {...mockElement1, id: 'paragraph-element'}
            registry.register(anotherContentElement)

            const contentElements = registry.getByCategory('content')

            expect(contentElements).toHaveLength(2)
            expect(contentElements).toContain(mockElement1)
            expect(contentElements).toContain(anotherContentElement)
        })

        it('filters out any null/undefined elements', () => {
            // This tests the .filter(Boolean) part
            const result = registry.getByCategory('content')
            expect(result.every(el => el != null)).toBe(true)
        })
    })

    describe('getByTag', () => {
        beforeEach(() => {
            registry.registerMany([mockElement1, mockElement2, mockElement3])
        })

        it('returns elements with specific tag', () => {
            const textElements = registry.getByTag('text')
            const interactiveElements = registry.getByTag('interactive')
            const layoutElements = registry.getByTag('layout')

            expect(textElements).toEqual([mockElement1])
            expect(interactiveElements).toEqual([mockElement2])
            expect(layoutElements).toEqual([mockElement3])
        })

        it('returns empty array for non-existent tag', () => {
            const result = registry.getByTag('non-existent')
            expect(result).toEqual([])
        })

        it('returns multiple elements with same tag', () => {
            const anotherContentElement = {
                ...mockElement2,
                id: 'link-element',
                metadata: {
                    ...mockElement2.metadata!,
                    tags: ['interactive', 'navigation']
                }
            }
            registry.register(anotherContentElement)

            const interactiveElements = registry.getByTag('interactive')

            expect(interactiveElements).toHaveLength(2)
            expect(interactiveElements).toContain(mockElement2)
            expect(interactiveElements).toContain(anotherContentElement)
        })

        it('handles elements that share multiple tags', () => {
            // mockElement1 has tags: ['text', 'content', 'basic']
            const contentElements = registry.getByTag('content')
            const basicElements = registry.getByTag('basic')

            expect(contentElements).toEqual([mockElement1])
            expect(basicElements).toEqual([mockElement1])
        })
    })

    describe('getCategories', () => {
        it('returns all unique categories', () => {
            registry.registerMany([mockElement1, mockElement2, mockElement3])

            const categories = registry.getCategories()

            expect(categories.sort()).toEqual(['content', 'interactive', 'layout'])
        })

        it('returns empty array when no elements registered', () => {
            const categories = registry.getCategories()
            expect(categories).toEqual([])
        })

        it('includes "default" category for elements without category', () => {
            const elementWithoutCategory = {...mockElement1, category: undefined}
            registry.register(elementWithoutCategory)

            const categories = registry.getCategories()
            expect(categories).toContain('default')
        })

        it('does not include duplicate categories', () => {
            const anotherContentElement = {...mockElement1, id: 'paragraph-element'}
            registry.registerMany([mockElement1, anotherContentElement])

            const categories = registry.getCategories()
            expect(categories).toEqual(['content'])
            expect(categories).toHaveLength(1)
        })
    })

    describe('getTags', () => {
        it('returns all unique tags', () => {
            registry.registerMany([mockElement1, mockElement2, mockElement3])

            const tags = registry.getTags()

            expect(tags.sort()).toEqual(['basic', 'button', 'container', 'content', 'interactive', 'layout', 'text'])
        })

        it('returns empty array when no elements registered', () => {
            const tags = registry.getTags()
            expect(tags).toEqual([])
        })

        it('returns empty array when no elements have tags', () => {
            const elementWithoutTags = {
                ...mockElement1,
                metadata: {...mockElement1.metadata!, tags: undefined}
            }
            registry.register(elementWithoutTags)

            const tags = registry.getTags()
            expect(tags).toEqual([])
        })

        it('does not include duplicate tags', () => {
            const elementWithOverlappingTags = {
                ...mockElement1,
                id: 'rich-text-element',
                metadata: {
                    ...mockElement1.metadata!,
                    tags: ['text', 'rich', 'content'] // 'text' and 'content' overlap with mockElement1
                }
            }
            registry.registerMany([mockElement1, elementWithOverlappingTags])

            const tags = registry.getTags()
            const textCount = tags.filter(tag => tag === 'text').length
            const contentCount = tags.filter(tag => tag === 'content').length

            expect(textCount).toBe(1)
            expect(contentCount).toBe(1)
            expect(tags).toContain('rich')
        })
    })

    describe('has', () => {
        it('returns true when element exists', () => {
            registry.register(mockElement1)
            expect(registry.has('text-element')).toBe(true)
        })

        it('returns false when element does not exist', () => {
            expect(registry.has('non-existent')).toBe(false)
        })

        it('returns false for empty registry', () => {
            expect(registry.has('any-element')).toBe(false)
        })
    })

    describe('size', () => {
        it('returns correct count of registered elements', () => {
            expect(registry.size()).toBe(0)

            registry.register(mockElement1)
            expect(registry.size()).toBe(1)

            registry.registerMany([mockElement2, mockElement3])
            expect(registry.size()).toBe(3)
        })

        it('returns 0 for empty registry', () => {
            expect(registry.size()).toBe(0)
        })
    })

    describe('clear', () => {
        beforeEach(() => {
            registry.registerMany([mockElement1, mockElement2, mockElement3])
        })

        it('removes all elements', () => {
            expect(registry.size()).toBe(3) // Sanity check

            registry.clear()

            expect(registry.size()).toBe(0)
            expect(registry.getAll()).toEqual([])
            expect(registry.has('text-element')).toBe(false)
            expect(registry.has('button-element')).toBe(false)
            expect(registry.has('container-element')).toBe(false)
        })

        it('clears categories index', () => {
            expect(registry.getCategories()).toHaveLength(3) // Sanity check

            registry.clear()

            expect(registry.getCategories()).toEqual([])
            expect(registry.getByCategory('content')).toEqual([])
        })

        it('clears tags index', () => {
            expect(registry.getTags().length).toBeGreaterThan(0) // Sanity check

            registry.clear()

            expect(registry.getTags()).toEqual([])
            expect(registry.getByTag('text')).toEqual([])
        })

        it('allows registering elements after clear', () => {
            registry.clear()
            registry.register(mockElement1)

            expect(registry.size()).toBe(1)
            expect(registry.get('text-element')).toBe(mockElement1)
        })
    })

    describe('integration and edge cases', () => {
        it('handles complete workflow', () => {
            // Register elements
            registry.registerMany([mockElement1, mockElement2])

            // Verify registration
            expect(registry.size()).toBe(2)
            expect(registry.getCategories()).toEqual(expect.arrayContaining(['content', 'interactive']))

            // Query by different methods
            const contentElements = registry.getByCategory('content')
            const textElements = registry.getByTag('text')
            const allElements = registry.getAll()

            expect(contentElements).toEqual([mockElement1])
            expect(textElements).toEqual([mockElement1])
            expect(allElements).toHaveLength(2)

            // Clear and verify empty state
            registry.clear()
            expect(registry.size()).toBe(0)
            expect(registry.getCategories()).toEqual([])
            expect(registry.getTags()).toEqual([])
        })

        it('maintains index consistency after multiple operations', () => {
            // Add some elements
            registry.registerMany([mockElement1, mockElement2])

            // Verify indices are correct
            expect(registry.getByCategory('content')).toHaveLength(1)
            expect(registry.getByTag('text')).toHaveLength(1)

            // Add element with same category and tag
            const similarElement = {
                ...mockElement1,
                id: 'rich-text-element',
                metadata: {
                    ...mockElement1.metadata!,
                    tags: ['text', 'rich']
                }
            }
            registry.register(similarElement)

            // Verify indices updated correctly
            expect(registry.getByCategory('content')).toHaveLength(2)
            expect(registry.getByTag('text')).toHaveLength(2)
            expect(registry.getTags()).toContain('rich')
        })

        it('handles method chaining', () => {
            const result = registry
                .register(mockElement1)
                .register(mockElement2)
                .registerMany([mockElement3])

            expect(result).toBe(registry)
            expect(registry.size()).toBe(3)
        })
    })
})