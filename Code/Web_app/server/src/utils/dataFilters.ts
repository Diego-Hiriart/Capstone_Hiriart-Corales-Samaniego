import { User } from "@prisma/client";

export function removePasswordInUser(user: User) {
  const obj: Partial<Pick<User, "password">> & Omit<User, "password"> = user;
  delete obj["password"];
  return obj;
}
