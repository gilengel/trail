import {type Grid} from '../../types/grid';
import {type IUndoRedoAction} from '../undoredo';
import type {ISaveGridFn} from "../ISaveGrid";

export class MoveRow
  implements IUndoRedoAction {
  constructor(
    private oldRowIndex: number,
    private newRowIndex: number,
    private grid: Grid,
  ) {
  }

  async undo(persist: ISaveGridFn) {
    const tempRow = this.grid.rows[this.oldRowIndex]!;
    this.grid.rows[this.oldRowIndex] = this.grid.rows[this.newRowIndex]!;
    this.grid.rows[this.newRowIndex] = tempRow;

    await persist(this.grid);
  }

  async redo(persist: ISaveGridFn) {
    const tempRow = this.grid.rows[this.newRowIndex]!;
    this.grid.rows[this.newRowIndex] = this.grid.rows[this.oldRowIndex]!;
    this.grid.rows[this.oldRowIndex] = tempRow;

    await persist(this.grid);
  }
}
