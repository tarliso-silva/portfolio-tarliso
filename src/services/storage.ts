/**
 * Storage service — thin wrapper around Supabase Storage.
 *
 * Funções assíncronas sem dependências de React.
 * Use o hook React (useStorage) em componentes,
 * ou estas funções diretamente em contextos sem React (scripts, testes etc.).
 */
import { supabase } from "@/services/supabase";

export interface UploadResult {
  url: string | null;
  error: string | null;
}

/**
 * Envia uma imagem ao Supabase Storage e retorna a URL pública.
 *
 * @param file    - Objeto File enviado (deve ser uma imagem)
 * @param bucket  - Nome do bucket Supabase Storage (padrão: "portfolio")
 * @param path    - Caminho da pasta dentro do bucket (padrão: "uploads")
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

/**
 * Envia um arquivo genérico (ex: PDF) ao Supabase Storage e retorna a URL pública.
 */
export async function uploadFile(
  file: File,
  bucket = "portfolio",
  path = "uploads",
): Promise<UploadResult> {
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
