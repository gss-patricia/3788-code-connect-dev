import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { Avatar } from "../Avatar";
import styles from "./cardpost.module.css";
import Link from "next/link";

import { ThumbsUpButton } from "./ThumbsUpButton";
import { ModalComment } from "../ModalComment";

export const CardPost = ({ post, highlight }) => {
  // Mutation for liking a post
  const thumbsMutation = useMutation({
    mutationFn: (postData) => {
      return fetch(`http://localhost:3000/api/thumbs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["post", post.id]);
    },
  });

  // Mutation for submitting a comment
  const submitCommentMutation = useMutation({
    mutationFn: (commentData) => {
      return fetch(`http://localhost:3000/api/comment/${post.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", post.id]); //PRecisa optimistic
    },
  });

  const onSubmitComment = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const text = formData.get("text");
    submitCommentMutation.mutate({ id: post.id, text });
  };

  return (
    <article className={styles.card} style={{ width: highlight ? 993 : 486 }}>
      <header className={styles.header}>
        <figure style={{ height: highlight ? 300 : 133 }}>
          <Image
            src={post.cover}
            fill
            alt={`Capa do post de titulo: ${post.title}`}
          />
        </figure>
      </header>
      <section className={styles.body}>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <Link href={`/posts/${post.slug}`}>Ver detalhes</Link>
      </section>
      <footer className={styles.footer}>
        <div className={styles.actions}>
          <form onClick={() => thumbsMutation.mutate({ id: post.id })}>
            <ThumbsUpButton />
            <p>{post.likes}</p>
          </form>
          <div>
            <ModalComment onSubmit={onSubmitComment} />
            <p>{post.comments.length}</p>
          </div>
        </div>
        <Avatar imageSrc={post.author.avatar} name={post.author.username} />
      </footer>
    </article>
  );
};
