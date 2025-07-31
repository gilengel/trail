import {defineStore} from 'pinia';
import {type Column, Element, type Grid, type Row} from '~/types/grid';
import {GroupedUndoRedoAction, useUndoRedoStore} from './undoredo';
import {DeleteColumn} from "~/stores/actions/deleteColumn";
import {AddRow} from "~/stores/actions/addRow";
import {DeleteRow} from "~/stores/actions/deleteRow";
import {SplitColumn} from "~/stores/actions/splitColumn";
import {MoveRow} from "~/stores/actions/moveRow";
import {SetElement} from "~/stores/actions/setElement";
import {UpdateColumnWidth} from "~/stores/actions/updateColumnWidth";
import * as uuid from "uuid";
import {UpdateElementAttribute} from "~/stores/actions/updateElementAttribute";

/**
 * Creates a default grid consisting out of 3 rows with 2, 3 and 2 columns.
 * Specially useful to show the user something after creating a new trip.
 * @param tripId - The id of the trip the grid is associated with.
 * @returns A new instance of a grid with 3 rows and 2, 3 and 2 columns.
 */
export function createDefaultGrid(tripId: number): Grid {
    return {
        tripId,

        rows: [
            {
                id: uuid.v4(),
                columns: [
                    {width: 4, id: uuid.v4()},
                    {width: 8, id: uuid.v4()},
                ],
            },

            {
                id: uuid.v4(),
                columns: [
                    {width: 4, id: uuid.v4()},
                    {width: 4, id: uuid.v4()},
                    {width: 4, id: uuid.v4()},
                ],
            },

            {
                id: uuid.v4(),
                columns: [
                    {width: 6, id: uuid.v4()},
                    {width: 6, id: uuid.v4()},
                ],
            },
        ],
    };
}

export const useGridStore = () =>
    defineStore('gridStore', () => {
        const highlightedElements: Ref<Set<String>> = ref(new Set([]));

        const _undoRedoStore = useUndoRedoStore();

        function clearHighlightedElements() {
            highlightedElements.value.clear();
        }

        function addHighlightedElement<Properties extends object,
            ProvidedProperties extends readonly (keyof Properties)[] = readonly [],
            ConsumedProperties extends readonly (keyof Properties)[] = readonly []>(element: Element<Properties, ProvidedProperties, ConsumedProperties>) {
            if (isHighlighted(element)) {
                return;
            }

            highlightedElements.value.add(element.id);
        }

        function removeHighlightedElement<Properties extends object,
            ProvidedProperties extends readonly (keyof Properties)[] = readonly [],
            ConsumedProperties extends readonly (keyof Properties)[] = readonly []>(element: Element<Properties, ProvidedProperties, ConsumedProperties>) {
            highlightedElements.value.delete(element.id)
        }

        function getHighlightedElements(): Set<String> {
            return highlightedElements.value;
        }

        function isHighlighted<Properties extends object,
            ProvidedProperties extends readonly (keyof Properties)[] = readonly [],
            ConsumedProperties extends readonly (keyof Properties)[] = readonly []>(element: Element<Properties, ProvidedProperties, ConsumedProperties>): boolean {

            return highlightedElements.value.has(element.id)
        }

        /**
         * Adds a row to the grid.
         * @param row - The new grid added to the grid.
         * @param grid - The grid the row gets added to.
         */
        async function addRow(row: Row, grid: Grid) {
            await _undoRedoStore.execute(new AddRow(row, grid));
        }

        /**
         * Deletes a row at the given index in the grid.
         * @param rowIndex - The index of the row that shall be deleted.
         * @param grid - The grid the row gets removed from.
         */
        async function deleteRow(rowIndex: number, grid: Grid) {
            const row = grid.rows[rowIndex];
            await _undoRedoStore.execute(new DeleteRow(row!, grid));
        }

        /**
         * Deletes a column at the given index in the grid.
         * @param rowIndex - The index of the row from which the column shall be deleted.
         * @param columnIndex - The index of the column that shall be deleted.
         * @param grid - The grid the column gets removed from.
         */
        async function deleteColumn(rowIndex: number, columnIndex: number, grid: Grid) {
            const row = grid.rows[rowIndex];

            await _undoRedoStore.execute(new DeleteColumn(row, grid, columnIndex));
        }

        /**
         * Splits a column into two. Does not check if this is valid or not - as the backend does not limit the
         * number of allowed columns per row.
         * @param rowIndex - The index of the row from where a column shall be split.
         * @param columnIndex - The index of the column that shall be split.
         * @param grid - The grid where the column will be split.
         */
        async function splitColumn(rowIndex: number, columnIndex: number, grid: Grid) {
            const row = grid.rows[rowIndex];

            await _undoRedoStore.execute(new SplitColumn(row, grid, columnIndex));
        }

        /**
         * Moves a row to another position.
         * @param oldRowIndex - The old index of the row from where it is transferred.
         * @param newRowIndex - The new index of the row where it is transferred to.
         * @param grid - The grid where the row will be moved.
         */
        async function moveRow(oldRowIndex: number, newRowIndex: number, grid: Grid) {
            await _undoRedoStore.execute(
                new MoveRow(oldRowIndex, newRowIndex, grid),
            );
        }

        /**
         * Sets the displayed element of a column.
         * @param column - The column from which you want to set the element.
         * @param element - The element that shall be displayed.
         */
        async function setColumnElement(column: Column, element: Element<any, any, any>) {
            await _undoRedoStore.execute(new SetElement(column, element));
        }

        /**
         * Updates an attribute of an element. As each element has its own set of attributes, the attribute
         * to be changed is identified by a key.
         * @template T Object.
         * @template K Key Of T.
         * @param element - The element from which you want to set an attribute.
         * @param attribute - The key of the attribute that shall be changed.
         * @param value - The new value for the attribute. It can be either string, number or boolean.
         */
        async function updateElementAttribute<
            Properties extends object, Property extends keyof Properties,
            ProvidedProperties extends readonly (keyof Properties)[] = readonly [],
            ConsumedProperties extends readonly (keyof Properties)[] = readonly []>(
            element: Element<Properties, ProvidedProperties, ConsumedProperties>,
            attribute: Property,
            value: Properties[Property]
        ) {
            await _undoRedoStore.execute(
                new UpdateElementAttribute(element, attribute, value),
            );
        }

        /**
         * Updates the widths of two neighboring columns.
         * @param left - The left column.
         * @param left.column - The left column model.
         * @param left.width - The new width for the left column.
         * @param right - The right column.
         * @param right.column - The right column model.
         * @param right.width - The new width for the right column.
         */
        async function updateColumnsWidth(
            left: { column: Column; width: number },
            right: { column: Column; width: number },
        ) {
            await _undoRedoStore.execute(
                new GroupedUndoRedoAction([
                    new UpdateColumnWidth(left.column, left.width),
                    new UpdateColumnWidth(right.column, right.width),
                ]),
            );
        }

        function findElementWithId<Properties extends object>(id: String, grid: Grid)

            : Element<Properties> | undefined {
            for (let row of grid.rows) {
                for (let column of row.columns) {
                    if (column.element && column.element.id === id) {
                        return column.element as unknown as Element<Properties>;
                    }
                }
            }

            return undefined;
        }

        return {
            clearHighlightedElements,
            addHighlightedElement,
            removeHighlightedElement,
            getHighlightedElements,
            isHighlighted,

            findElementWithId,

            addRow,
            moveRow,
            deleteRow,
            deleteColumn,
            splitColumn,
            setColumnElement,
            updateColumnsWidth,
            updateElementAttribute,
        };
    })();
