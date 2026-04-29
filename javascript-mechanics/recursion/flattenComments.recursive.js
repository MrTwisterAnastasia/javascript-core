export function getTotalCommentsCount(comments) {
  return getFlattenComments(comments).length;
}

export function getFlattenComments(comments, acc = []) {
  if (!comments?.length) {
    return acc;
  }

  const [comment, ...rest] = comments;
  acc.push(comment);

  if (comment.children?.length) {
    getFlattenComments(comment.children, acc);
  }

  return getFlattenComments(rest, acc);
}
