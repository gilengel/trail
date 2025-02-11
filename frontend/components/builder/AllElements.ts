import {ElementType} from "~/types/grid";

export const componentsMap = {
    [ElementType.Text]: defineAsyncComponent(() => import('@/components/builder/elements/Text.vue')),
    [ElementType.Heading]: defineAsyncComponent(() => import('@/components/builder/elements/Heading.vue')),
    [ElementType.Map]: defineAsyncComponent(() => import('@/components/builder/elements/Map.vue')),
    [ElementType.Image]: defineAsyncComponent(() => import('@/components/builder/elements/Image.vue'))
};

export const componentsPropertiesMap = {
    [ElementType.Text]: defineAsyncComponent(() => import('@/components/builder/elements/Text.vue')),
    [ElementType.Heading]: defineAsyncComponent(() => import('@/components/builder/properties/Heading.vue')),
    [ElementType.Map]: defineAsyncComponent(() => import('@/components/builder/properties/Map.vue')),
    [ElementType.Image]: defineAsyncComponent(() => import('@/components/builder/elements/Image.vue'))
};