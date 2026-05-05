import { useState } from "react";
import { Mail, Send, User, MessageSquare, Github, Linkedin, Instagram, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfiles } from "@/hooks/useProfile";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";

const Contact = () => {
  const { data: profiles = [], isLoading } = useProfiles();
  const profile = profiles[0];

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);

  const email = profile?.email || "";
  const contactKey = profile?.contact_form_key || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    setIsSending(true);

    if (contactKey) {
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: contactKey,
            name: formData.name,
            email: formData.email,
            message: formData.message,
            subject: `Contato via Portfólio — ${formData.name}`,
            from_name: formData.name,
            replyto: formData.email,
          }),
        });
        const result = await response.json();
        if (result.success) {
          toast.success("Mensagem enviada com sucesso! Responderei em breve.");
          setFormData({ name: "", email: "", message: "" });
        } else {
          toast.error("Erro ao enviar mensagem. Tente novamente.");
        }
      } catch {
        toast.error("Erro de conexão. Verifique sua internet.");
      } finally {
        setIsSending(false);
      }
    } else {
      const subject = encodeURIComponent(`Contato via Portfólio — ${formData.name}`);
      const body = encodeURIComponent(
        `Nome: ${formData.name}\nEmail: ${formData.email}\n\nMensagem:\n${formData.message}`
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      setTimeout(() => {
        setIsSending(false);
        setFormData({ name: "", email: "", message: "" });
        toast.success("Cliente de email aberto!");
      }, 800);
    }
  };

  const socials = [
    profile?.linkedin_url && { href: profile.linkedin_url, Icon: Linkedin, label: "LinkedIn" },
    profile?.github_url && { href: profile.github_url, Icon: Github, label: "GitHub" },
    profile?.instagram_url && { href: profile.instagram_url, Icon: Instagram, label: "Instagram" },
  ].filter(Boolean) as { href: string; Icon: React.ElementType; label: string }[];

  return (
    <>
      <SEOHead
        title={`Contato — ${profile?.full_name || "Portfólio"}`}
        description="Entre em contato para oportunidades, projetos ou colaborações."
      />

      <main className="min-h-screen bg-background flex flex-col">
        {/* Topo */}
        <div className="container mx-auto px-4 pt-28 pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>

        {/* Conteúdo centralizado */}
        <div className="flex-1 container mx-auto px-4 pb-16 flex items-start justify-center">
          <div className="w-full max-w-2xl space-y-8">
            {/* Cabeçalho */}
            <div className="space-y-2">
              <div className="section-icon w-12 h-12 mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Vamos conversar</h1>
              <p className="text-muted-foreground">
                Aberto a oportunidades, projetos e colaborações. Responderei o mais breve possível.
              </p>
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {email}
                </a>
              )}
            </div>

            {/* Redes sociais */}
            {socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4 text-primary" />
                  </a>
                ))}
              </div>
            )}

            {/* Formulário */}
            <form
              onSubmit={handleSubmit}
              className="content-card space-y-5 p-6"
              noValidate
            >
              {/* Nome */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-secondary/40 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="Seu email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-secondary/40 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Mensagem */}
              <div className="relative">
                <div className="absolute left-4 top-4 text-muted-foreground pointer-events-none">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <textarea
                  placeholder="Sua mensagem..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-secondary/40 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending || isLoading}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar mensagem
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
