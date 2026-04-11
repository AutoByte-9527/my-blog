# Design System - my-blog

## Style: E-Ink / Paper

**核心特征：** 宣纸质感，墨色文字，极简装饰，阅读优先

| Token | Value | Use |
|-------|-------|-----|
| `--paper-bg` | `#F5F5F0` | 全局背景（微暖米白） |
| `--ink-color` | `#2D2D2D` | 正文/主文字 |
| `--ink-light` | `rgba(45,45,45,0.35)` | 次要元素、图标默认 |
| `--accent` | `#8B4513` | 赭石色强调（链接、hover、重点） |
| `--border` | `rgba(45,45,45,0.10)` | 分割线、边框 |
| `--shadow` | `rgba(45,45,45,0.06)` | 卡片阴影 |

## Typography
- **Display**: Ma Shan Zheng（标题 Logo）
- **Body**: Noto Serif SC
- **Fallback**: Georgia, serif

## Motion Principles
- `ease-out` 入场, `ease-in` 退场
- 150–300ms 微交互，max 400ms 组件级
- **禁用** 无限循环动画
- 必须响应 `prefers-reduced-motion`

## Components

### Back-to-Top Floating Button
- **位置**: `bottom: 2rem; right: 2rem`
- **尺寸**: 44×44px（触屏最小目标）
- **形状**: 圆形，边框 1.5px
- **静止**: 极淡墨色图标（`--ink-light`），背景透明
- **可见**: 滚动 >400px 时淡入上浮
- **Hover**: 图标颜色变为 `--accent`，背景微泛赭石
- **动画**: 无连续动画，尊重 `prefers-reduced-motion`

## Anti-Patterns
- ✗ 连续脉动动画
- ✗ 复杂多层 SVG 重叠
- ✗ emoji 作为图标
- ✗ 透明度过低的 glass 效果
