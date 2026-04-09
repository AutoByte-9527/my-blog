---
title: "Git 工作流实践"
slug: "git-workflow"
summary: "团队协作中 Git 工作流的选择与实践。"
category: "技术"
tags: ["Git", "版本控制", "团队协作"]
created_at: "2026-03-30"
---

# Git 工作流实践

选择合适的 Git 工作流，让团队协作更加顺畅。

## Git Flow

适合有明确发布周期的团队：
- `main`: 生产代码
- `develop`: 开发分支
- `feature/*`: 功能分支
- `release/*`: 发布准备

## trunk-based development

更适合持续交付的团队，所有开发在短生命周期分支进行。

## 我的选择

个人项目推荐 trunk-based development，简单高效。

```bash
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git merge main
```
