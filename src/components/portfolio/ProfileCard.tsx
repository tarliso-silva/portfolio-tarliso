import { Github, Linkedin, MessageCircle } from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";
import profilePhoto from "@/assets/profile-photo.jpg";

const socialLinks = [
  { icon: Github, href: "https://github.com/tarlisodoria", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/tarlisodoria", label: "LinkedIn" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
];

const ProfileCard = () => {
  const { data: profiles = [], isLoading } = useProfiles();
  const profile = profiles[0];
  
  const avatarUrl = profile?.avatar_url || profilePhoto;
  const profileName = profile?.full_name || "";

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
      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-secondary mb-2">
        <img
          src={avatarUrl}
          alt={profileName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Nome */}
      <h2 className="text-2xl font-bold text-foreground mt-2">{profileName}</h2>

      {/* Links sociais */}
      <div className="flex items-center gap-3 mt-2">
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
