# 树计划样式指南 (Tree Plan Style Guide)

## 设计语言：有机森林

基于"树计划"的核心理念，我们的视觉语言应该体现：
- **有机生长** (Organic Growth)
- **思想森林** (Forest of Thoughts) 
- **温暖邀请** (Warm Invitation)
- **深度探索** (Deep Exploration)

## 色彩系统 (Color Palette)

### 主色调：森林与土壤
```css
/* 核心色彩变量 */
--color-earth-bg: #F5F1E8;      /* 温暖的土壤背景 */
--color-bark-text: #403A30;     /* 树皮般的深棕文字 */
--color-branch-accent: #B05B3B;  /* 树枝的陶土色 */
--color-leaf-alt: #587474;      /* 叶子的灰绿色 */
--color-root-secondary: #A09787; /* 根系的暖灰色 */
--color-moss-subtle: rgba(0,0,0,0.05); /* 苔藓般的微妙色彩 */
```

### 语义化色彩
- **背景色** (`earth-bg`): 像纸张，像土壤，承载一切生长
- **主文字** (`bark-text`): 如树皮般沉稳，易读而有质感
- **强调色** (`branch-accent`): 树枝的活力，用于链接和重点
- **次要色** (`leaf-alt`): 叶子的宁静，用于次要信息
- **辅助色** (`root-secondary`): 根系的内敛，用于注释和元数据

## 字体系统 (Typography)

### 字体选择哲学
选择具有"人文温度"和"有机质感"的字体，避免过于机械化的设计。

```css
font-family: {
  body: ['Atkinson Hyperlegible', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  display: ['Atkinson Hyperlegible', 'Georgia', 'serif']
}
```

### 字体层级
```css
/* 大树主干 - 页面标题 */
.text-trunk: 32px, font-weight-700, line-height-1.2
/* 主要分支 - 章节标题 */  
.text-branch: 24px, font-weight-600, line-height-1.3
/* 次级分支 - 小节标题 */
.text-twig: 20px, font-weight-600, line-height-1.4
/* 叶子 - 正文内容 */
.text-leaf: 17px, font-weight-400, line-height-1.8
/* 根须 - 小字注释 */
.text-root: 14px, font-weight-400, line-height-1.6
```

## 空间系统 (Spacing)

### 有机间距
模拟自然界中树木的生长间距，避免过于规整的网格。

```css
spacing: {
  'seed': '2px',    /* 最小间距 */
  'sprout': '4px',  /* 发芽间距 */
  'leaf': '8px',    /* 叶子间距 */
  'twig': '16px',   /* 小枝间距 */
  'branch': '24px', /* 分支间距 */
  'trunk': '48px',  /* 主干间距 */
  'forest': '96px'  /* 森林间距 */
}
```

## 形状系统 (Border Radius)

### 有机边角
避免完全的直角，模拟自然界中的圆润形状。

```css
borderRadius: {
  'seed': '2px',
  'leaf': '6px',
  'branch': '12px',
  'organic': '12px 8px 14px 6px', /* 不规则有机形状 */
  'trunk': '20px'
}
```

## 组件样式规范

### 1. 大纲列表 (Outline Lists)
```css
/* 模拟树的分支结构 */
ul {
  list-style: none;
  position: relative;
}

/* 不同层级使用不同的标记符号 */
li::before {
  content: "●";  /* 第一级：实心圆 */
  color: var(--color-branch-accent);
}

li li::before {
  content: "○";  /* 第二级：空心圆 */
  color: var(--color-root-secondary);
}

li li li::before {
  content: "▪";  /* 第三级：小方块 */
  color: var(--color-root-secondary);
}
```

### 2. 链接样式 (Links)
```css
/* 模拟树枝间的连接 */
a {
  color: var(--color-branch-accent);
  text-decoration: none;
  border-bottom: 2px dotted currentColor;
  transition: all 0.2s ease;
}

a:hover {
  color: var(--color-leaf-alt);
  border-bottom-style: solid;
}
```

### 3. 按钮设计 (Buttons)
```css
/* 有机形状的交互元素 */
.btn-organic {
  background: var(--color-branch-accent);
  color: white;
  border: 2px solid transparent;
  border-radius: var(--radius-organic);
  padding: 8px 16px;
  transition: all 0.2s ease;
}

.btn-organic:hover {
  background: var(--color-leaf-alt);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

### 4. 编辑器容器 (Editor Container)
```css
/* 模拟在纸上书写的感觉 */
.editor-container {
  background: var(--color-earth-bg);
  border: 2px solid var(--color-root-secondary);
  border-radius: var(--radius-organic);
  /* 添加纸张质感 */
  background-image: 
    radial-gradient(circle at 1px 1px, 
                   rgba(64,58,48,0.05) 1px, 
                   transparent 0);
  background-size: 20px 20px;
}
```

## 动效原则 (Animation Principles)

### 有机动效
所有动画应该模拟自然界的运动规律：
- **缓入缓出** (ease-in-out)
- **微妙弹性** (subtle spring)
- **渐进式变化** (progressive enhancement)

```css
/* 标准过渡 */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* 弹性效果 */
transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
```

## 响应式设计 (Responsive Design)

### 断点系统
```css
screens: {
  'seed': '320px',    /* 手机竖屏 */
  'sprout': '480px',  /* 手机横屏 */
  'branch': '768px',  /* 平板 */
  'trunk': '1024px',  /* 桌面 */
  'forest': '1280px'  /* 大屏 */
}
```

### 响应式原则
1. **内容优先**: 确保内容在所有设备上都可读
2. **触摸友好**: 在移动设备上提供足够大的点击区域
3. **层级清晰**: 在小屏幕上保持信息层级的清晰度

## 可访问性 (Accessibility)

### 对比度要求
- 正文文字与背景：至少 4.5:1
- 大标题与背景：至少 3:1
- 交互元素焦点状态：明显可见

### 语义化标记
- 使用恰当的 HTML 标签
- 提供 alt 文本
- 支持键盘导航
- 兼容屏幕阅读器

---

## 实施指南

### Tailwind CSS 配置
所有上述设计规范都已经集成到 `tailwind.config.js` 中，可以直接使用对应的类名。

### 命名约定
使用语义化的类名前缀：
- `tree-*`: 树相关的结构样式
- `forest-*`: 整体布局样式
- `organic-*`: 有机形状样式
- `growth-*`: 动效相关样式

这样的设计语言将帮助我们创造一个真正体现"树计划"理念的数字空间。 