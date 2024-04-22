"use client";

import { useQuery } from "@tanstack/react-query";
import { CardPost } from "@/components/CardPost";
import { CommentList } from "@/components/CommentList";
import styles from "./page.module.css";

const fetchPostBySlug = async ({ slug }) => {
  const results = await fetch(`http://localhost:3000/api/post/${slug}`);
  const data = await results.json();
  return data;
};

const fetchPostRating = async ({ postId }) => {
  const results = await fetch(
    `http://localhost:3000/api/post?postId=${postId}`
  );
  const data = await results.json();
  return data;
};

const PagePost = ({ params }) => {
  const { slug } = params;

  const {
    data: post,
    error,
    isError,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPostBySlug({ slug }),
    enabled: !!slug,
    staleTime: 5000, //apenas para testar o update optimistic via UI
  });

  const { data: postRating } = useQuery({
    queryKey: ["postRating", post?.id],
    queryFn: () => fetchPostRating({ postId: post?.id }),
    // A consulta não será executada até que o post.id exista
    enabled: !!post?.id,
  });

  //apenas para testar o update optimistic via UI
  console.log("slug page", post);

  if (isError) {
    console.error(error);
    return <div>Error: {error.message}</div>; // This will now handle 404 errors as well
  }

  return (
    <div>
      {post && (
        <>
          <CardPost
            post={post}
            rating={postRating?.rating}
            category={postRating?.category}
            highlight={true}
          />
          <h3 className={styles.subtitle}>Código:</h3>
          <div className={styles.code}>
            <div dangerouslySetInnerHTML={{ __html: post.markdown }} />
          </div>
          <CommentList comments={post.comments} />
        </>
      )}
    </div>
  );
};

export default PagePost;
