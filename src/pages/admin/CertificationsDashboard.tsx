import { Link } from "react-router-dom";
import { useCertifications } from "@/hooks/useCertifications";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CertificationsDashboard() {
  const { data: certifications = [], isLoading, deleteCertification } = useCertifications();

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar esta certificação?")) {
      await deleteCertification(id);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando dados...</div>;
  }

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Certificações</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas certificações e credenciais.</p>
        </div>
        <Link to="/admin/certifications/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Certificação
          </Button>
        </Link>
      </div>

      <div className="bg-secondary/30 rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Título</th>
                <th className="px-6 py-4 font-medium">Emissor</th>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium">Credencial</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {certifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma certificação cadastrada.
                  </td>
                </tr>
              ) : (
                certifications.map((cert) => (
                  <tr key={cert.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {cert.image_url && (
                          <img
                            src={cert.image_url}
                            alt={cert.title}
                            className="w-10 h-10 rounded object-contain bg-secondary"
                          />
                        )}
                        <span className="font-medium text-foreground">{cert.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">{cert.issuer}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {cert.issued_date || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {cert.credential_url ? (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                        >
                          Ver <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/certifications/${cert.id}`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(cert.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
