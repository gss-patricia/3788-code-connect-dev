import { useQuery } from "@tanstack/react-query";

export const fetchReplies = async ({ commentId, slug }) => {
  // Verificar se commentId e slug são válidos antes de fazer a requisição
  if (!commentId || !slug) {
    return [];
  }

  const response = await fetch(
    `/api/comment/${commentId}/replies?slug=${encodeURIComponent(slug)}`
  );
  if (!response.ok) {
    throw new Error("A resposta da rede não está ok");
  }
  return response.json();
};

export const useFetchReplies = ({ commentId, slug }) => {
  return useQuery({
    queryKey: ["replies", commentId, slug],
    queryFn: () => fetchReplies({ commentId, slug }),
  });
};
