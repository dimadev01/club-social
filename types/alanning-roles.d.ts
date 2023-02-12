declare module 'meteor/alanning-roles' {
  interface IMigrationConfig {
    down: () => void;
    name: string;
    up: () => void;
    version: number;
  }

  const Migrations: {
    add(value: IMigrationConfig): void;
    config(value: any): void;
    getVersion(): number;
    migrateTo(version: string | number): void;
    unlock(): void;
  };
}
