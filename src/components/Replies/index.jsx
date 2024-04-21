"use client";

import { useState } from "react";
import styles from "./replies.module.css";
import { Comment } from "../Comment";
import { ReplyModal } from "../ModalReply";
import { useFetchReplies } from "@/app/hooks/useFetchReplies";

export const Replies = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);

  const {
    data: replies,
    isLoading,
    error,
  } = useFetchReplies(showReplies ? comment.id : null); // passar o showReplies para o enabled

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.replies}>
        <button
          className={styles.btn}
          onClick={() => setShowReplies(!showReplies)}
        >
          {showReplies ? "Ocultar" : "Ver"} respostas
        </button>
        {showReplies && (
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
