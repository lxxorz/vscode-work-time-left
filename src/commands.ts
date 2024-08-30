import * as vscode from 'vscode';
import { FLAG } from './config';
export default {
  async setTime() {
    const time = await vscode.window.showInputBox({
      prompt: 'Please enter the time (format: HH:mm:ss)',
      placeHolder: 'e.g. 18:30:00',
    });

    if (time) {
      const reg = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
      if (!reg.test(time)) {
        vscode.window.showErrorMessage('Invalid time format');
        return;
      }
      FLAG.todayRemind = false;
      vscode.workspace.getConfiguration().update('work-time-left.time', time, true);
      vscode.window.showInformationMessage(`Time has been set to: ${time}`);
    }
  },
};
