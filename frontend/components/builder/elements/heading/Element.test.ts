import {describe, it, expect} from 'vitest'
import HeadingComponent from '~/components/builder/elements/heading/Heading.vue'
import {mountSuspended} from "@nuxt/test-utils/runtime";

describe('Component', () => {
    describe('Heading', () => {
        it('renders', async () => {
            const component = await mountSuspended(HeadingComponent)
            expect(component.text()).toContain('Heading');
        })

        it('renders h2 based on prop', async () => {
            const component = await mountSuspended(HeadingComponent, {
                props: {level: 1}
            })
            expect(component.text()).toContain('Heading');
        })

        it('renders it black based on prop', async () => {
            const component = await mountSuspended(HeadingComponent, {
                props: {color: 'black'}
            })

            expect(component.vm.style).toBe("color: black");
        })
    })
})
