/**
 * plan 模式共享状态与样式常量（跨扩展通信）。
 *
 * 重要：pi 的扩展加载器用 moduleCache:false 的 jiti 加载扩展，
 * 同一个模块在不同扩展里会被求值成不同实例。
 * 因此状态必须挂到 globalThis 上，才能保证 plan-mode 写入、
 * mode-editor 读取到的是同一个对象。
 * （常量是字符串/纯函数，各实例自带一份相同值即可，无影响。）
 */

interface PlanModeSharedState {
	enabled: boolean;
	listeners: Set<() => void>;
}

const GLOBAL_KEY = "__pi_plan_mode_shared_state__";

function getState(): PlanModeSharedState {
	const g = globalThis as Record<string, unknown>;
	const existing = g[GLOBAL_KEY] as PlanModeSharedState | undefined;
	if (existing) return existing;
	const state: PlanModeSharedState = { enabled: false, listeners: new Set() };
	g[GLOBAL_KEY] = state;
	return state;
}

export function setPlanMode(enabled: boolean): void {
	const s = getState();
	s.enabled = enabled;
	for (const listener of s.listeners) listener();
}

export function isPlanMode(): boolean {
	return getState().enabled;
}

/** 订阅模式变化，返回取消订阅函数。用于触发 UI 重绘。 */
export function onPlanModeChange(listener: () => void): () => void {
	const s = getState();
	s.listeners.add(listener);
	return () => {
		s.listeners.delete(listener);
	};
}

/** 橙色背景 + 白色字体的 [ PLAN ] 徽章（ANSI 256 色 208 = 橙色，97 = 亮白） */
export const PLAN_BADGE = "\x1b[48;5;208m\x1b[97m PLAN \x1b[0m";

/**
 * 半透明橙色边框（dim 橙色，模拟半透明质感；不支持 dim 的终端会回退为亮橙）。
 * 用在输入框边框上，与 footer 里的实心橙色徽章区分层次。
 */
export const PLAN_BORDER = (text: string): string => `\x1b[2m\x1b[38;5;208m${text}\x1b[0m`;
