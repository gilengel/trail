import {type Grid, type Row} from '~/types/grid';
import {type IUndoRedoAction} from '../undoredo';
import type {ISaveGridFn} from "~/stores/ISaveGrid";

/**
 * Deletes a row to the grid. This is an undo/redoable action.
 */
export class DeleteRow
    implements IUndoRedoAction {
    private readonly rowIndex: number;

    constructor(
        private row: Row,
        private grid: Grid
    ) {
        this.rowIndex = this.grid.rows.indexOf(this.row);
    }

    async undo(persist: ISaveGridFn) {
        this.grid.rows.splice(this.rowIndex, 0, this.row);

        await persist(this.grid);
    }

    async redo(persist: ISaveGridFn) {
        this.grid.rows.splice(this.rowIndex, 1);

        await persist(this.grid);
    }
}
