---
title: "Code Reviews"
weight: 1
draft: false
---

Please see the review process details:

* Indicate the priority of each comment, following this
  [feedback ladder](https://www.netlify.com/blog/2020/03/05/feedback-ladders-how-we-encode-code-reviews-at-netlify/).
  If none was indicated it will be treated as `[dust]`.
* A single approval is sufficient to merge, except when the change cuts
  across several components; then it should be approved by at least one owner
  of each component. If a reviewer asks for changes in a PR they should be
  addressed before the PR is merged, even if another reviewer has already
  approved the PR.
* During the review, address the comments and commit the changes _without_ squashing the commits.
  This facilitates incremental reviews since the reviewer does not go through all the code again to
  find out what has changed since the last review.

