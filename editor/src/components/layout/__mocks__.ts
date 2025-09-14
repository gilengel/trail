import {vi} from "vitest";
import {mockElementHandler} from "~/types/editor/__mocks__";

export const mockEditor = {
    executeAction: vi.fn(),
    switchMode: vi.fn(),
    handleSelectElement: vi.fn(),
    clearSelectedElements: vi.fn(),
    pushWarning: vi.fn(),
    activeMode: "mockedMode",
    selectedElement: undefined,
    grid: "mockGrid",
    elements: mockElementHandler
};
