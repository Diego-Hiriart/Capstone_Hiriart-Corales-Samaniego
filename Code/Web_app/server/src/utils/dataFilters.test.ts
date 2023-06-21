import { removePasswordInUser } from "./dataFilters";

const user = {
  userID: 1,
  email: "pestrella@gmail.com",
  password: "password123",
  names: "Patricio",
  lastNames: "Estrella",
  roles: ["fencer"],
  updatedAt: new Date(),
  createdAt: new Date(),
  deletedAt: null,
};

const userWithoutPass = {
  userID: 1,
  email: "pestrella@gmail.com",
  names: "Patricio",
  lastNames: "Estrella",
  roles: ["fencer"],
  updatedAt: new Date(),
  createdAt: new Date(),
  deletedAt: null,
};

describe("dataFilters", () => {
  describe("removePasswordInUser", () => {
    it("return a User object with the attr password removed", () => {
      expect(removePasswordInUser(user)).toStrictEqual(userWithoutPass);
    });
  });
});
