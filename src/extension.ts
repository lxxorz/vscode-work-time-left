import { commands, window, workspace, StatusBarAlignment, languages } from 'vscode';
import type { ExtensionContext, StatusBarItem } from 'vscode';
import CommandFn from './commands';

import { formatDistanceToNowStrict } from 'date-fns';
import * as locale from 'date-fns/locale';
import { Config } from './config';
import localesMap from './locales.json';

let statusBar: StatusBarItem;
let interval: ReturnType<typeof setInterval>;
function getStrictTime() {
  const endTime = Config.time.split(':').map(Number);
  const date = new Date();
  date.setHours(endTime[0]);
  date.setMinutes(endTime[1]);
  date.setSeconds(endTime[2]);
  return date;
}

function showStatusBar() {
  const localeKey = localesMap[Config.locale] as keyof typeof locale;
  const distance = formatDistanceToNowStrict(getStrictTime(), {
    locale: locale[localeKey],
  });

  if (!statusBar) {
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
    dispose: () => clearInterval(interval),
  });

  const configChangeDisposable = workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('work-time-left.time') || event.affectsConfiguration('work-time-left.textColor') || event.affectsConfiguration('work-time-left.locale')) {
      showStatusBar();
    }
  });
  context.subscriptions.push(configChangeDisposable);
}

export function deactivate() {
  if (interval) {
    clearInterval(interval);
  }

  if (statusBar) {
    statusBar.dispose();
  }
}
