import { describe, test, expect } from "vitest";
import * as iterative from "./flattenComments.iterative.js";
import * as recursive from "./flattenComments.recursive.js";

const comments = [
  {
    id: 1,
    author: "alice",
    text: "Great post! Really insightful.",
    children: [
      {
        id: 2,
        author: "bob",
        text: "Totally agree with Alice.",
        children: [
          {
            id: 5,
            author: "carol",
            text: "Same here, bookmarked.",
            children: [],
          },
          {
            id: 6,
            author: "dan",
            text: "Could you share more details?",
            children: [
              {
                id: 9,
                author: "carol",
                text: "Sure, I'll write a follow-up.",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 3,
        author: "eve",
        text: "I have a different take on this.",
        children: [
          {
            id: 7,
            author: "frank",
            text: "Interesting perspective, Eve.",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    author: "grace",
    text: "Thanks for sharing this.",
    children: [
      {
        id: 8,
        author: "heidi",
        text: "Couldn't have said it better.",
        children: [
          {
            id: 10,
            author: "ivan",
            text: "Short and sweet.",
            children: [
              {
                id: 11,
                author: "ivan",
                text: "Short and sweet.",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

describe.each([
  ["iterative", iterative],
  ["recursive", recursive],
])("flattenComments (%s)", (_label, impl) => {
  test("getTotalCommentsCount counts every nested comment", () => {
    expect(impl.getTotalCommentsCount(comments)).toBe(11);
  });

  test("getFlattenComments returns a list whose length matches the count", () => {
    expect(impl.getFlattenComments(comments).length).toBe(11);
  });
});
