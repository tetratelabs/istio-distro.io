---
title: "对 GetIstio 贡献"
url: /zh/community/contributing
weight: 3
---

我们欢迎社区的贡献。请仔细阅读以下指南，以最大限度地提高您的 PR 被合并的机会。

## 代码审查

按照这个[反馈梯子](https://www.netlify.com/blog/2020/03/05/feedback-ladders-how-we-encode-code-reviews-at-netlify/)，指出每条意见的优先次序。如果没有指明，则将作为`[灰尘]`处理。
单一的批准就足够合并了，除非修改跨越了几个组件；那么它应该由每个组件的至少一个所有者批准。如果审查者要求对 PR 进行修改，则应在 PR 合并之前解决这些修改，即使另一个审查者已经批准了 PR。

在审查过程中，处理这些意见并提交修改，而不要压制提交。这有利于增量审查，因为审查者不需要再次查看所有的代码来找出自上次审查以来有什么变化。

### DCO

本项目的所有作者都保留其作品的版权。然而，为了确保他们只提交他们有权利的作品，我们要求每个人通过签署他们的作品来确认这一点。

签名是在补丁解释的结尾处写上一行简单的字，证明你写了它，或者你有权把它作为一个开源补丁传下去。规则很简单：如果你能证明以下几点（来自 [developercertificate.org](https://developercertificate.org/)）：

```
Developer Certificate of Origin
Version 1.1
Copyright (C) 2004, 2006 The Linux Foundation and its contributors.
660 York Street, Suite 102,
San Francisco, CA 94110 USA
Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.
Developer's Certificate of Origin 1.1
By making a contribution to this project, I certify that:
(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or
(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or
(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.
(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

然后你只需在每条 git 提交消息中添加一行：

    Signed-off-by: Joe Smith <joe@gmail.com>

使用您的真实姓名 (抱歉，不能使用假名或匿名贡献。)

您可以在创建  git 提交时通过 `git commit -s` 添加签名。

或者，你也可以通过 `git rebase --signoff main` 来签名整个 PR。