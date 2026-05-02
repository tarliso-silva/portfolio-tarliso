/**
 * Storage service — thin wrapper around Supabase Storage.
 *
 * Pure async functions with no React dependencies.
 * Import the React hook wrapper (useStorage) for components,
 * or use these directly in non-React contexts (scripts, tests, etc).
 */
import { supabase } from "@/services/supabase";

export interface UploadResult {
  url: string | null;
  error: string | null;
}

/**
 * Uploads an image file to Supabase Storage and returns the public URL.
 *
 * @param file    - The File object to upload (must be an image)
 * @param bucket  - Supabase Storage bucket name (default: "portfolio")
 * @param path    - Folder path inside the bucket (default: "uploads")
 */
export async function uploadImage(
  file: File,
  bucket = "portfolio",
  path = "uploads",
): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    return { url: null, error: "O arquivo selecionado não é uma imagem válida." };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return { url: publicUrl, error: null };
}
