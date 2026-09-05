/**
 * Mode Editor —— 让输入框边框随模式变色（类似 opencode 的模式切换视觉反馈）
 *
 * - plan 模式:   半透明橙边框（[ PLAN ] 徽章统一显示在 DeepSeek footer 左侧）
 * - 正常/执行模式: 主题默认边框
 *
 * 通过 src/state.ts（globalThis 共享）与 plan-mode 扩展联动：
 * /plan、Ctrl+Alt+P、--plan 都会实时反映到输入框上。
 */

import { CustomEditor, type ExtensionAPI, type KeybindingsManager } from "@earendil-works/pi-coding-agent";
import type { EditorTheme, TUI } from "@earendil-works/pi-tui";
import { isPlanMode, onPlanModeChange, PLAN_BORDER } from "../src/state.ts";

class ModeEditor extends CustomEditor {
	private lastPlanMode: boolean | null = null;
	private defaultBorder: (text: string) => string;

	constructor(
		tui: TUI,
		theme: EditorTheme,
		keybindings: KeybindingsManager,
		private planBorder: (text: string) => string,
	) {
		super(tui, theme, keybindings);
		// 保存默认边框色。注意：pi 的 setCustomEditorComponent 在工厂返回后会把
		// borderColor 强制覆盖为默认值，因此这里只保存引用，真正的换色在 render()
		// 每次渲染前重新安装（见 render）。
		this.defaultBorder = theme.borderColor;
	}

	render(width: number): string[] {
		// pi 会覆盖构造时设置的 borderColor，所以每次渲染前重新安装我们的着色函数
		this.borderColor = isPlanMode() ? this.planBorder : this.defaultBorder;

		const planMode = isPlanMode();
		if (planMode !== this.lastPlanMode) {
			this.lastPlanMode = planMode;
			// 模式翻转时主动请求一次重绘，保证颜色立即生效
			this.tui.requestRender();
		}

		return super.render(width);
	}
}

export default function (pi: ExtensionAPI) {
	pi.on("session_start", (_event, ctx) => {
		ctx.ui.setEditorComponent((tui, theme, keybindings) => {
			// 状态变化（含退出 plan）时立即重绘，保证颜色即时生效
			onPlanModeChange(() => tui.requestRender());
			return new ModeEditor(tui, theme, keybindings, PLAN_BORDER);
		});
	});
}
