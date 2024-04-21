"use client";

import { useQuery } from "@tanstack/react-query";
import { CardPost } from "@/components/CardPost";

import styles from "./page.module.css";
import Link from "next/link";

const fetchPosts = async ({ page }) => {
  const results = await fetch(`http://localhost:3000/api/posts?page=${page}`);
  const data = await results.json();
  return data;
};

export default function Home({ searchParams }) {
  const page = parseInt(searchParams?.page || 1);
  const searchTerm = searchParams?.q;

  const {
    data: posts,
    prev,
    next,
    error,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts({ page }),
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  return (
    <main className={styles.grid}>
      {posts?.data?.map((post) => (
        <CardPost key={post.id} post={post} />
      ))}
      <div className={styles.links}>
        {prev && (
          <Link href={{ pathname: "/", query: { page: prev, q: searchTerm } }}>
            Página anterior
          </Link>
        )}
        {next && (
          <Link href={{ pathname: "/", query: { page: next, q: searchTerm } }}>
            Próxima página
          </Link>
        )}
      </div>
    </main>
  );
}
