import type {IUndoRedoAction} from "~/stores/editor/undoredo";
import type {Column, Row, Grid} from "~/components/GridEditor/grid"
import type {ISaveGridFn} from "~/components/GridEditor/editorConfiguration";


export class DeleteColumn
  implements IUndoRedoAction {
  private deletedColumn: Column | undefined;

  constructor(
    private row: Row,
    private columnIndex: number,
    private grid: Grid,
  ) {
  }

  async undo() {
    this.row.columns[this.columnIndex]!.width -= this.deletedColumn!.width;
    this.row.columns.splice(this.columnIndex, 0, this.deletedColumn!);
  }

  async redo() {
    const colSize = this.row.columns[this.columnIndex]!.width;

    const isLastColumn = this.columnIndex == this.row.columns.length - 1;

    this.deletedColumn = this.row.columns.splice(this.columnIndex, 1)[0];
    this.row.columns[
      isLastColumn ? this.columnIndex - 1 : this.columnIndex
      ]!.width += colSize;
  }
}
