import {Node, mergeAttributes} from '@tiptap/core'

export const DynamicParagraph = Node.create({
    name: 'dynamicParagraph',

    group: 'block',

    content: 'inline*',

    defining: true,

    addAttributes() {
        return {
            level: {
                default: 1,
                parseHTML: element => parseInt(element.tagName[1]) || 1,
                renderHTML: attributes => {
                    return {
                        'data-level': attributes.level,
                    }
                },
            },

            textAlign: {
                default: null,
                parseHTML: element => element.style.textAlign || null,
                renderHTML: attrs => {
                    if (!attrs.textAlign) {
                        return {}
                    }
                    return {style: `text-align: ${attrs.textAlign}`}
                },
            },
        }
    },

    parseHTML() {
        return [
            {tag: 'h1'},
            {tag: 'h2'},
            {tag: 'h3'},
            {tag: 'h4'},
            {tag: 'h5'},
            {tag: 'h6'},
        ]
    },

    renderHTML({node, HTMLAttributes}) {
        console.log(mergeAttributes(HTMLAttributes))
        const level = node.attrs.level
        return [
            `h${level}`,
            mergeAttributes(HTMLAttributes),
            0,
        ]
    },
})