export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

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
        questions (
          id,
          title,
          created_at,
          poll_id,
          votes (
            id,
            created_at,
            session_id,
            question_id
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

  return data;
});
