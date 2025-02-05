import {type Column, type Row} from '~/models/Grid';
import {type UndoRedoAction} from '../undoredo';

import * as uuid from 'uuid';

export class SplitColumn
    implements UndoRedoAction {
    private addedColumn: Column | undefined;

    constructor(
        private row: Row,
        private columnIndex: number,
    ) {
    }

    async undo() {
        const removedColumn = this.row.columns.splice(this.columnIndex - 2, 1);
        this.row.columns[this.columnIndex].width += removedColumn[0].width;
    }

    async redo() {
        const colSize = this.row.columns[this.columnIndex].width / 2;

        const leftSize = Math.floor(colSize);
        const rightSize = Math.ceil(colSize);

        this.row.columns[this.columnIndex].width = leftSize;

        this.addedColumn = {
            id: uuid.v4(),
            width: rightSize,
        };

        this.row.columns.splice(this.columnIndex, 0, this.addedColumn);
    }
}
