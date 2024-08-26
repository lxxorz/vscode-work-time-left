import { workspace, env } from 'vscode';

export function getConfig<T>(key: string, v?: T) {
  return workspace.getConfiguration().get(`work-time-left.${key}`, v);
}

export const Config = {
  get textColor() {
    return getConfig('textColor', "#4299aa")!;
  },

  get time() {
    return getConfig("time", "18:00:00")!;
  }
};

export const language = env.language;
