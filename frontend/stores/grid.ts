import {defineStore} from 'pinia';
import {type AttributeType, type Column, Element, type Grid, type Row} from '~/types/grid';
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
    }
}

export const useGridStore = () =>
    defineStore('gridStore', () => {

        const _undoRedoStore = useUndoRedoStore();

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
        async function setColumnElement(column: Column, element: Element<unknown>) {
            await _undoRedoStore.execute(new SetElement(column, element));
        }

        /**
         * Updates an attribute of an element. As each element has its own set of attributes, the attribute
         * to be changed is identified by a key.
         * @param element - The element from which you want to set an attribute.
         * @param attribute - The key of the attribute that shall be changed.
         * @param value - The new value for the attribute. It can be either string, number or boolean.
         */
        async function updateElementAttribute<T extends object, K extends keyof T>(
            element: Element<T>,
            attribute: K,
            value: T[K]
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

        return {
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
