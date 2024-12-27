import crypto from "crypto";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  let sessionId = getCookie(event, "qrp_session_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    setCookie(event, "qrp_session_id", sessionId);
  }

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Response ID is required",
    });
  }

  const { data: response, error: responseError } = await supabase
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

  if (responseError) {
    console.error(responseError);
    throw createError({
      statusCode: 404,
      statusMessage: "Response not found",
    });
  }

  // Check if the response is already voted. Retrieve all votes from responses
  // from the same poll.
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select(
      `
        id,
        responses (
          id,
          votes (
            id,
            session_id,
            response_id
          )
        )
      `,
    )
    .eq("id", response.poll_id)
    .single();

  if (pollError) {
    console.error(pollError);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to retrieve votes",
    });
  }

  const votes = poll.responses.flatMap((response) => response.votes);

  const hasVoted = votes.some((vote) => vote.session_id === sessionId);
  if (hasVoted) {
    return createError({
      statusCode: 400,
      statusMessage: "You have already voted for this response",
    });
  }

  // Create the vote
  const { data: vote, error: voteError } = await supabase
    .from("votes")
    .insert({ session_id: sessionId, response_id: id });

  if (voteError) {
    console.error(voteError);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create vote",
    });
  }

  // TODO: Redirect to a thank you page (perhaps with results)
  return sendRedirect(event, `/thank-you`);
});
