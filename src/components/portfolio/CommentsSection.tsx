import { useState } from "react";
import {
  ThumbsUp, ThumbsDown, Send, LogIn, LogOut,
  MessageSquare, Trash2, Github, Chrome,
  Heart, Reply, Link2, Check, X,
} from "lucide-react";
import {
  usePublicAuth,
  useProjectComments,
  useProjectReactions,
  useCommentLikes,
} from "@/hooks/useProjectComments";
import { toast } from "sonner";

/* ── Avatar ───────────────────────────────────────────────────── */
const Avatar = ({ src, name }: { src?: string; name: string }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 text-primary text-xs font-bold uppercase">
      {name.charAt(0)}
    </div>
  );
};

/* ── Botão de reação ──────────────────────────────────────────── */
const ReactionBtn = ({
  icon: Icon,
  count,
  active,
  label,
  onClick,
  disabled,
  activeColor,
}: {
  icon: React.ElementType;
  count: number;
  active: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  activeColor: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 text-sm font-medium
      ${active
        ? `${activeColor} border-current`
        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }
      disabled:opacity-40 disabled:cursor-not-allowed`}
  >
    <Icon className="w-4 h-4" />
    <span>{count}</span>
  </button>
);

/* ── Secção de login ──────────────────────────────────────────── */
const LoginPrompt = ({
  onGoogle,
  onGithub,
}: {
  onGoogle: () => void;
  onGithub: () => void;
}) => (
  <div className="flex flex-col items-center gap-4 py-8 text-center border border-dashed border-border rounded-2xl bg-secondary/10">
    <LogIn className="w-8 h-8 text-muted-foreground" />
    <div>
      <p className="text-sm font-medium text-foreground">Entre para comentar</p>
      <p className="text-xs text-muted-foreground mt-1">
        Use sua conta do Google ou GitHub
      </p>
    </div>
    <div className="flex gap-3">
      <button
        onClick={onGoogle}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium"
      >
        <Chrome className="w-4 h-4 text-red-400" />
        Google
      </button>
      <button
        onClick={onGithub}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium"
      >
        <Github className="w-4 h-4" />
        GitHub
      </button>
    </div>
  </div>
);

/* ── Share bar ────────────────────────────────────────────────── */
const ShareBar = ({ title }: { title: string }) => {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`${title} — confira este projeto:`);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnClass =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] tracking-widest uppercase text-foreground/35 mr-1 shrink-0">
        Compartilhar
      </span>
      <button onClick={copy} className={btnClass}>
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Link2 className="w-3.5 h-3.5" />}
        {copied ? "Copiado!" : "Copiar link"}
      </button>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-emerald-500">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-blue-500">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Twitter / X
      </a>
    </div>
  );
};

/* ── Componente principal ─────────────────────────────────────── */
interface CommentsSectionProps {
  projectId: string;
  projectTitle?: string;
}

export const CommentsSection = ({ projectId, projectTitle = "Projeto" }: CommentsSectionProps) => {
  const { user, loading, isAdmin, signInWithGoogle, signInWithGithub, signOut } =
    usePublicAuth();

  const { comments, isLoading, addComment, deleteComment } =
    useProjectComments(projectId);

  const { likes, dislikes, myReaction, react } = useProjectReactions(
    projectId,
    user?.id
  );

  const commentIds = comments.map((c) => c.id);
  const { likeCountMap, likedByMe, toggleLike } = useCommentLikes(
    commentIds,
    user?.id
  );

  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !body.trim()) return;
    setSubmitting(true);
    try {
      await addComment.mutateAsync({
        body,
        user,
        reply_to_id: replyTo?.id,
        reply_to_name: replyTo?.name,
      });
      setBody("");
      setReplyTo(null);
      toast.success("Comentário adicionado!");
    } catch {
      toast.error("Erro ao publicar comentário.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteComment.mutateAsync(id);
      toast.success("Comentário removido.");
    } catch {
      toast.error("Erro ao remover comentário.");
    }
  };

  const handleReact = (type: "like" | "dislike") => {
    if (!user) {
      toast.error("Entre com uma conta para reagir.");
      return;
    }
    react.mutate(type);
  };

  const handleLikeComment = (commentId: string) => {
    if (!user) {
      toast.error("Entre com uma conta para curtir.");
      return;
    }
    toggleLike.mutate(commentId);
  };

  const handleReply = (id: string, name: string) => {
    setReplyTo({ id, name });
    setTimeout(() => document.getElementById("comment-input")?.focus(), 50);
  };

  return (
    <section className="py-12 border-t border-foreground/[0.06] space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shadow-[0_0_8px_hsl(var(--primary)/0.4)]" />
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/80">
            Reações e Comentários
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            {isAdmin && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                Admin
              </span>
            )}
            <Avatar
              src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
              name={user.user_metadata?.full_name || user.email || "U"}
            />
            <span className="text-xs text-muted-foreground">
              {user.user_metadata?.full_name || user.email?.split("@")[0]}
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        )}
      </div>

      {/* Reações do projeto + Share */}
      <div className="flex items-center gap-3 flex-wrap">
        <ReactionBtn
          icon={ThumbsUp}
          count={likes}
          active={myReaction === "like"}
          label="Curtir projeto"
          onClick={() => handleReact("like")}
          disabled={!user || react.isPending}
          activeColor="text-primary"
        />
        <ReactionBtn
          icon={ThumbsDown}
          count={dislikes}
          active={myReaction === "dislike"}
          label="Não curtir projeto"
          onClick={() => handleReact("dislike")}
          disabled={!user || react.isPending}
          activeColor="text-destructive"
        />
        {!user && (
          <span className="text-xs text-muted-foreground">Entre para reagir</span>
        )}
        <div className="flex-1 hidden sm:block" />
        <ShareBar title={projectTitle} />
      </div>

      {/* Comentários */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {comments.length} {comments.length === 1 ? "comentário" : "comentários"}
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-secondary shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-secondary rounded w-32" />
                  <div className="h-3 bg-secondary rounded w-64" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li
                key={c.id}
                className={`flex gap-3 group ${c.reply_to_id ? "ml-10 pl-3 border-l border-border/40" : ""}`}
              >
                <Avatar src={c.user_avatar} name={c.user_name} />
                <div className="flex-1 min-w-0">
                  {c.reply_to_id && c.reply_to_name && (
                    <p className="text-[11px] text-muted-foreground mb-1">
                      ↳ respondendo a{" "}
                      <span className="text-primary/70">@{c.reply_to_name}</span>
                    </p>
                  )}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{c.user_name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-[14px] text-foreground/70 leading-relaxed">{c.body}</p>
                  {/* Ações por comentário */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => handleLikeComment(c.id)}
                      disabled={toggleLike.isPending}
                      className={`flex items-center gap-1 text-[12px] transition-colors ${
                        likedByMe.has(c.id)
                          ? "text-rose-400"
                          : "text-muted-foreground hover:text-rose-400"
                      }`}
                      aria-label="Curtir comentário"
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedByMe.has(c.id) ? "fill-current" : ""}`} />
                      <span>{likeCountMap[c.id] ?? 0}</span>
                    </button>
                    {user && (
                      <button
                        onClick={() => handleReply(c.id, c.user_name)}
                        className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        Responder
                      </button>
                    )}
                  </div>
                </div>
                {/* Deletar: próprio usuário OU admin */}
                {(user?.id === c.user_id || isAdmin) && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0 self-start mt-1"
                    aria-label="Remover comentário"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-foreground/30 py-4">
            Nenhum comentário ainda. Seja o primeiro!
          </p>
        )}

        {/* Formulário ou login */}
        {!loading && (
          <div className="pt-2">
            {user ? (
              <form onSubmit={handleSubmit} className="space-y-2">
                {replyTo && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 text-xs text-primary">
                    <Reply className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Respondendo a <strong>@{replyTo.name}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="ml-auto text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex gap-3">
                  <Avatar
                    src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                    name={user.user_metadata?.full_name || user.email || "U"}
                  />
                  <div className="flex-1 flex gap-2">
                    <input
                      id="comment-input"
                      type="text"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder={
                        replyTo
                          ? `Respondendo a @${replyTo.name}...`
                          : "Deixe um comentário..."
                      }
                      maxLength={1000}
                      className="flex-1 px-4 py-2.5 bg-secondary/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={submitting || !body.trim()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-all hover:shadow-[0_0_20px_hsl(var(--neon-glow)/0.4)] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Enviar</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <LoginPrompt
                onGoogle={signInWithGoogle}
                onGithub={signInWithGithub}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};
