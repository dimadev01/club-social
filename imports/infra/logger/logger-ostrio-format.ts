export interface LoggerOstrioFormat {
  additional: unknown;
  date: Date;
  level: string;
  message: string;
  timestamp: number;
  userId: string;
}
