import * as uuid from 'uuid';
import type {IUndoRedoAction} from "../";
import type {Column, Row, Grid} from "../../grid"
import type {ISaveGridFn} from "../../editorConfiguration";


export class SplitColumn
    implements IUndoRedoAction {
    private addedColumn: Column | undefined;

    constructor(
        private row: Row,
        private columnIndex: number,
        private grid: Grid,
    ) {
    }

    async undo(persist: ISaveGridFn) {
        const removedColumn = this.row.columns.splice(this.columnIndex - 2, 1);
        this.row.columns[this.columnIndex]!.width += removedColumn[0]!.width;

        await persist(this.grid);
    }

    async redo(persist: ISaveGridFn) {
        const colSize = this.row.columns[this.columnIndex]!.width / 2;

        const leftSize = Math.floor(colSize);
        const rightSize = Math.ceil(colSize);

        this.row.columns[this.columnIndex]!.width = leftSize;

        this.addedColumn = {
            id: uuid.v4(),
            width: rightSize,
        };

        this.row.columns.splice(this.columnIndex, 0, this.addedColumn);

        await persist(this.grid);
    }
}
