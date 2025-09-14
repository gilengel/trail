import type {Grid} from "~/types/grid";

export interface ISaveGridFn {
    (grid: Grid): Promise<boolean>;
}