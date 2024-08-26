import * as vscode from 'vscode';
export default {
  async setTime() {
    const time = await vscode.window.showInputBox({
      prompt: 'Please enter the time (format: HH:mm:ss)',
      placeHolder: 'e.g. 18:30:00',
    });

    if (time) {
      vscode.window.showInformationMessage(`Time has been set to: ${time}`);
    } else {
      vscode.window.showWarningMessage('No time entered');
    }
  },
};
