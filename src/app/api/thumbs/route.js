import db from "../../../../prisma/db";

// Função que simula um delay
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function POST(request) {
  const { slug } = await request.json();

  // Simula um delay antes de executar a atualização
  await delay(50);

  await db.post.update({
    where: {
      slug,
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
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
