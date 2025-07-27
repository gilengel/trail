import type {TextProperties} from "~/components/builder/elements/text/Properties";
import type {MapProperties} from "~/components/builder/elements/map/Properties";
import {Element, ElementType} from "~/types/grid";
import {v4 as uuidv4} from "uuid";
import type {ElevationProfileProperties} from "~/components/builder/elements/elevation_profile/Properties";
import type {HeadingProperties} from "~/components/builder/elements/heading/Properties";
import {ImagePosition, type ImageProperties, ImageSize} from "~/components/builder/elements/image/Properties";


export const componentsMap = {
    [ElementType.Text]: defineAsyncComponent(() => import('~/components/builder/elements/text/Element.vue')),
    [ElementType.Heading]: defineAsyncComponent(() => import('~/components/builder/elements/heading/Element.vue')),
    [ElementType.Map]: defineAsyncComponent(() => import('~/components/builder/elements/map/Element.vue')),
    [ElementType.Image]: defineAsyncComponent(() => import('~/components/builder/elements/image/Element.vue')),
    [ElementType.ElevationProfile]: defineAsyncComponent(() => import('~/components/builder/elements/elevation_profile/Element.vue')),
};

export const componentsPropertiesMap = {
    [ElementType.Text]: defineAsyncComponent(() => import('~/components/builder/elements/text/Element.vue')),
    [ElementType.Heading]: defineAsyncComponent(() => import('~/components/builder/elements/heading/Properties.vue')),
    [ElementType.Map]: defineAsyncComponent(() => import('~/components/builder/elements/map/Properties.vue')),
    [ElementType.Image]: defineAsyncComponent(() => import('~/components/builder/elements/image/Properties.vue')),
    [ElementType.ElevationProfile]: defineAsyncComponent(() => import('~/components/builder/elements/elevation_profile/Properties.vue')),
};

interface PropertiesMap {
    [ElementType.Text]: TextProperties,
    [ElementType.Heading]: HeadingProperties,
    [ElementType.Map]: MapProperties,
    [ElementType.Image]: ImageProperties,
    [ElementType.ElevationProfile]: ElevationProfileProperties,
}

const defaultAttributesMap: {
    [K in ElementType]: PropertiesMap[K];
} = {
    [ElementType.Text]: {text: 'Hello World'},
    [ElementType.Heading]: {level: 0, color: '#000', text: 'Heading', alignment: 'left'},
    [ElementType.Map]: {},
    [ElementType.Image]: {
        scale: {origin: {x: 0, y: 0}, value: 1},
        aspectRatio: 1,
        sizeType: ImageSize.Free,
        positionType: ImagePosition.Free
    },
    [ElementType.ElevationProfile]: {},
};

const defaultProvidedPropertiesMap: {
    [K in ElementType]: readonly (keyof PropertiesMap[K])[];
} = {
    [ElementType.Text]: [],
    [ElementType.Heading]: [],
    [ElementType.Map]: ["routeId", "segmentsIds"],
    [ElementType.Image]: [],
    [ElementType.ElevationProfile]: ["routeId", "segmentsIds"],
};

const defaultConsumedPropertiesMap: {
    [K in ElementType]: readonly (keyof PropertiesMap[K])[];
} = {
    [ElementType.Text]: [],
    [ElementType.Heading]: [],
    [ElementType.Map]: ["routeId", "segmentsIds"],
    [ElementType.Image]: [],
    [ElementType.ElevationProfile]: ["routeId", "segmentsIds"],
};

export function createElement<T extends ElementType>(
    type: T
): Element<
    PropertiesMap[T],
    typeof defaultProvidedPropertiesMap[T],
    typeof defaultConsumedPropertiesMap[T]
> {
    const id = uuidv4();

    const attributes = defaultAttributesMap[type];
    const providedProperties = defaultProvidedPropertiesMap[type];
    const consumedProperties = defaultConsumedPropertiesMap[type];

    return new Element(
        id,
        type,
        attributes,
        providedProperties,
        consumedProperties
    );
}
