export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const url = getRequestURL(event);
  const origin = url.host === "localhost" ? "http://localhost:3001" : url.origin;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Response ID is required",
    });
  }

  const { data, error } = await supabase
    .from("responses")
    .select(
      `
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
      `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw createError({
      statusCode: 404,
      statusMessage: "Response not found",
    });
  }

  // TODO: Check if the response is already voted from the session_id (which
  // requires that the session cookie is set)

  // Create the vote
  const { data: vote, error: voteError } = await supabase
    .from("votes")
    .insert({ session_id: "b44bbec7-128e-45be-847e-63c452536103", response_id: id });

  if (voteError) {
    console.error(voteError);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create vote",
    });
  }

  // TODO: Redirect to a thank you page (perhaps with results)
  return sendRedirect(event, `/polls/${data.poll_id}`);
});
