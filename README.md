<div align="center">

# pi-planning

**Plan mode for Pi Agent — read-only exploration, plan extraction & execution progress tracking.**

计划模式：只读探索 → 生成计划 → 全量执行 → 进度追踪，一站式完成。

</div>

---

## ✨ 它是什么？

一个开关，让 AI 先想清楚再动手：

- 🔒 **只读探索**：禁用 edit/write，Bash 限制在只读命令白名单内，安全分析代码
- 📋 **计划提取**：AI 在 `Plan:` 标题下输出编号步骤，自动提取为待办清单
- 🚀 **全量执行**：确认后恢复全部工具，按步骤执行
- ☑️ **进度追踪**：AI 每完成一步输出 `[DONE:n]`，侧边 widget 实时勾选进度

### 使用方式

| 入口 | 说明 |
|---|---|
| `/plan` | 切换计划模式（只读 ⇄ 正常） |
| `Ctrl+Alt+P` | 同上，快捷键 |
| `pi --plan` | 启动时直接进入计划模式 |
| `/todos` | 查看当前计划进度 |
| 计划确认弹窗 | 执行计划 / 继续探索 / 修改计划 |

### 视觉反馈

- Plan 模式：输入框边框变为半透明橙色，footer 显示 `[ PLAN ]` 徽章
- 执行模式：widget 显示 `📋 2/5` 式进度，已完成步骤划线勾选

## 📦 安装

```bash
pi install npm:pi-planning
# 或从 GitHub
pi install git:github.com/Titor-Z/pi-planmode
```

## 🧠 工作原理

1. **激活**：`/plan` 后注入只读上下文，收窄工具集（保留 read/bash/grep 等，移除 edit/write）
2. **防护**：`tool_call` 拦截非白名单 Bash 命令（写文件、包管理、git 写操作、系统命令等 60+ 模式）
3. **提取**：回合结束从 AI 回复的 `Plan:` 段提取编号步骤
4. **执行**：用户确认后恢复完整工具集，逐步执行；`turn_end` 扫描 `[DONE:n]` 标记更新进度
5. **持久化**：状态写入会话（custom entry），`--resume` 恢复会话时自动还原进度

## 📁 结构

```
extensions/index.ts       薄入口：命令/快捷键/事件注册
extensions/mode-editor.ts 输入框边框变色（独立扩展，与主扩展共享状态）
src/state.ts              globalThis 共享状态（跨扩展通信）
src/utils.ts              纯函数：命令白名单、计划提取、进度标记
src/prompt.ts             注入给模型的提示词常量
```

## ⚠️ 说明

- npm 包名为 `pi-planning`；本 GitHub 仓库名为 `pi-planmode`（仓库名不受
  npm 规则约束）

- npm 上的 `pi-plan-mode`（qmx 维护）为无关项目；npm 名称混淆保护也不允许
  发布 `pi-planmode`（与 pi-plan-mode 过似），故定名 `pi-planning`
- Bash 白名单为保守设计：不在白名单内一律拦截，宁严勿松

## English

**pi-planning** adds plan mode to Pi Agent: a toggle that switches the agent into read-only exploration (write tools disabled, bash restricted to a safe allowlist), extracts numbered plan steps from the AI's "Plan:" section, then executes with full tool access while tracking progress via `[DONE:n]` markers. Includes an input-box border tint and progress widget. Install with `pi install npm:pi-planning`, toggle with `/plan` or Ctrl+Alt+P.

## License

MIT © 2026 Titor-Z

---

**Star 🌟 让每一次执行都先有计划。**
