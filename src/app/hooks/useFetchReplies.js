import { useQuery } from "@tanstack/react-query";

export const useFetchReplies = (commentId) => {
  return useQuery({
    queryKey: ["replies", commentId],
    queryFn: async () => {
      const response = await fetch(`/api/comment/${commentId}/replies`);
      if (!response.ok) {
        throw new Error("A resposta da rede não está ok");
      }
      return response.json();
    },
  });
};
