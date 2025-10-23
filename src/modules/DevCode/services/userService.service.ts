import { User, IUser } from "@models/user.model";

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  const user = new User(data);
  return await user.save();
};

export const getUsers = async (): Promise<IUser[]> => {
  return await User.find().select("+contraseña"); // select si quieres incluir contraseña
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

export const updateUser = async (id: string, data: Partial<IUser>): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};
