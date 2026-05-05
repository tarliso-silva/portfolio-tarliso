import { useState } from "react";
import {
  ThumbsUp, ThumbsDown, Send, LogIn, LogOut,
  MessageSquare, Trash2, Github, Chrome,
} from "lucide-react";
import {
  usePublicAuth,
  useProjectComments,
  useProjectReactions,
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

/* ── Componente principal ─────────────────────────────────────── */
interface CommentsSectionProps {
  projectId: string;
}

export const CommentsSection = ({ projectId }: CommentsSectionProps) => {
  const { user, loading, signInWithGoogle, signInWithGithub, signOut } =
    usePublicAuth();

  const { comments, isLoading, addComment, deleteComment } =
    useProjectComments(projectId);

  const { likes, dislikes, myReaction, react } = useProjectReactions(
    projectId,
    user?.id
  );

  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !body.trim()) return;
    setSubmitting(true);
    try {
      await addComment.mutateAsync({ body, user });
      setBody("");
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

        {/* User badge */}
        {user && (
          <div className="flex items-center gap-3">
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

      {/* Reações */}
      <div className="flex items-center gap-3">
        <ReactionBtn
          icon={ThumbsUp}
          count={likes}
          active={myReaction === "like"}
          label="Curtir"
          onClick={() => handleReact("like")}
          disabled={!user || react.isPending}
          activeColor="text-primary"
        />
        <ReactionBtn
          icon={ThumbsDown}
          count={dislikes}
          active={myReaction === "dislike"}
          label="Não curtir"
          onClick={() => handleReact("dislike")}
          disabled={!user || react.isPending}
          activeColor="text-destructive"
        />
        {!user && (
          <span className="text-xs text-muted-foreground">
            Entre para reagir
          </span>
        )}
      </div>

      {/* Comentários */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {comments.length} {comments.length === 1 ? "comentário" : "comentários"}
          </span>
        </div>

        {/* Lista de comentários */}
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
          <ul className="space-y-5">
            {comments.map((c) => (
              <li key={c.id} className="flex gap-3 group">
                <Avatar src={c.user_avatar} name={c.user_name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-medium text-foreground">
                      {c.user_name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-[14px] text-foreground/70 leading-relaxed">
                    {c.body}
                  </p>
                </div>
                {/* Botão de deletar — só para o próprio usuário */}
                {user?.id === c.user_id && (
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
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Avatar
                  src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                  name={user.user_metadata?.full_name || user.email || "U"}
                />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Deixe um comentário..."
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
