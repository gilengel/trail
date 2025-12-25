import { type Ref } from "vue";

/**
 * Adds arbitrary data to the payload of a DragEvent so that it can be extracted in a DropEvent.
 * @param event - The drag event to which you want to add the payload.
 * @param data - The payload you want to add to the event.
 */
export function addObjectToDataTransfer(event: DragEvent, data: object) {
  event.dataTransfer?.setData("payload", JSON.stringify(data));
}

/**
 * Helper that adds the data to a DragEvent so that it is transferred and can be extracted in a DropEvent.
 * @param element - The element you want to register to be draggable.
 * @param data - The data you want to add to the DragEvent if the element is dragged.
 */
export function useDrag(element: Ref, data: object) {
  element.value.ondragstart = (e: DragEvent) =>
    addObjectToDataTransfer(e, data);
}
