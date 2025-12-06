export interface UserInterface {
  authId: string;
  createdAt: Date;
  createdBy: string;
  deletedAt: Date | null;
  deletedBy: null | string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  updatedAt: Date;
  updatedBy: string;
}
