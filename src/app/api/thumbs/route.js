import db from "../../../../prisma/db";

export async function POST(request) {
  const { id } = await request.json();

  await db.post.update({
    where: {
      id: id,
    },
    data: {
      likes: {
        increment: 1,
      },
    },
  });

  return new Response(
    JSON.stringify({ message: "Thumbs up incremented successfully!" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
