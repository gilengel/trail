import {type Column, type Grid, type Row} from '../../types/grid';
import {type IUndoRedoAction} from '../undoredo';
import type {ISaveGridFn} from "../ISaveGrid";


export class DeleteColumn
  implements IUndoRedoAction {
  private deletedColumn: Column | undefined;

  constructor(
    private row: Row,
    private columnIndex: number,
    private grid: Grid,
  ) {
  }

  async undo(persist: ISaveGridFn) {
    this.row.columns[this.columnIndex]!.width -= this.deletedColumn!.width;
    this.row.columns.splice(this.columnIndex, 0, this.deletedColumn!);

    await persist(this.grid);
  }

  async redo(persist: ISaveGridFn) {
    const colSize = this.row.columns[this.columnIndex]!.width;

    const isLastColumn = this.columnIndex == this.row.columns.length - 1;

    this.deletedColumn = this.row.columns.splice(this.columnIndex, 1)[0];
    this.row.columns[
      isLastColumn ? this.columnIndex - 1 : this.columnIndex
      ]!.width += colSize;

    await persist(this.grid);
  }
}
