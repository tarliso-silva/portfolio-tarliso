import { useState } from "react";
import type React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, FolderOpen, User, BookOpen, Mail } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useProfiles } from "@/hooks/useProfile";
import { useCustomPages } from "@/hooks/useCustomPages";
import { useContents } from "@/hooks/useContents";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/#contact") return false;
    return location.pathname === path;
  };

  const { data: profiles = [] } = useProfiles();
  const profile = profiles[0];
  const { data: customPages = [] } = useCustomPages();
  const { data: contents = [] } = useContents();

  const hasBlogPosts = contents.length > 0;

  const navItems = [
    { path: "/", label: "Início", icon: Home },
    { path: "/projects", label: "Portfólio", icon: FolderOpen },
    { path: "/about", label: "Sobre", icon: User },
    ...(hasBlogPosts ? [{ path: "/blog", label: "Blog", icon: BookOpen }] : []),
    { path: "/#contact", label: "Contato", icon: Mail, isAnchor: true },
  ] as { path: string; label: string; icon: React.ElementType; isAnchor?: boolean }[];

  const iconName = profile?.navbar_icon || "Database";
  const DynamicIcon = (iconName in LucideIcons ? LucideIcons[iconName as keyof typeof LucideIcons] : null) as React.ElementType | null ?? LucideIcons.Database;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground group">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
              <DynamicIcon className="w-4 h-4 text-primary" />
            </div>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) =>
              item.isAnchor ? (
                <a
                  key={item.path}
                  href={item.path}
                  className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
            {customPages.map((page) => (
              <Link
                key={page.id}
                to={`/p/${page.slug}`}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(`/p/${page.slug}`)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return item.isAnchor ? (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            {customPages.map((page) => (
              <Link
                key={page.id}
                to={`/p/${page.slug}`}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive(`/p/${page.slug}`)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <LucideIcons.FileText className="w-5 h-5" />
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;