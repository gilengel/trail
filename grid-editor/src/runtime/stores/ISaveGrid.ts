import type {Grid} from "~/src/runtime/types/grid";

export interface ISaveGridFn {
  (grid: Grid): Promise<boolean>;
}
