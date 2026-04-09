---
title: "TypeScript 类型体操入门"
slug: "typescript-type-gymnastics"
summary: "深入理解 TypeScript 高级类型，提升代码类型安全。"
category: "技术"
tags: ["TypeScript", "类型系统", "前端"]
created_at: "2026-04-07"
---

# TypeScript 类型体操入门

TypeScript 的类型系统不仅仅是类型标注，更是一门艺术。

## 条件类型

```typescript
type IsString<T> = T extends string ? true : false;
type A = IsString<"hello">; // true
type B = IsString<123>;     // false
```

## 映射类型

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

## infer 关键字

用于从类型中推断信息，是实现复杂类型工具的基础。

掌握这些技巧，可以让代码更加类型安全。
