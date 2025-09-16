import type {IUndoRedoAction} from "~/stores/editor/undoredo";
import type {Grid} from "~/components/GridEditor/grid"
import type {ISaveGridFn} from "~/components/GridEditor/editorConfiguration";

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
