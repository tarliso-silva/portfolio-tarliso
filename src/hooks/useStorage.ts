import { useState } from "react";
import { toast } from "sonner";
import { uploadImage as uploadImageService } from "@/services/storage";

/**
 * React hook wrapping the storage service.
 * Manages loading state and surfaces toast feedback.
 * For pure upload logic without React, use "@/services/storage" directly.
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
      console.error("Storage Error:", error);
      toast.error(`Erro no upload: ${message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading };
};
