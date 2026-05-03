import { Award, ExternalLink } from "lucide-react";
import { useCertifications } from "@/hooks/useCertifications";

const CertificationsSection = () => {
  const { data: certifications = [], isLoading } = useCertifications();

  if (isLoading) {
    return (
      <section className="mt-16">
        <div className="section-header mb-6">
          <div className="section-icon">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Certificações</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-secondary rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (certifications.length === 0) return null;

  return (
    <section className="animate-fade-up delay-500 mt-16">
      <div className="section-header">
        <div className="section-icon">
          <Award className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Certificações</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {certifications.map((cert) => {
          const inner = (
            <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 transition-all duration-200 h-full">
              {cert.image_url ? (
                <div className="w-16 h-16 flex items-center justify-center">
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-8 h-8 text-primary" />
                </div>
              )}
              <div className="text-center">
                <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                  {cert.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{cert.issuer}</p>
                {cert.issued_date && (
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{cert.issued_date}</p>
                )}
              </div>
              {cert.credential_url && (
                <ExternalLink className="w-3 h-3 text-primary/60 mt-auto" />
              )}
            </div>
          );

          return cert.credential_url ? (
            <a
              key={cert.id}
              href={cert.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver credencial: ${cert.title}`}
            >
              {inner}
            </a>
          ) : (
            <div key={cert.id}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
};

export default CertificationsSection;
