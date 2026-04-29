export function getTotalCommentsCount(comments) {
  return getFlattenComments(comments).length;
}

export function getFlattenComments(comments) {
  const queue = [...comments];
  for (const comment of queue) {
    queue.push(...(comment.children || []));
  }
  return queue;
}
