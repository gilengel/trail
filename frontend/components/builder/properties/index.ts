import {type Element} from '~/types/grid'

export interface ElementProps {
    element: Element;
    attributes: Record<string, string | number | boolean | string[]>
}