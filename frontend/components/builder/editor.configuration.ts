
import {
    type EditorElementDefinition,
} from "~/components/GridEditor/editorConfiguration";
import {IntegratedEditorRegistry} from "~/components/GridEditor/editorElementRegistry";
import {TextElement} from "~/components/builder/elements/text";
import {HeadingElement} from "~/components/builder/elements/heading";
import {MapElement} from "~/components/builder/elements/map";
import {ElevationProfileElement} from "~/components/builder/elements/elevation_profile";
import {ImageElement} from "~/components/builder/elements/image";

export const globalElementRegistry = new IntegratedEditorRegistry();

export const EditorElements: EditorElementDefinition<any, any, any>[] = [
    TextElement,
    HeadingElement,
    MapElement,
    ElevationProfileElement,
    ImageElement
];