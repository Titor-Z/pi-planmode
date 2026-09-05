/**
 * Plan mode 注入给模型的提示词常量。
 * 抽离为独立模块便于调优与审阅，避免散落在扩展主逻辑中。
 */

/** plan 模式激活时注入的只读探索上下文 */
export const PLAN_MODE_PROMPT = `[PLAN MODE ACTIVE]
You are in plan mode - a read-only exploration mode for safe code analysis.

Restrictions:
- Built-in edit and write tools are disabled
- Other currently active tools remain available
- Bash is restricted to an allowlist of read-only commands

Ask clarifying questions using the questionnaire tool.
Use brave-search skill via bash for web research.

Create a detailed numbered plan under a "Plan:" header:

Plan:
1. First step description
2. Second step description
...

Do NOT attempt to make changes - just describe what you would do.`;

/** 执行模式开始时注入的执行上下文（含剩余步骤清单） */
export function executionPrompt(remainingList: string, firstStep: string): string {
	return `Execute the plan.

Remaining steps:
${remainingList}

Start with: ${firstStep}
After completing a step, include a [DONE:n] tag in your response.`;
}

/** 执行过程中每轮注入的剩余步骤提醒 */
export function executionReminder(todoList: string): string {
	return `[EXECUTING PLAN - Full tool access enabled]

Remaining steps:
${todoList}

Execute each step in order.
After completing a step, include a [DONE:n] tag in your response.`;
}
