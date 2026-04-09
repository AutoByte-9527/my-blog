---
title: "React Server Components 深入理解"
slug: "react-server-components"
summary: "探索 React 的服务端组件模型，了解前后端边界如何重新定义。"
category: "技术"
tags: ["React", "前端", "架构"]
created_at: "2026-04-05"
---

# React Server Components 深入理解

React Server Components (RSC) 代表了 React 架构的重大变革。

## 核心概念

- **Server Components**: 在服务端渲染，可访问后端资源
- **Client Components**: 在客户端渲染，负责交互

## 优势

1. 减少客户端 JavaScript 体积
2. 直接访问数据库、文件系统
3. 更好的 SEO 和首屏性能

## 使用场景

RSC 适合数据获取和静态内容渲染，Client Components 适合交互逻辑。
