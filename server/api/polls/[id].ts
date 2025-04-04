export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const url = getRequestURL(event);
  const origin = url.host === "localhost" ? "http://localhost:3000" : url.origin;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Poll ID is required",
    });
  }

  const { data, error } = await supabase
    .from("polls")
    .select(
      `
        id,
        title,
        created_at,
        responses (
          id,
          title,
          created_at,
          poll_id,
          votes (
            id,
            created_at,
            session_id,
            response_id
          )
        )
      `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw createError({
      statusCode: 404,
      statusMessage: "Poll not found",
    });
  }

  const voteUrl = (response: any) => {
    return `${origin}/api/responses/${response.id}/create-vote`;
  };

  setResponseHeaders(event, {
    "Netlify-Cache-Tag": `poll-${data.id}-api`,
    "Cache-Control": "public, max-age=0, must-revalidate",
    "Netlify-CDN-Cache-Control": "public, max-age=300, stale-while-revalidate=31536000, durable",
  });

  return {
    ...data,
    responses: data.responses.map((response) => ({
      ...response,
      voteUrl: voteUrl(response),
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?format=svg&data=${encodeURIComponent(
        voteUrl(response),
      )}`,
      voteCount: response.votes.length,
    })),
  };
});
