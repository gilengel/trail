import {describe, expect, it} from 'vitest';
import {mountSuspended} from "@nuxt/test-utils/runtime";
import ScaleTypeComponent from '@/components/builder/elements/image/types/Scale.vue';
import {DefaultImageScale} from "~/components/builder/elements/image/Properties";

const VSliderStub = defineComponent({
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: `<input data-testid="editor-scale-slider"/>`
})

const VNumberInputStub = defineComponent({
    name: 'VNumberInput',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: `
      <div data-testid="editor-scale-input"></div>`
})

describe('GridEditor', () => {
    describe('Types', () => {
        describe('Scale', () => {
            it('emits "update:modelValue" when a size was selected', async () => {
                const wrapper = await mountSuspended(ScaleTypeComponent, {
                    props: {
                        config: {
                            type: 'custom',
                            label: 'size'
                        },
                        propertyKey: '',
                        modelValue: DefaultImageScale
                    }
                });
                expect(wrapper.exists()).toBeTruthy();

                const button = wrapper!.find('[data-testid="editor-scale-slider"]');
                expect(button.exists()).toBe(true);
            });

            it('updates the scale by using the number input', async () => {
                const wrapper = await mountSuspended(ScaleTypeComponent, {
                    props: {
                        config: {
                            type: 'custom',
                            label: 'size'
                        },
                        propertyKey: '',
                        modelValue: DefaultImageScale
                    },
                    global: {
                        stubs: {
                            VNumberInput: VNumberInputStub
                        }
                    }
                })

                const input = wrapper.findComponent(VNumberInputStub)
                expect(input.exists()).toBe(true)
                input.vm.$emit('update:modelValue', 1.25)

                const emitted = wrapper.emitted('update:modelValue')
                expect(emitted).toBeTruthy()
                expect(emitted![0][0]).toEqual({
                    ...DefaultImageScale,
                    value: 1.25
                })
            })

            describe('Slider', () => {
                const global = {
                    stubs: {
                        VSlider: VSliderStub,
                    }
                }

                it('updates successfully the scale by using the slider', async () => {
                    const wrapper = await mountSuspended(ScaleTypeComponent, {
                        props: {
                            config: {
                                type: 'custom',
                                label: 'size'
                            },
                            propertyKey: '',
                            modelValue: DefaultImageScale
                        },

                        global
                    });
                    expect(wrapper.exists()).toBeTruthy();

                    const slider = wrapper!.findComponent(VSliderStub)
                    expect(slider.exists()).toBe(true)
                    slider.vm.$emit('update:modelValue', 1.5)

                    const emitted = wrapper!.emitted('update:modelValue')
                    expect(emitted).toBeTruthy()
                    expect(emitted![0][0]).toEqual({
                        ...DefaultImageScale,
                        value: 1.5
                    })
                });

                it('updates with default value if used an undefined value', async () => {
                    const wrapper = await mountSuspended(ScaleTypeComponent, {
                        // @ts-ignore necessary to simulate wrong configuration by the developer as we ignore
                        // the mandatory modelValue property.
                        props: {
                            config: {
                                type: 'custom',
                                label: 'size'
                            },
                            propertyKey: '',
                        },

                        global
                    });

                    const slider = wrapper!.findComponent(VSliderStub)
                    expect(slider.exists()).toBe(true)
                    slider.vm.$emit('update:modelValue', undefined)

                    const emitted = wrapper.emitted('update:modelValue')
                    expect(emitted).toBeTruthy()
                    expect(emitted![0][0]).toEqual(DefaultImageScale)
                });
            })
        })
    });
});
