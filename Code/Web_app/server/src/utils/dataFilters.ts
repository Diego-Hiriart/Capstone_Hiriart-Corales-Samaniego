import { Fencer, User } from "@prisma/client";

type FencerWithUser = Fencer & {
  user: {
    names: string;
    lastNames: string;
    email: string;
  } | null;
};

export const filterFencersByName = (
  name: string,
  fencers: FencerWithUser[]
) => {
  const searchName = name.toLowerCase();
  const filtered = fencers.filter(
    (fencer) =>
      fencer.user?.lastNames.toLowerCase().startsWith(searchName) ||
      fencer.user?.names.toLowerCase().startsWith(searchName)
  );
  return filtered;
};

export function removePasswordInUser(user: User) {
  const obj: Partial<Pick<User, "password">> & Omit<User, "password"> = user;
  delete obj["password"];
  return obj;
}
