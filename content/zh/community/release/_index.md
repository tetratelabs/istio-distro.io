---
title: "发布过程"
url: /zh/community/release
---

为了设置新的发行标签并从主分支发行新版本，您应该创建一个 PR，`GETISTIO_LATEST_VERSION` 在 [download.sh](https://github.com/tetratelabs/getistio/blob/13c222fc020e35bd73ce8041c93294278971a226/download.sh#L5) 中将其更新为新的发行标签。这样， `download.sh` 默认情况下将下载新版本。

在这个版本库的任何一个新的发布标签上，我们在 `.github/workflows/release.yaml` 中定义的发布工作流会被触发，将构建的二进制文件、`manifest.json` 和 `download.sh` 推送到 Bintray 的 GetIstio 版本库。请注意，`manifest.json` 和 `download.sh` 在 Bintray 级别没有标记，所以它们会被新的版本覆盖。原因是这两个资源的 URL 是 "静态 "的，很方便。