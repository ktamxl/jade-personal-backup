import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback } from "react";

export function useAuth() {
  const utils = trpc.useUtils();
  const { data: user, isLoading, error } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
      utils.auth.me.invalidate();
      window.location.href = "/";
    },
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (err: unknown) {
      if (err instanceof TRPCClientError && err.data?.code === "UNAUTHORIZED") {
        return;
      }
      throw err;
    }
  }, [logoutMutation]);

  return {
    user: user ?? null,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout,
  };
}
