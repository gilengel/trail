import {describe, it, expect, vi} from 'vitest';
import {mockFile} from "~/tests/util";
import {useUpload} from "~/composables/useUpload";
import * as useUploadModule from '@/composables/useUpload';

vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({message: 'mocked response'}));


describe('Composables[Upload]', () => {

    it('calls $fetch when uploading', async () => {
        await useUpload("test", {});

        expect($fetch).toHaveBeenCalledOnce();
        expect($fetch).toHaveBeenCalledWith("test", {"body": {}, "method": "POST"});
    });


    // warning: this is not really clean and will call useUpload - but partial mock did not work
    //          and I didn't want to refactor the module as both functions are closely related.
    it('adds the description to a route if not provided', async () => {
        const mockedFile = mockFile("gpx", 512);
        await useUploadModule.useRouteUpload("test", [mockedFile], "some description");

        expect($fetch).toHaveBeenCalledOnce();
        expect($fetch).toHaveBeenCalledWith("api/routes/gpx", {"body": {}, "method": "POST"});
    });

    it('groups multiple files into the correct form data', async () => {
        const result = useFileFormData([mockFile("gpx", 512), mockFile("gpx", 1024)]);

        expect(result.getAll("files").length).toBe(2);
    });

});
