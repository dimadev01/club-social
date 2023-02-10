export interface ILoggerFormat {
  additional: unknown;

  date: Date;

  level: string;

  message: string;

  timestamp: number;

  userId: string;
}
