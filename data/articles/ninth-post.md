---
title: "Tailwind CSS 实战技巧"
slug: "tailwind-css-tips"
summary: "分享 Tailwind CSS 使用中的实用技巧和最佳实践。"
category: "技术"
tags: ["CSS", "Tailwind", "前端"]
created_at: "2026-04-01"
---

# Tailwind CSS 实战技巧

Tailwind CSS 通过原子化类名实现了快速的样式开发。

## 常用技巧

### 1. @apply 提取重复类
```css
.btn {
  @apply px-4 py-2 bg-blue-500 text-white rounded;
}
```

### 2. 自定义主题
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#FF5733',
      }
    }
  }
}
```

### 3. 响应式设计
```html
<div class="w-full md:w-1/2 lg:w-1/3">
```

善用这些技巧，可以让 Tailwind 开发更加高效。
