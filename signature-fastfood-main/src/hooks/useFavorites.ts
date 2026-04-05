import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const useFavorites = () => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) { setFavoriteIds(new Set()); return; }
    supabase.from("favorites").select("item_id").eq("user_id", user.id).then(({ data }) => {
      if (data) setFavoriteIds(new Set(data.map((f) => f.item_id)));
    });
  }, [user]);

  const toggleFavorite = useCallback(async (itemId: string) => {
    if (!user) { toast.error("Sign in to save favorites"); return; }
    if (favoriteIds.has(itemId)) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("item_id", itemId);
      setFavoriteIds((prev) => { const n = new Set(prev); n.delete(itemId); return n; });
      toast.success("Removed from favorites");
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, item_id: itemId });
      setFavoriteIds((prev) => new Set(prev).add(itemId));
      toast.success("Added to favorites");
    }
  }, [user, favoriteIds]);

  const isFavorite = useCallback((itemId: string) => favoriteIds.has(itemId), [favoriteIds]);

  return { toggleFavorite, isFavorite };
};
