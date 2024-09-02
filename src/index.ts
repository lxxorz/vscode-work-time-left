import { commands, window, workspace, StatusBarAlignment, languages } from 'vscode';
import type { ExtensionContext, StatusBarItem } from 'vscode';
import CommandFn from './commands';

import { formatDate, formatDistanceToNowStrict } from 'date-fns';
import * as locale from 'date-fns/locale';
import { Config, FLAG } from './config';
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

function updateStatusBar() {
  const localeKey = localesMap[Config.locale] as keyof typeof locale;
  const distance = formatDistanceToNowStrict(getStrictTime(), {
    locale: locale[localeKey],
  });

  const distance_seconds = (new Date(getStrictTime()).getTime() - new Date().getTime()) / 1000;
  const distance_minitues = distance_seconds / 60;

  if(Config.enableRemind && distance_minitues < Config.remindTime && !FLAG.todayRemind) {    window.showInformationMessage(Config.remindText);
    FLAG.todayRemind = true;
  }

  if (!statusBar) {
    statusBar = window.createStatusBarItem(StatusBarAlignment.Left, 0);
    statusBar.command = 'work-time-left.setTime';
    statusBar.show();
  }
  statusBar.text = distance_seconds < 1 ? `-${distance}` : distance;
  statusBar.color = Config.textColor;
  statusBar.tooltip = formatDate(getStrictTime(), 'yyyy-MM-dd HH:mm:ss', {
    locale: locale[localeKey],
  });
}

export function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand('work-time-left.setTime', CommandFn.setTime);
  context.subscriptions.push(disposable);

  updateStatusBar();

  interval = setInterval(updateStatusBar, 1000 * 10);

  context.subscriptions.push({
    dispose: () => clearInterval(interval),
  });

  const configChangeDisposable = workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('work-time-left.time') || event.affectsConfiguration('work-time-left.textColor') || event.affectsConfiguration('work-time-left.locale')) {
      updateStatusBar();
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
