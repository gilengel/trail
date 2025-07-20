import {ElementType} from "~/types/grid";

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