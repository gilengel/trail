import {ref} from 'vue';
import {describe, it, expect, vi} from 'vitest';

describe('Composables[Drag]', () => {
    it('addObjectToDataTransfer calls dataTransfer.setData with JSON payload', () => {
        const setData = vi.fn();
        const event = {
            dataTransfer: {setData}
        } as unknown as DragEvent;

        const payload = {foo: 'bar'};

        addObjectToDataTransfer(event, payload);

        expect(setData).toHaveBeenCalledOnce();
        expect(setData).toHaveBeenCalledWith('payload', JSON.stringify(payload));
    });

    it('adds JSON data to dataTransfer on ondragstart', () => {
        const element = ref({} as HTMLElement);
        const data = {id: 123};
        useDrag(element, data);

        const setData = vi.fn();
        const mockEvent = {dataTransfer: {setData}} as unknown as DragEvent;

        element.value.ondragstart!(mockEvent);

        expect(setData).toHaveBeenCalledOnce();
        expect(setData).toHaveBeenCalledWith('payload', JSON.stringify(data));
    });

});
