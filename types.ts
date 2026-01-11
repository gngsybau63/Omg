export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export enum BypassMethod {
  OVER_13 = "13+ ACCOUNT (COOKIE)",
  UNDER_13 = "UNDER 13 ACCOUNT (COOKIE)"
}

export interface BypassConfig {
  method: BypassMethod;
  cookie: string;
}
