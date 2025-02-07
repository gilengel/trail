import {type Grid} from '~/models/Grid';
import {type UndoRedoAction} from '../undoredo';
import {useGridSave} from "~/composables/useGridSave";

export class MoveRow
    implements UndoRedoAction {
    constructor(
        private oldRowIndex: number,
        private newRowIndex: number,
        private grid: Grid,
    ) {
    }

    async undo() {
        const tempRow = this.grid.rows[this.oldRowIndex];
        this.grid.rows[this.oldRowIndex] = this.grid.rows[this.newRowIndex];
        this.grid.rows[this.newRowIndex] = tempRow;

        await useGridSave(this.grid)
    }

    async redo() {
        const tempRow = this.grid.rows[this.newRowIndex];
        this.grid.rows[this.newRowIndex] = this.grid.rows[this.oldRowIndex];
        this.grid.rows[this.oldRowIndex] = tempRow;

        await useGridSave(this.grid)
    }
}
