import { useQuery } from "@tanstack/react-query";

export const fetchReplies = async (commentId) => {
  const response = await fetch(
    `http://localhost:3000/api/comment/${commentId}/replies`
  );
  if (!response.ok) {
    throw new Error("A resposta da rede não está ok");
  }
  return response.json();
};

export const useFetchReplies = (commentId) => {
  return useQuery({
    queryKey: ["replies", commentId],
    queryFn: fetchReplies(commentId),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    enabled: !!commentId, //garantindo que só será chamado quando tiver o commentId
  });
};
