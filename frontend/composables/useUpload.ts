import type { RuntimeConfig } from "nuxt/schema";

export async function useUpload(config: RuntimeConfig, url: string, body: any) {
  await $fetch(url, {
    baseURL: config.public.baseURL,
    method: "POST",
    body,
  });
}

export type NewRouteDto = {
  name: string;
  description?: string;
  files: File[];
};

export async function useRouteUpload(config: RuntimeConfig, body: NewRouteDto) {
  const formData = useFileFormData(body.files);
  formData.append("name", body.name);

  if (body.description) {
    formData.append("description", body.description);
  }

  await useUpload(config, "api/routes/gpx", formData);
}

export function useFileFormData(
  files: File[],
  identifier: string = "files"
): FormData {
  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  return formData;
}
