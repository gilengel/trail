import {TextElement} from "~/components/builder/elements/text";
import {HeadingElement} from "~/components/builder/elements/heading";
import {MapElement} from "~/components/builder/elements/map";
import {ElevationProfileElement} from "~/components/builder/elements/elevation_profile";
import {ImageElement} from "~/components/builder/elements/image";
import {IntegratedEditorRegistry} from "@trail/grid-editor/editorElementRegistry";
import type {EditorElementDefinition} from "@trail/grid-editor/editorConfiguration";

export const globalElementRegistry = new IntegratedEditorRegistry();

export const EditorElements: EditorElementDefinition<any, any, any>[] = [
    TextElement,
    HeadingElement,
    MapElement,
    ElevationProfileElement,
    ImageElement
];