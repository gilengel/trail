import {type Element} from '~/models/Grid'

export interface HeadingProps {
    element: Element;
    attributes: Record<string, string | number | boolean>
}