import type {IUndoRedoAction} from "../";
import type {Row, Grid} from "../../grid"
import type {ISaveGridFn} from "../../editorConfiguration";

/**
 * Adds a row to the grid. This is an undo/redo able action.
 */
export class AddRow
    implements IUndoRedoAction {
    constructor(
        private row: Row,
        private grid: Grid,
    ) {
    }

    async undo(persist: ISaveGridFn) {
        const rowIndex = this.grid.rows.indexOf(this.row);
        this.grid.rows.splice(rowIndex, 1);

        await persist(this.grid);
    }

    async redo(persist: ISaveGridFn) {
        this.grid.rows.push(this.row);

        await persist(this.grid);
    }
}
