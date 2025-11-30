import * as uuid from "uuid";
import type {EditorElementDefinition} from "./definition/elementDefinition";
import {type EditorElementInstance} from "./instances/instance";

export interface EditorElementProperties<Element extends EditorElementDefinition<any, any, any, any, any>> {
    grid: Grid,
    element: EditorElementInstance<Element>,
    definition: EditorElementDefinition<Element>,

    changeable: boolean
}

export type Column = {
    id: string;
    width: number;
    element?: EditorElementInstance<any>;
    row?: Row;
}

export type Row = {
    id: string;
    columns: Column[];
}

export type Grid = {
    tripId: number;
    rows: Row[];
}

/**
 * Creates a default grid consisting out of 3 rows with 2, 3 and 2 columns.
 * Specially useful to show the user something after creating a new trip.
 * @param tripId - The id of the trip the grid is associated with.a
 * @returns A new instance of a grid with 3 rows and 2, 3 and 2 columns.
 */
export function createDefaultGrid(tripId: number): Grid {
    return {
        tripId,

        rows: [
            {
                id: uuid.v4(),
                columns: [
                    {width: 4, id: uuid.v4()},
                    {width: 8, id: uuid.v4()},
                ],
            },

            {
                id: uuid.v4(),
                columns: [
                    {width: 4, id: uuid.v4()},
                    {width: 4, id: uuid.v4()},
                    {width: 4, id: uuid.v4()},
                ],
            },

            {
                id: uuid.v4(),
                columns: [
                    {width: 6, id: uuid.v4()},
                    {width: 6, id: uuid.v4()},
                ],
            },
        ],
    };
}

