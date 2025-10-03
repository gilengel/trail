import {TextElement} from "~/components/builder/elements/text";
import {HeadingElement} from "~/components/builder/elements/heading";
import {MapElement} from "~/components/builder/elements/map";
import {ElevationProfileElement} from "~/components/builder/elements/elevation_profile";
import {ImageElement} from "~/components/builder/elements/image";
import {IntegratedEditorRegistry} from "@trail/grid-editor/editorElementRegistry";

export const globalElementRegistry = new IntegratedEditorRegistry();

export type AnyEditorElement =
    | typeof TextElement
    | typeof HeadingElement
    | typeof MapElement
    | typeof ElevationProfileElement
    | typeof ImageElement;

export const EditorElements: AnyEditorElement[] = [
    TextElement,
    HeadingElement,
    MapElement,
    ElevationProfileElement,
    ImageElement
];