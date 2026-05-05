import { useState } from "react";
import { toast } from "sonner";
import { uploadImage as uploadImageService, uploadFile as uploadFileService } from "@/services/storage";

/**
 * Hook React que encapsula o serviço de storage.
 * Gerencia estado de carregamento e mensagens por toast.
 * Para upload sem React, use "@/services/storage" diretamente.
 */
export const useStorage = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (
    file: File,
    bucket = "portfolio",
    path = "uploads",
  ): Promise<string | null> => {
    setIsUploading(true);
    try {
      const { url, error } = await uploadImageService(file, bucket, path);
      if (error) throw new Error(error);
      toast.success("Upload realizado com sucesso!");
      return url;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro no storage:", error);
      toast.error(`Erro no upload: ${message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFile = async (
    file: File,
    bucket = "portfolio",
    path = "uploads",
  ): Promise<string | null> => {
    setIsUploading(true);
    try {
      const { url, error } = await uploadFileService(file, bucket, path);
      if (error) throw new Error(error);
      toast.success("Upload realizado com sucesso!");
      return url;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro no storage:", error);
      toast.error(`Erro no upload: ${message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, uploadFile, isUploading };
};
