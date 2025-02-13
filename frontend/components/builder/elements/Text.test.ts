import {describe, it, expect} from 'vitest'
import TextComponent from '@/components/builder/elements/Text.vue'
import {mountSuspended} from "@nuxt/test-utils/runtime";

describe('Component', () => {
    describe('Text', () => {
        it('renders', async () => {
            const component = await mountSuspended(TextComponent)
            expect(component.text()).toContain('Text');
        })
    })
})
