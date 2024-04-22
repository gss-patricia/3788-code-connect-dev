import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Avatar } from "../Avatar";
import { Star } from "../icons/Star";
import styles from "./cardpost.module.css";
import Link from "next/link";

import { ThumbsUpButton } from "./ThumbsUpButton";
import { ModalComment } from "../ModalComment";

export const CardPost = ({ post, highlight, rating, category }) => {
  // Mutation for liking a post

  const queryClient = useQueryClient();

  // const thumbsMutation = useMutation({
  //   mutationFn: (postData) => {
  //     return fetch(`http://localhost:3000/api/thumbs`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(postData),
  //     });
  //   },
  //   onMutate: async (newData) => {
  //     const queryKey = ["post", post.slug];
  //     const postsQueryKey = ["posts"];

  //     // Cancel outgoing refetches for both queries
  //     await queryClient.cancelQueries(queryKey);
  //     await queryClient.cancelQueries(postsQueryKey);

  //     const prevPost = queryClient.getQueryData(queryKey);
  //     const prevPosts = queryClient.getQueryData(postsQueryKey);

  //     // Optimistic update for the single post
  //     if (prevPost) {
  //       queryClient.setQueryData(queryKey, {
  //         ...prevPost,
  //         likes: prevPost.likes + 1,
  //       });
  //     }

  //     // Optimistic update for the posts list
  //     if (prevPosts) {
  //       queryClient.setQueryData(
  //         postsQueryKey,
  //         prevPosts.map((p) =>
  //           p.id === post.id ? { ...p, likes: p.likes + 1 } : p
  //         )
  //       );
  //     }

  //     return { prevPost, prevPosts };
  //   },
  //   onError: (error, newData, context) => {
  //     if (context.prevPost) {
  //       queryClient.setQueryData(["post", post.slug], context.prevPost);
  //     }
  //     if (context.prevPosts) {
  //       queryClient.setQueryData(["posts"], context.prevPosts);
  //     }
  //     alert(error);
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries(["post", post.slug]);
  //     queryClient.invalidateQueries(["posts"]);
  //   },
  // });

  // Mutation for submitting a comment

  const {
    mutate: thumbsMutation,
    isPending,
    variables,
    error: thumbsError,
    isError: isErrorThumbs,
  } = useMutation({
    mutationFn: async (postData) => {
      try {
        const response = await fetch(`http://localhost:3000/api/thumbs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Something went wrong");
        }

        return response.json();
      } catch (error) {
        throw new Error(error.message || "Something went wrong");
      }
    },
    onError: (error) => {
      // Optionally handle errors globally here if needed
      console.error("Error posting thumbs:", error.message);
    },
  });

  const submitCommentMutation = useMutation({
    mutationFn: (commentData) => {
      return fetch(`http://localhost:3000/api/comment/${post.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries(["comments", post.id]);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const onSubmitComment = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const text = formData.get("text");
    submitCommentMutation.mutate({ id: post.id, text });
  };

  // update optimistic via UI
  useEffect(() => {
    if (isPending && variables) {
      post.likes = post.likes + 1;
    }
  }, [variables, isPending]);

  // update optimistic via UI
  console.log("error", thumbsError);
  console.log("isErrorThumbs", isErrorThumbs);

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
          <form
            onClick={() => {
              event.preventDefault();
              thumbsMutation({ slug: post.slug });
            }}
          >
            <ThumbsUpButton />
            <p>{post.likes}</p>
          </form>
          <div>
            <ModalComment onSubmit={onSubmitComment} />
            <p>{post.comments.length}</p>
          </div>
          {rating && (
            <div style={{ margin: "0 2px" }}>
              <Star />
              <p>{rating}</p>
            </div>
          )}
        </div>
        {category && (
          <div
            className={styles.categoryWrapper}
            style={{ fontSize: highlight ? "15px" : "12px" }}
          >
            <span className={styles.label}>Categoria: </span>{" "}
            <span className={styles.category}>{category}</span>
          </div>
        )}
        <Avatar imageSrc={post.author.avatar} name={post.author.username} />
      </footer>
    </article>
  );
};
