"use client";

import { useState } from "react";
import styles from "./replies.module.css";
import { Comment } from "../Comment";
import { ReplyModal } from "../ModalReply";
import { useFetchReplies } from "@/hooks/useFetchReplies";
import { useQueryClient } from "@tanstack/react-query";

export const fetchReplies = async (commentId) => {
  const response = await fetch(`/api/comment/${commentId}/replies`);
  if (!response.ok) {
    throw new Error("A resposta da rede não está ok");
  }
  return response.json();
};

export const Replies = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: replies,
    isPending,
    error,
  } = useFetchReplies(showReplies ? comment.id : null);

  const prefetch = () => {
    if (!showReplies) {
      // Prefetch somente se showReplies for false
      queryClient.prefetchQuery({
        queryKey: ["replies", comment.id],
        queryFn: () => fetchReplies(comment.id),
        staleTime: 1000 * 60 * 5, // Considerar os dados "fresh" por 5 minutos,
        retry: 3,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.replies}>
        <button
          className={styles.btn}
          onClick={() => setShowReplies(!showReplies)}
          onMouseOver={prefetch}
        >
          {showReplies ? "Ocultar" : "Ver"} respostas
        </button>
        {showReplies && replies?.length && (
          <ul>
            {replies.map((reply) => (
              <li key={reply.id}>
                <Comment comment={reply} />
                <ReplyModal comment={reply} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
