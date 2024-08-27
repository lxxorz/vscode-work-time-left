import { workspace} from 'vscode';
import localeMap from "./locales.json";

export function getConfig<T>(key: string, v?: T) {
  return workspace.getConfiguration().get(`work-time-left.${key}`, v);
}

export const Config = {
  get textColor() {
    return getConfig('textColor', "#4299aa")!;
  },

  get time() {
    return getConfig("time", "18:00:00")!;
  },

  get locale() {
    return getConfig<keyof typeof localeMap >("locale", "en-US")!;
  }
};

