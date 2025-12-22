import type {Color} from "~/types/color";

export type LineStyle = {
    width: number;
    color: Color;
    join?: "round" | "bevel" | "miter";
    cap?: "butt" | "round" | "square";
};
