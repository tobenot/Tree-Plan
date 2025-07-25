# 🌳 树计划 (Tree Plan)

> "技术是锄头和水桶，'树计划'才是我要用心灌溉的那棵树。"

## 项目简介

树计划是一个**个人思想的编辑器与发布系统**，采用"Git as a CMS"模式，实现本地编辑与静态部署的分离。这不是技术作品集，而是一个故事家的数字化延伸。

### 核心理念

- **身份认同**: "讲故事的人"的数字化表达
- **思想结构**: 个人话题百科全书，几百至几千条分类
- **无限大纲**: 无限层级的思维导图，从宏观到微观的递进式探索
- **连接邀请**: "如果他也对此感兴趣，他可以和我聊"

## 功能特性

### 🌱 本地编辑器 (开发环境)
- **Tiptap 块编辑器**: 支持无限层级的大纲编辑
- **键盘优先操作**: 
  - `Enter`: 创建同级节点
  - `Tab`: 缩进节点
  - `Shift+Tab`: 取消缩进
  - `Backspace`: 删除空节点
- **自动链接系统**: 自动发现并标记相同内容
- **数据导出**: 一键导出 JSON 格式的笔记数据

### 🌿 公开静态网站 (生产环境)
- **只读展示**: 高性能的静态网站
- **思想森林**: 可视化的层级化思想结构
- **链接可视化**: 自动链接的视觉展示
- **控制台编辑**: 支持通过浏览器控制台切换编辑模式

## 控制台命令

在部署版本中，你可以通过浏览器控制台使用以下命令：

```javascript
// 切换编辑/预览模式
toggleEditMode()

// 直接设置为编辑模式
setEditMode("edit")

// 直接设置为预览模式  
setEditMode("preview")
```

## 技术栈

- **前端框架**: React + TypeScript + Vite
- **编辑器核心**: Tiptap
- **数据格式**: JSON
- **数据存储**: Git 仓库内的 `src/data/notes.json`
- **部署方案**: GitHub Actions + GitHub Pages

## 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 生成自动链接
npm run link
```

### 数据管理

1. 在开发环境中编辑内容
2. 点击"导出笔记到文件"按钮
3. 将导出的 JSON 内容复制到 `src/data/notes.json`
4. 提交到 Git 仓库
5. 自动部署到 GitHub Pages

## 项目结构

```
Tree-Plan/
├── src/
│   ├── App.tsx          # 主应用组件
│   ├── Editor.tsx       # Tiptap 编辑器
│   ├── Preview.tsx      # 思想森林可视化
│   ├── data/
│   │   └── notes.json   # 笔记数据源
│   └── extensions/
│       └── AutoLink.ts  # 自动链接扩展
├── scripts/
│   └── generate-links.cjs # 自动链接生成脚本
└── docs/
    └── design/          # 设计文档
```

## 设计哲学

### 有机生长 vs 机械构建
项目应该像树一样有机生长，而非像建筑一样机械构建。每个新的想法都是自然的枝叶延伸。

### 深度 vs 广度
优先追求思想的深度挖掘，而非表面的广度覆盖。每个话题钩子都应该承载足够的思考密度。

### 邀请 vs 展示
不是单向的信息展示，而是双向的对话邀请。每个内容都应该暗含"你怎么看？"的问题。

## 成功指标

项目成功的标志不是访问量或技术复杂度，而是：
- 是否有人因为某个话题钩子主动发起对话
- 是否建立了基于共同兴趣的深度连接
- 是否帮助我更好地表达和分享内心世界

---

*由 [tobenot](https://tobenot.top) 创建*
