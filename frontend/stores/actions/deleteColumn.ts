import {type Column, type Grid, type Row} from '~/types/grid';
import {type UndoRedoAction} from '../undoredo';
import {useGridSave} from "~/composables/useGridSave";

export class DeleteColumn
    implements UndoRedoAction {
    private deletedColumn: Column | undefined;

    constructor(
        private row: Row,
        private grid: Grid,
        private columnIndex: number,
    ) {
    }

    async undo() {
        this.row.columns[this.columnIndex].width -= this.deletedColumn!.width;
        this.row.columns.splice(this.columnIndex, 0, this.deletedColumn!);

        await useGridSave(this.grid);
    }

    async redo() {
        const colSize = this.row.columns[this.columnIndex].width;

        const isLastColumn = this.columnIndex == this.row.columns.length - 1;

        this.deletedColumn = this.row.columns.splice(this.columnIndex, 1)[0];
        this.row.columns[
            isLastColumn ? this.columnIndex - 1 : this.columnIndex
            ].width += colSize;

        await useGridSave(this.grid);
    }
}
