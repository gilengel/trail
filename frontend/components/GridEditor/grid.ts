import type {EditorElementInstance} from "~/components/GridEditor/editorElementInstanceRegistry";
import type {EditorElementDefinition} from "~/components/GridEditor/editorConfiguration";

export interface EditorElementProperties<T extends EditorElementDefinition<any, any, any>> {
    grid: Grid,
    element: EditorElementInstance<T>,
    selected: boolean,
    highlighted: boolean
}

export interface Column {
    id: string;
    width: number;
    element?: EditorElementInstance<any>;
    row?: Row;
}

export interface Row {
    id: string;
    columns: Column[];
}

export interface Grid {
    tripId: number;
    rows: Row[];
}