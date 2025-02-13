import {describe, it, expect} from 'vitest'
import ImageComponent from '@/components/builder/elements/Image.vue'
import {mountSuspended} from "@nuxt/test-utils/runtime";

describe('Component', () => {
    describe('Image', () => {
        it('renders', async () => {
            const component = await mountSuspended(ImageComponent)

            expect(component.find('[data-testid="element-img"]').exists()).toBeTruthy();
        })
    })
})
