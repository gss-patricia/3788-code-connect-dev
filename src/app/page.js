"use client";

import { CardPost } from "@/components/CardPost";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home({ searchParams }) {
  const page = parseInt(searchParams?.page || 1);
  const searchTerm = searchParams?.q;

  const posts = {
    data: [],
  };

  const prev = null;
  const next = null;

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
