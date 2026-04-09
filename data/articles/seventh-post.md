---
title: "Rust 所有权系统详解"
slug: "rust-ownership"
summary: "深入理解 Rust 的核心特性：所有权、借用和生命周期。"
category: "技术"
tags: ["Rust", "系统编程", "内存管理"]
created_at: "2026-04-03"
---

# Rust 所有权系统详解

Rust 的所有权系统是其最具创新性的特性，实现了内存安全而无需垃圾回收。

## 所有权规则

1. 每个值有且只有一个所有者
2. 当所有者离开作用域，值被丢弃
3. 值可以多次借用

## 借用检查

```rust
fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s);
    println!("{}", len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

生命周期和借用规则让 Rust 程序在编译期就能避免数据竞争和悬垂指针。
