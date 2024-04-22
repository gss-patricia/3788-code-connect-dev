"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { CardPost } from "@/components/CardPost";

import styles from "./page.module.css";
import Link from "next/link";

const fetchPosts = async ({ page }) => {
  const results = await fetch(`http://localhost:3000/api/posts?page=${page}`);
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

export default function Home({ searchParams }) {
  const currentPage = parseInt(searchParams?.page || 1);
  const searchTerm = searchParams?.q;

  const {
    data: posts,
    prev,
    next,
    error,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts({ page: currentPage }),
  });

  const postRatingQueries = useQueries({
    queries:
      posts?.data?.length > 0
        ? posts.data.map((post) => ({
            queryKey: ["postHome", post.id],
            queryFn: () => fetchPostRating({ postId: post.id }),
          }))
        : [],
  });

  // Criar um mapa de ratings usando o ID do post como chave
  const ratingsAndCartegoriesMap = postRatingQueries?.reduce((acc, query) => {
    if (!query.isPending && query.data && query.data.id) {
      acc[query.data.id] = query.data;
    }
    return acc;
  }, {});

  if (isPending) {
    return <span>Loading...</span>;
  }

  console.log("aaaaaaaaa", posts);
  return (
    <main className={styles.grid}>
      {posts?.data?.map((post) => (
        <CardPost
          key={post.id}
          post={post}
          rating={ratingsAndCartegoriesMap?.[post.id]?.rating}
          category={ratingsAndCartegoriesMap?.[post.id]?.category}
        />
      ))}
      <div className={styles.links}>
        {posts?.prev && (
          <Link
            href={{
              pathname: "/",
              query: { page: posts?.prev, q: searchTerm },
            }}
          >
            Página anterior
          </Link>
        )}
        {posts?.next && (
          <Link
            href={{
              pathname: "/",
              query: { page: posts?.next, q: searchTerm },
            }}
          >
            Próxima página
          </Link>
        )}
      </div>
    </main>
  );
}
