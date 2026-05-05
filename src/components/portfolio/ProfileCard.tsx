import { Github, Linkedin, MessageCircle, Instagram, MapPin } from "lucide-react";
import type React from "react";
import { useProfiles } from "@/hooks/useProfile";
import profilePhoto from "@/assets/profile-photo.jpg";

const ProfileCard = () => {
  const { data: profiles = [], isLoading } = useProfiles();
  const profile = profiles[0];
  
  const avatarUrl = profile?.avatar_url || profilePhoto;
  const profileName = profile?.full_name || "";
  const phone = profile?.phone ?? "";
  const whatsappNum = profile?.whatsapp_number || phone;
  const whatsappHref = whatsappNum ? `https://wa.me/${whatsappNum.replace(/\D/g, "")}` : "";

  const socialLinks = [
    profile?.github_url    && { icon: Github,        href: profile.github_url,    label: "GitHub" },
    profile?.linkedin_url  && { icon: Linkedin,       href: profile.linkedin_url,  label: "LinkedIn" },
    profile?.instagram_url && { icon: Instagram,      href: profile.instagram_url, label: "Instagram" },
    whatsappHref           && { icon: MessageCircle,  href: whatsappHref,          label: "WhatsApp" },
  ].filter(Boolean) as { icon: React.ElementType; href: string; label: string }[];

  if (isLoading) {
    return (
      <div className="profile-card animate-fade-up lg:sticky lg:top-8">
        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-secondary mb-2 animate-pulse" />
        <div className="h-8 bg-secondary rounded w-3/4 mt-2 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="profile-card animate-fade-up lg:sticky lg:top-8">
      {/* Imagem de perfil */}
      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-secondary mb-2 avatar-glow">
        <img
          src={avatarUrl}
          alt={profileName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Nome */}
      <h2 className="text-2xl font-bold text-foreground mt-2">{profileName}</h2>

      {/* Especialidade */}
      {profile?.current_focus && (
        <p className="text-xs text-muted-foreground mt-1 tracking-wide">
          {profile.current_focus}
        </p>
      )}

      {/* Localização */}
      {profile?.location && (
        <p className="flex items-center gap-1 text-xs text-muted-foreground/70 mt-1">
          <MapPin className="w-3 h-3" />
          {profile.location}
        </p>
      )}

      {/* Badge de disponibilidade */}
      {profile?.is_available && (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 border border-emerald-500/30 rounded-full px-2.5 py-0.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Disponível
        </span>
      )}

      {/* Links sociais */}
      <div className="flex items-center gap-3 mt-3">
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label={social.label}
          >
            <social.icon className="w-5 h-5 text-foreground transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
