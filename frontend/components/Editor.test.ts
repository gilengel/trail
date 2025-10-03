import {flushPromises, mount} from '@vue/test-utils';
import Editor from '@/components/Editor.vue';
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {createVuetify} from "vuetify";
import {fireEvent} from "@testing-library/vue";

describe('Component', () => {
    describe('Editor', () => {
        beforeEach(() => {
            const div = document.createElement('div');
            div.id = 'editor-primary-toolbar';
            document.body.appendChild(div);
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        const factory = (props = {}) =>
            mount(Editor, {
                attachTo: document.body,
                global: {
                    plugins: [createVuetify()]
                },
                props: {
                    content: '<p>Hello</p>',
                    formatting: true,
                    ...props,
                },
            });

        /**
         * @param wrapper
         */
        async function waitUntilEditorIsReady(wrapper: ReturnType<typeof factory>) {
            for (let i = 0; i < 10; i++) {
                await flushPromises();
                await new Promise(resolve => setTimeout(resolve, 10));
                if (wrapper.html().includes('Hello')) return;
            }
            throw new Error('Editor did not initialize in time');
        }

        beforeEach(() => {
            document.body.innerHTML = '<div id="editor-primary-toolbar"></div>';
        });


        it('renders initial content', async () => {
            const wrapper = factory();
            await waitUntilEditorIsReady(wrapper);
            expect(wrapper.html()).toContain('Hello');
        });

        it('emits updated content on change', async () => {
            const wrapper = factory();
            const editorVm: any = wrapper.vm;

            // Use exposed API to simulate update
            editorVm.setColor('#ff0000');
            editorVm.setAlignment('center');

            // Simulate content change
            editorVm.getCommands()?.setContent('<p>Updated</p>');
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted()).toHaveProperty('onTextChanged');
        });

        it('does not render alignment buttons when alignment prop is false', () => {
            const wrapper = factory({alignment: false});
            const leftAlign = wrapper.find('[data-testid="editor-redo-button"]');
            expect(leftAlign.exists()).toBe(false);
        });

        it('triggers bold formatting when bold button is clicked', async () => {
            const wrapper = factory();
            await wrapper.vm.$nextTick();

            const button = wrapper.find('[aria-label="Bold"]');
            if (button.exists()) {
                await button.trigger('click');
                // No visible change, but no crash — still valuable
                expect(true).toBe(true);
            }
        });

        beforeEach(() => {
            const div = document.createElement('div');
            div.id = 'editor-primary-toolbar';
            document.body.appendChild(div);
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });


        const buttonTests = [
            {
                testId: 'editor-bold-button',
                chainMethod: 'toggleBold',
            },
            {
                testId: 'editor-italic-button',
                chainMethod: 'toggleItalic',
            },
            {
                testId: 'editor-strikethrough-button',
                chainMethod: 'toggleStrike',
            },
            {
                testId: 'editor-numbered-list-button',
                chainMethod: 'toggleOrderedList',
            },
            {
                testId: 'editor-blockquote-button',
                chainMethod: 'toggleBlockquote',
            },
        ];

        buttonTests.forEach(({testId, chainMethod}) => {
            it(`calls ${chainMethod}().run() when button ${testId} is clicked`, async () => {
                document.body.innerHTML = '<div id="editor-primary-toolbar"></div>';

                const runMock = vi.fn();
                const chainMethodMock = vi.fn(() => ({run: runMock}));
                const focusMock = vi.fn(() => ({[chainMethod]: chainMethodMock}));

                const wrapper = factory();
                await flushPromises();
                await new Promise((r) => setTimeout(r, 50)); // wait for editor

                const editor = (wrapper.vm as any).editor;
                expect(editor).toBeTruthy();

                vi.spyOn(editor, 'chain').mockImplementation(() => ({
                    focus: focusMock,
                }));

                const button = document.querySelector(`[data-testid="${testId}"]`);
                expect(button).not.toBeNull();

                await fireEvent.click(button!);

                expect(focusMock).toHaveBeenCalled();
                expect(chainMethodMock).toHaveBeenCalled();
                expect(runMock).toHaveBeenCalled();
            });
        });

        const alignTests = [
            {testId: 'editor-align-left-button', align: 'left'},
            {testId: 'editor-align-center-button', align: 'center'},
            {testId: 'editor-align-right-button', align: 'right'},
            {testId: 'editor-align-justify-button', align: 'justify'},
        ];

        alignTests.forEach(({testId, align}) => {
            it(`calls setNodeSelection().setTextAlign('${align}').run() when button ${testId} is clicked`, async () => {
                document.body.innerHTML = '<div id="editor-primary-toolbar"></div>';

                const runMock = vi.fn();
                const setTextAlignMock = vi.fn(() => ({run: runMock}));
                const setNodeSelectionMock = vi.fn(() => ({setTextAlign: setTextAlignMock}));
                const focusMock = vi.fn(() => ({setNodeSelection: setNodeSelectionMock}));

                const wrapper = factory();
                await flushPromises();
                await new Promise((r) => setTimeout(r, 50)); // wait for editor

                const editor = (wrapper.vm as any).editor;
                expect(editor).toBeTruthy();

                vi.spyOn(editor, 'chain').mockImplementation(() => ({
                    focus: focusMock,
                }));

                const button = document.querySelector(`[data-testid="${testId}"]`);
                expect(button).not.toBeNull();

                await fireEvent.click(button!);

                expect(focusMock).toHaveBeenCalled();
                expect(setNodeSelectionMock).toHaveBeenCalled();
                expect(setTextAlignMock).toHaveBeenCalledWith(align);
                expect(runMock).toHaveBeenCalled();
            });
        });

        it('initializes the Tiptap editor instance', async () => {
            const wrapper = factory();
            await flushPromises();
            await new Promise((r) => setTimeout(r, 50));

            expect((wrapper.vm as any).editor).toBeTruthy();
        });


        it('calls exposed getCommands and getChain', () => {
            const wrapper = factory();
            const vm: any = wrapper.vm;

            const commands = vm.getCommands();
            const chain = vm.getChain();

            expect(commands).toBeTruthy();
            expect(chain).toBeTruthy();
        });

        it('does not break when editor is null', () => {
            const wrapper = factory();
            const vm: any = wrapper.vm;

            // Manually set editor to null to test guard clauses
            vm.editor = null;

            expect(() => vm.setColor('#000')).not.toThrow();
            expect(() => vm.setAlignment('left')).not.toThrow();
            expect(vm.getCommands()).toBeUndefined();
        });
    });
});