import {commands, window,  StatusBarAlignment}  from 'vscode';
import type { ExtensionContext, StatusBarItem } from 'vscode';
import CommandFn from './commands';

import {formatDistanceToNowStrict} from "date-fns";
import {zhCN, enUS, ja} from "date-fns/locale";
import { Config, language } from './config';
import localesMap from "./language.json";

let statusBar: StatusBarItem;
let interval: ReturnType<typeof setInterval>;
const locales = {
	zhCN,
	enUS,
	ja
};

type LocaleKey = keyof typeof locales;

function getStrictTime() {
	const endTime = Config.time
		.split(":")
		.map(Number);
	const date = new Date();
	date.setHours(endTime[0]);
	date.setMinutes(endTime[1]);
	date.setSeconds(endTime[2]);
	return date;
}

function showStatusBar() {
	const distance = formatDistanceToNowStrict(
		getStrictTime(),
		{
			locale: locales[localesMap[language as keyof typeof localesMap] as LocaleKey] ?? enUS
		}
	);

	if(!statusBar) {
		statusBar = window.createStatusBarItem(StatusBarAlignment.Left, 0);
		statusBar.command = 'work-time-left.setTime';
		statusBar.tooltip = 'Set Time';
		statusBar.show();
	}
  statusBar.text = distance;
	statusBar.color = Config.textColor;
}

export function activate(context: ExtensionContext) {
	const disposable = commands.registerCommand('work-time-left.setTime', CommandFn.setTime);
	context.subscriptions.push(disposable);

	showStatusBar();

	interval = setInterval(showStatusBar, 1000 * 30);

	context.subscriptions.push({
		dispose: () => clearInterval(interval)
	});
}

export function deactivate() {
	if(interval) {
		clearInterval(interval);
	}

	if(statusBar) {
		statusBar.dispose();
	}
}
