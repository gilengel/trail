import {describe, it, expect, beforeEach, vi} from 'vitest'
import {
    ConnectElementProperties,
    type ConnectElementPropertiesMeta,
    findLoop
} from "./connectProperty";
import {BuilderMode, Editor} from '../editor'
import type {EditorElementInstance} from '../editorElementInstanceRegistry'
import type {Grid} from '../grid'
import {createTestGrid} from "../undoredo/actions/test.helper";
import {LogLevel} from "../handler/logger";


// Mock console.error to avoid test output pollution
vi.spyOn(console, 'error').mockImplementation(() => {
})

describe('findLoop', () => {
    let mockEditor: Editor;
    let mockGrid: Grid;
    let mockElement1: EditorElementInstance;
    let mockElement2: EditorElementInstance;
    let mockElement3: EditorElementInstance;

    beforeEach(() => {
        const now = new Date();

        // Create mock elements
        mockElement1 = {
            instanceId: 'element-1',
            elementId: 'text-element',
            connections: {
                consumed: {},
                provided: {}
            },
            properties: {},
            created: now,
            modified: now,
            selected: false,
        } as EditorElementInstance;

        mockElement2 = {
            instanceId: 'element-2',
            elementId: 'text-element',
            connections: {
                consumed: {},
                provided: {}
            },
            properties: {},
            created: now,
            modified: now,
            selected: false,
        } as EditorElementInstance;

        mockElement3 = {
            instanceId: 'element-3',
            elementId: 'text-element',
            connections: {
                consumed: {},
                provided: {}
            },
            properties: {},
            created: now,
            modified: now,
            selected: false,
        } as EditorElementInstance;

        mockGrid = createTestGrid();

        mockEditor = {
            selectedElement: {value: null},
            grid: mockGrid,
            log: vi.fn(),
            clearSelectedElements: vi.fn(),
            switchMode: vi.fn(),
            findElementWithId: vi.fn().mockImplementation((id: string) => {
                switch (id) {
                    case 'element-1':
                        return mockElement1
                    case 'element-2':
                        return mockElement2
                    case 'element-3':
                        return mockElement3
                }

                return undefined;
            })
        } as unknown as Editor;
    })

    it('returns undefined when target has no consumed connection for property', () => {
        const result = findLoop('testProperty', mockElement1, mockEditor)

        expect(result).toBeUndefined()
        expect(mockEditor.findElementWithId).not.toHaveBeenCalled()
    })

    it('returns undefined when connected element is not found', () => {
        mockElement1.connections.consumed['testProperty'] = 'non-existent-element'
        vi.mocked(mockEditor.findElementWithId).mockReturnValue(undefined)

        const result = findLoop('testProperty', mockElement1, mockEditor)

        expect(result).toBeUndefined()
        expect(mockEditor.findElementWithId).toHaveBeenCalledWith('non-existent-element')
    })

    it('detects simple loop (element points to already visited element)', () => {
        mockElement1.connections.consumed['testProperty'] = 'element-2'
        vi.mocked(mockEditor.findElementWithId).mockReturnValue(mockElement2)

        const visitedIds = ['element-2']
        const result = findLoop('testProperty', mockElement1, mockEditor, visitedIds)

        expect(result).toEqual(['element-2'])
    })

    it('detects complex loop through recursion', () => {
        // Setup chain: element1 -> element2 -> element3 -> element2 (loop)
        mockElement1.connections.consumed['testProperty'] = 'element-2'

        mockElement2.connections.provided['testProperty'] = 'element-1'
        mockElement2.connections.consumed['testProperty'] = 'element-3'

        mockElement3.connections.provided['testProperty'] = 'element-2'
        mockElement3.connections.consumed['testProperty'] = 'element-1'


        const result = findLoop('testProperty', mockElement1, mockEditor)

        expect(result).toEqual(['element-2'])
    })

    it('returns undefined when no loop is formed', () => {
        mockElement1.connections.provided['testProperty'] = 'element-3'

        const result = findLoop('testProperty', mockElement1, mockEditor)

        expect(result).toBeUndefined()
    })
})

describe('ConnectElementProperties', () => {
    let connectMode: ConnectElementProperties
    let mockEditor: Editor
    let mockGrid: Grid
    let mockProvidingElement: EditorElementInstance
    let mockConsumingElement: EditorElementInstance

    beforeEach(() => {
        mockGrid = createTestGrid()

        mockEditor = {
            selectedElement: {value: null},
            grid: mockGrid,
            log: vi.fn(),
            clearSelectedElements: vi.fn(),
            switchMode: vi.fn(),
            findElementWithId: vi.fn()
        } as unknown as Editor

        connectMode = new ConnectElementProperties(mockEditor)

        mockProvidingElement = {
            instanceId: 'providing-element',
            elementId: 'text-element',
            defaults: {
                properties: {},
                providedProperties: ['testProperty'],
                consumedProperties: []
            },
            connections: {
                consumed: {},
                provided: {'testProperty': 'some-other-element'}
            },
            properties: {},
            created: new Date(),
            modified: new Date(),
            selected: false,
        } as EditorElementInstance

        mockConsumingElement = {
            instanceId: 'consuming-element',
            elementId: 'text-element',
            connections: {
                consumed: {},
                provided: {}
            },
            properties: {},
            created: new Date(),
            modified: new Date(),
            selected: false,
        } as EditorElementInstance
    })

    describe('activate', () => {
        it('sets meta property correctly', () => {
            const meta: ConnectElementPropertiesMeta = {property: 'testProperty'}

            connectMode.activate(meta)

            // Access private property for testing - this is a testing pattern
            expect((connectMode as any).meta).toEqual(meta)
        })
    })

    describe('onSelectElement', () => {
        beforeEach(() => {
            connectMode.activate({property: 'testProperty'})
        })

        it('returns early when no selected element in editor', () => {
            mockEditor.selectedElement.value = undefined

            connectMode.onSelectElement(mockConsumingElement)

            expect(mockEditor.log).not.toHaveBeenCalled()
            expect(mockEditor.clearSelectedElements).not.toHaveBeenCalled()
            expect(mockEditor.switchMode).not.toHaveBeenCalled()
        })

        it('returns early when no meta is set', () => {
            mockEditor.selectedElement.value = mockProvidingElement
            ;(connectMode as any).meta = undefined

            connectMode.onSelectElement(mockConsumingElement)

            expect(mockEditor.log).not.toHaveBeenCalled()
            expect(mockEditor.clearSelectedElements).not.toHaveBeenCalled()
            expect(mockEditor.switchMode).not.toHaveBeenCalled()
        })

        it('returns early when meta property is not set', () => {
            mockEditor.selectedElement.value = mockProvidingElement
            ;(connectMode as any).meta = {property: undefined}

            connectMode.onSelectElement(mockConsumingElement)

            expect(mockEditor.log).not.toHaveBeenCalled()
            expect(mockEditor.clearSelectedElements).not.toHaveBeenCalled()
            expect(mockEditor.switchMode).not.toHaveBeenCalled()
        })

        it('detects loop and shows warning', () => {
            mockEditor.selectedElement.value = mockProvidingElement

            // Mock findLoop to detect a loop
            vi.mocked(mockEditor.findElementWithId).mockReturnValue(mockConsumingElement)
            mockConsumingElement.connections.consumed['testProperty'] = 'providing-element'

            connectMode.onSelectElement(mockConsumingElement)

            expect(mockEditor.log).toHaveBeenCalledWith(
                'The data of the connected elements form a loop which is not allowed. The connection is not set.', LogLevel.Warning
            )
            expect(mockEditor.clearSelectedElements).toHaveBeenCalled()
            expect(mockEditor.switchMode).toHaveBeenCalledWith(BuilderMode.Create, {})
        })

        it('successfully connects elements when no loop is detected', () => {
            mockEditor.selectedElement.value = mockProvidingElement

            // Ensure no loops are detected
            vi.mocked(mockEditor.findElementWithId).mockReturnValue(undefined)

            connectMode.onSelectElement(mockConsumingElement)

            expect(mockProvidingElement.connections.consumed['testProperty']).toBe('consuming-element')
            expect(mockConsumingElement.connections.provided['testProperty']).toBe('providing-element')
            expect(mockEditor.clearSelectedElements).toHaveBeenCalled()
            expect(mockEditor.switchMode).toHaveBeenCalledWith(BuilderMode.Create, {})
        })

        it('handles multiple provided properties when checking for loops', () => {
            mockProvidingElement.connections.provided = {
                'property1': 'element-1',
                'property2': 'element-2',
                'testProperty': 'element-3'
            }
            mockEditor.selectedElement.value = mockProvidingElement

            // Mock to simulate loop detection on property2
            vi.mocked(mockEditor.findElementWithId)
                .mockReturnValueOnce(undefined) // property1 - no loop
                .mockReturnValueOnce(mockConsumingElement) // property2 - has connection
                .mockReturnValueOnce(undefined) // testProperty - no loop

            // Set up consuming element to create loop on property2
            mockConsumingElement.connections.consumed['property2'] = 'providing-element'

            connectMode.onSelectElement(mockConsumingElement)

            expect(mockEditor.clearSelectedElements).toHaveBeenCalled()
            expect(mockEditor.switchMode).toHaveBeenCalledWith(BuilderMode.Create, {})
        })

        it('does not connect when providing element has no provided properties', () => {
            mockProvidingElement.connections.provided = {}
            mockEditor.selectedElement.value = mockProvidingElement

            connectMode.onSelectElement(mockConsumingElement)

            expect(mockProvidingElement.connections.consumed['testProperty']).toBe('consuming-element')
            expect(mockConsumingElement.connections.provided['testProperty']).toBe('providing-element')
            expect(mockEditor.clearSelectedElements).toHaveBeenCalled()
            expect(mockEditor.switchMode).toHaveBeenCalledWith(BuilderMode.Create, {})
        })
    })

    describe('integration tests', () => {
        it('handles complete workflow from activation to connection', () => {
            const meta: ConnectElementPropertiesMeta = {property: 'dataProperty'}
            mockEditor.selectedElement.value = mockProvidingElement
            vi.mocked(mockEditor.findElementWithId).mockReturnValue(undefined)

            // Activate mode
            connectMode.activate(meta)

            // Select element to connect
            connectMode.onSelectElement(mockConsumingElement)

            // Verify connection was made
            expect(mockProvidingElement.connections.consumed['dataProperty']).toBe('consuming-element')
            expect(mockConsumingElement.connections.provided['dataProperty']).toBe('providing-element')

            // Verify editor state is cleaned up
            expect(mockEditor.clearSelectedElements).toHaveBeenCalled()
            expect(mockEditor.switchMode).toHaveBeenCalledWith(BuilderMode.Create, {})
        })

        it('handles workflow with loop prevention', () => {
            const meta: ConnectElementPropertiesMeta = {property: 'dataProperty'}
            mockEditor.selectedElement.value = mockProvidingElement
            mockProvidingElement.connections.provided['dataProperty'] = 'consuming-element'

            // Set up loop
            vi.mocked(mockEditor.findElementWithId).mockReturnValue(mockConsumingElement)
            mockConsumingElement.connections.consumed['dataProperty'] = 'providing-element'

            // Activate mode
            connectMode.activate(meta)

            // Attempt to select element (should detect loop)
            connectMode.onSelectElement(mockConsumingElement)

            // Verify no connection was made
            expect(mockProvidingElement.connections.consumed).not.toHaveProperty('dataProperty')
            expect(mockConsumingElement.connections.provided).not.toHaveProperty('dataProperty')

            // Verify warning was shown and mode switched
            expect(mockEditor.log).toHaveBeenCalledWith(
                'The data of the connected elements form a loop which is not allowed. The connection is not set.',
                LogLevel.Warning
            )
            expect(mockEditor.clearSelectedElements).toHaveBeenCalled()
            expect(mockEditor.switchMode).toHaveBeenCalledWith(BuilderMode.Create, {})
        })
    })
})