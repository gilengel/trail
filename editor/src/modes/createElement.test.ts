import {describe, it, expect} from 'vitest'
import {CreateElement} from "./createElement";


describe('CreateElement', () => {
    describe('sets meta information correctly on creation', () => {
        it('sets meta property correctly', () => {
            const createElement = new CreateElement();
            createElement.activate({test: "value"});

            expect(createElement.getMeta()).toStrictEqual({test: "value"});
        })
    })
})