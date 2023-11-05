export interface IRemovablePort {
  removeById(id: string): Promise<void>;
}
