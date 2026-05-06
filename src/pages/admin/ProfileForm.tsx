import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProfiles } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Switch } from "@/components/ui/switch";
import { useStorage } from "@/hooks/useStorage";
import { FileText, Upload, X, Loader2, ExternalLink } from "lucide-react";

export default function ProfileForm() {
  const navigate = useNavigate();
  const { data: profiles = [], isLoading, updateProfile, isUpdating } = useProfiles();
  const { uploadFile, isUploading: isUploadingCV } = useStorage();
  const cvInputRef = useRef<HTMLInputElement>(null);

  const profile = profiles[0];
  
  const [formData, setFormData] = useState({
    full_name: "",
    bio_summary: "",
    phone: "",
    email: "",
    avatar_url: "",
    location: "",
    current_focus: "",
    about_title: "",
    cv_url: "",
    favicon_url: "",
    hero_title: "",
    stat_1_number: "",
    stat_1_label: "",
    stat_2_number: "",
    stat_2_label: "",
    hero_phrase_start: "",
    hero_phrase_strike: "",
    hero_phrase_end: "",
    contact_form_key: "",
    navbar_icon: "Database",
    linkedin_url: "",
    github_url: "",
    instagram_url: "",
    whatsapp_number: "",
    is_available: false,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        bio_summary: profile.bio_summary || "",
        phone: profile.phone || "",
        email: profile.email || "",
        avatar_url: profile.avatar_url || "",
        location: profile.location || "",
        current_focus: profile.current_focus || "",
        about_title: profile.about_title || "",
        cv_url: profile.cv_url || "",
        favicon_url: profile.favicon_url || "",
        og_image_url: profile.og_image_url || "",
        hero_title: profile.hero_title || "",
        stat_1_number: profile.stat_1_number || "",
        stat_1_label: profile.stat_1_label || "",
        stat_2_number: profile.stat_2_number || "",
        stat_2_label: profile.stat_2_label || "",
        hero_phrase_start: profile.hero_phrase_start || "",
        hero_phrase_strike: profile.hero_phrase_strike || "",
        hero_phrase_end: profile.hero_phrase_end || "",
        contact_form_key: profile.contact_form_key || "",
        navbar_icon: profile.navbar_icon || "Database",
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        instagram_url: profile.instagram_url || "",
        whatsapp_number: profile.whatsapp_number || "",
        is_available: profile.is_available ?? false,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (profile) {
        await updateProfile({
          ...profile,
          ...formData,
          linkedin_url:    formData.linkedin_url    || null,
          github_url:      formData.github_url      || null,
          instagram_url:   formData.instagram_url   || null,
          whatsapp_number: formData.whatsapp_number || null,
          is_available:    formData.is_available,
        });
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl animate-fade-up">
      <Card>
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* INFORMAÇÕES PESSOAIS */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Informações Pessoais</h3>
              <div>
                <label className="text-sm font-medium text-foreground">Nome Completo</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Seu nome"
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Localização</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Cidade, UF"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Foco Atual</label>
                  <Input
                    value={formData.current_focus}
                    onChange={(e) => setFormData({ ...formData, current_focus: e.target.value })}
                    placeholder="Foco atual"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/30">
                <div>
                  <p className="text-sm font-medium text-foreground">Disponível para oportunidades</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Exibe um badge verde pulsante no card de perfil</p>
                </div>
                <Switch
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
              </div>
            </div>

            {/* CONTATO */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Telefone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Telefone"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">CV (PDF para Download)</label>
                <div className="mt-1 space-y-2">
                  {formData.cv_url ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/20">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">CV enviado</p>
                        <a
                          href={formData.cv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          Visualizar PDF <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setFormData({ ...formData, cv_url: "" })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => cvInputRef.current?.click()}
                      className="w-full h-28 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/30 transition-colors bg-secondary/10"
                    >
                      {isUploadingCV ? (
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <p className="text-sm font-medium">Clique para enviar seu CV</p>
                          <p className="text-xs text-muted-foreground">PDF até 5MB</p>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={cvInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await uploadFile(file, "portfolio", "cv");
                      if (url) setFormData({ ...formData, cv_url: url });
                      e.target.value = "";
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  O PDF ficará armazenado no Supabase e será usado no botão "Baixar CV" da página inicial.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Chave de Acesso Web3Forms (Para o Form de Contato)</label>
                <Input
                  value={formData.contact_form_key}
                  onChange={(e) => setFormData({ ...formData, contact_form_key: e.target.value })}
                  placeholder="Sua chave de acesso do Web3Forms"
                  className="mt-1"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Para que o formulário de contato envie e-mails diretamente, crie uma chave gratuita em <a href="https://web3forms.com/" target="_blank" className="text-primary hover:underline">web3forms.com</a>.
                </p>
              </div>
            </div>

            {/* TEXTOS E PÁGINAS */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Textos das Páginas</h3>
              <div>
                <label className="text-sm font-medium text-foreground">Título Principal da Home (Hero)</label>
                <Input
                  value={formData.hero_title}
                  onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                  placeholder="Ex: Eu sou Tarliso,"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Bio Resumida (Página Inicial)</label>
                <Textarea
                  value={formData.bio_summary}
                  onChange={(e) => setFormData({ ...formData, bio_summary: e.target.value })}
                  placeholder="Resumo da sua bio"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Título da Página Sobre</label>
                <Input
                  value={formData.about_title}
                  onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
                  placeholder="Título da página Sobre"
                  className="mt-1"
                />
              </div>
            </div>

            {/* ESTATÍSTICAS E FRASE (HERO) */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Estatísticas e Frase (Hero)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Estatística 1 (Número)</label>
                  <Input
                    value={formData.stat_1_number}
                    onChange={(e) => setFormData({ ...formData, stat_1_number: e.target.value })}
                    placeholder="Ex: +15"
                  />
                  <label className="text-sm font-medium text-foreground">Estatística 1 (Label)</label>
                  <Input
                    value={formData.stat_1_label}
                    onChange={(e) => setFormData({ ...formData, stat_1_label: e.target.value })}
                    placeholder="Ex: Projetos Ativos"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Estatística 2 (Número)</label>
                  <Input
                    value={formData.stat_2_number}
                    onChange={(e) => setFormData({ ...formData, stat_2_number: e.target.value })}
                    placeholder="Ex: 5+"
                  />
                  <label className="text-sm font-medium text-foreground">Estatística 2 (Label)</label>
                  <Input
                    value={formData.stat_2_label}
                    onChange={(e) => setFormData({ ...formData, stat_2_label: e.target.value })}
                    placeholder="Ex: Anos de Experiência"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-foreground">Frase do Hero (Efeito de Risco)</label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={formData.hero_phrase_start}
                    onChange={(e) => setFormData({ ...formData, hero_phrase_start: e.target.value })}
                    placeholder="Ex: Dados são o"
                  />
                  <Input
                    value={formData.hero_phrase_strike}
                    onChange={(e) => setFormData({ ...formData, hero_phrase_strike: e.target.value })}
                    placeholder="Ex: futuro"
                  />
                  <Input
                    value={formData.hero_phrase_end}
                    onChange={(e) => setFormData({ ...formData, hero_phrase_end: e.target.value })}
                    placeholder="Ex: presente."
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  A frase será montada como: [Início] [Riscado] [Fim]
                </p>
              </div>
            </div>

            {/* REDES SOCIAIS */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Redes Sociais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">LinkedIn</label>
                  <Input
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/seu-perfil"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">GitHub</label>
                  <Input
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/seu-usuario"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Instagram</label>
                  <Input
                    value={formData.instagram_url}
                    onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                    placeholder="https://instagram.com/seu-perfil"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">WhatsApp (número)</label>
                  <Input
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    placeholder="5511999999999 (com DDI e DDD, sem espaços)"
                    className="mt-1"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Apenas dígitos com DDI (ex: 5511987654321). O link wa.me será gerado automaticamente.
                  </p>
                </div>
              </div>
            </div>

            {/* MÍDIA & BRANDING */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Mídia & Branding</h3>
              <div>
                <ImageUpload
                  label="Foto de Perfil (Avatar)"
                  value={formData.avatar_url}
                  onChange={(url) => setFormData({ ...formData, avatar_url: url })}
                  path="profile"
                />
              </div>
              
              <div className="pt-4">
                <ImageUpload
                  label="Favicon do Site"
                  value={formData.favicon_url}
                  onChange={(url) => setFormData({ ...formData, favicon_url: url })}
                  path="favicon"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Envie uma imagem PNG (idealmente 512×512px) para usar como ícone do site no navegador.
                </p>
              </div>

              <div>
                <ImageUpload
                  label="Logo da Navbar"
                  value={formData.navbar_icon}
                  onChange={(url) => setFormData({ ...formData, navbar_icon: url })}
                  path="navbar-logo"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Envie sua logo (PNG transparente recomendado). Aparece no canto superior esquerdo da navegação.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Imagem de Compartilhamento (OG Image)</label>
                <div className="mt-1 flex gap-2 items-start">
                  <input
                    type="url"
                    value={formData.og_image_url}
                    onChange={(e) => setFormData({ ...formData, og_image_url: e.target.value })}
                    placeholder="https://... (URL da imagem para WhatsApp, LinkedIn, Twitter)"
                    className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  {formData.navbar_icon?.startsWith("http") && (
                    <button
                      type="button"
                      className="h-10 px-3 rounded-md border border-primary/40 bg-primary/5 text-xs text-primary hover:bg-primary/10 transition-colors whitespace-nowrap"
                      onClick={() => setFormData({ ...formData, og_image_url: formData.navbar_icon })}
                    >
                      Usar logo da navbar
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Cole aqui o URL público da sua imagem (mín. 1200×630px recomendado). Será exibida no preview ao compartilhar no WhatsApp, LinkedIn e Twitter.
                  Após salvar, vá em <strong>Vercel &rsaquo; Settings &rsaquo; Environment Variables</strong> e adicione <code className="text-primary">VITE_OG_IMAGE_URL</code> com este mesmo valor para garantir que bots vejam a imagem correta.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-6 border-t border-border">
              <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto">
                {isUpdating ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
