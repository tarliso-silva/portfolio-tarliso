import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCertification, useCertifications } from "@/hooks/useCertifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function CertificationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: cert, isLoading } = useCertification(id);
  const { createCertification, updateCertification, isCreating, isUpdating } = useCertifications();

  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    image_url: "",
    credential_url: "",
    issued_date: "",
    display_order: 0,
  });

  useEffect(() => {
    if (cert) {
      setFormData({
        title: cert.title || "",
        issuer: cert.issuer || "",
        image_url: cert.image_url || "",
        credential_url: cert.credential_url || "",
        issued_date: cert.issued_date || "",
        display_order: cert.display_order ?? 0,
      });
    }
  }, [cert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && cert) {
        await updateCertification({ ...cert, ...formData });
      } else {
        await createCertification(formData);
      }
      navigate("/admin/certifications");
    } catch (error) {
      console.error("Erro ao salvar certificação:", error);
    }
  };

  if (isEditing && isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando...</div>;
  }

  const isSaving = isCreating || isUpdating;

  return (
    <div className="max-w-2xl animate-fade-up">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/certifications")}>
          ← Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Certificação" : "Nova Certificação"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Microsoft Certified: Power BI Data Analyst Associate"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuer">Emissor *</Label>
              <Input
                id="issuer"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="Ex: Microsoft"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Imagem / Logo</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                path="certifications"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credential_url">URL da Credencial</Label>
              <Input
                id="credential_url"
                type="url"
                value={formData.credential_url}
                onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                placeholder="https://learn.microsoft.com/..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issued_date">Data de Emissão</Label>
                <Input
                  id="issued_date"
                  value={formData.issued_date}
                  onChange={(e) => setFormData({ ...formData, issued_date: e.target.value })}
                  placeholder="Ex: Mai 2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Ordem</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving
                  ? "Salvando..."
                  : isEditing
                  ? "Salvar Alterações"
                  : "Criar Certificação"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/certifications")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
