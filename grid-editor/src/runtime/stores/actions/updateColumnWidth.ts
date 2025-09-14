import type {Column} from "../../types/grid";
import type {IUndoRedoAction} from "../../stores/undoredo";

/**
 * Updates the column width. This is an undo/redoable action.
 */
export class UpdateColumnWidth
  implements IUndoRedoAction {
  private readonly oldWidth: number;

  constructor(
    private column: Column,
    private newWidth: number,
  ) {
    this.oldWidth = column.width;
  }

  async undo() {
    this.column.width = this.oldWidth;
  }

  async redo() {
    this.column.width = this.newWidth;
  }
}
