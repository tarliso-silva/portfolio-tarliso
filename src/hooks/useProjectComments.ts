import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import type { User, Session } from "@supabase/supabase-js";

// ── Types ────────────────────────────────────────────────────────
export interface ProjectComment {
  id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  body: string;
  created_at: string;
  reply_to_id?: string | null;
  reply_to_name?: string | null;
}

export interface CommentLike {
  id: string;
  comment_id: string;
  user_id: string;
}

export interface ProjectReaction {
  id: string;
  project_id: string;
  user_id: string;
  reaction: "like" | "dislike";
}

// ── Auth hook ────────────────────────────────────────────────────
export const usePublicAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });

  const signInWithGithub = () =>
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.href },
    });

  const signOut = () => supabase.auth.signOut();

  const user: User | null = session?.user ?? null;
  // Admin = authenticated via email/password (only portfolio owner)
  const isAdmin = session?.user?.app_metadata?.provider === 'email';

  return { user, session, loading, isAdmin, signInWithGoogle, signInWithGithub, signOut };
};

// ── Comments hook ───────────────────────────────────────────────
export const useProjectComments = (projectId: string) => {
  const qc = useQueryClient();
  const key = ["project_comments", projectId];

  const { data: comments = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async (): Promise<ProjectComment[]> => {
      const { data, error } = await supabase
        .from("project_comments")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!projectId,
  });

  const addComment = useMutation({
    mutationFn: async ({
      body,
      user,
      reply_to_id,
      reply_to_name,
    }: {
      body: string;
      user: User;
      reply_to_id?: string;
      reply_to_name?: string;
    }) => {
      const { error } = await supabase.from("project_comments").insert({
        project_id: projectId,
        user_id: user.id,
        user_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Anônimo",
        user_avatar:
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          null,
        body: body.trim(),
        reply_to_id: reply_to_id ?? null,
        reply_to_name: reply_to_name ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("project_comments")
        .delete()
        .eq("id", commentId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { comments, isLoading, addComment, deleteComment };
};

// ── Reactions hook ──────────────────────────────────────────────
export const useProjectReactions = (projectId: string, userId?: string) => {
  const qc = useQueryClient();
  const key = ["project_reactions", projectId];

  const { data: reactions = [] } = useQuery({
    queryKey: key,
    queryFn: async (): Promise<ProjectReaction[]> => {
      const { data, error } = await supabase
        .from("project_reactions")
        .select("*")
        .eq("project_id", projectId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!projectId,
  });

  const likes = reactions.filter((r) => r.reaction === "like").length;
  const dislikes = reactions.filter((r) => r.reaction === "dislike").length;
  const myReaction = userId
    ? reactions.find((r) => r.user_id === userId)?.reaction ?? null
    : null;

  const react = useMutation({
    mutationFn: async (type: "like" | "dislike") => {
      if (!userId) return;

      const existing = reactions.find((r) => r.user_id === userId);

      if (existing) {
        if (existing.reaction === type) {
          // Remove reaction (toggle off)
          await supabase
            .from("project_reactions")
            .delete()
            .eq("id", existing.id);
        } else {
          // Change reaction
          await supabase
            .from("project_reactions")
            .update({ reaction: type })
            .eq("id", existing.id);
        }
      } else {
        // New reaction
        await supabase.from("project_reactions").insert({
          project_id: projectId,
          user_id: userId,
          reaction: type,
        });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { likes, dislikes, myReaction, react };
};

// ── Comment Likes hook ──────────────────────────────────────────
export const useCommentLikes = (commentIds: string[], userId?: string) => {
  const qc = useQueryClient();
  const sortedKey = [...commentIds].sort().join(",");
  const key = ["comment_likes", sortedKey];

  const { data: likes = [] } = useQuery<CommentLike[]>({
    queryKey: key,
    queryFn: async () => {
      if (!commentIds.length) return [];
      const { data, error } = await supabase
        .from("comment_likes")
        .select("*")
        .in("comment_id", commentIds);
      if (error) throw error;
      return data ?? [];
    },
    enabled: commentIds.length > 0,
  });

  const likeCountMap: Record<string, number> = {};
  for (const id of commentIds) {
    likeCountMap[id] = likes.filter((l) => l.comment_id === id).length;
  }

  const likedByMe = new Set<string>(
    userId ? likes.filter((l) => l.user_id === userId).map((l) => l.comment_id) : []
  );

  const toggleLike = useMutation({
    mutationFn: async (commentId: string) => {
      if (!userId) return;
      if (likedByMe.has(commentId)) {
        const like = likes.find(
          (l) => l.comment_id === commentId && l.user_id === userId
        );
        if (like) {
          await supabase.from("comment_likes").delete().eq("id", like.id);
        }
      } else {
        await supabase
          .from("comment_likes")
          .insert({ comment_id: commentId, user_id: userId });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { likeCountMap, likedByMe, toggleLike };
};
