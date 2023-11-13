import usersModel from "./models/users.model.js";

export default class Users {
  getAll = async () => {
    const users = await usersModel.find().lean();
    return users;
  };
  getOne = async (userParams) => {
    const exists = await usersModel.findOne(userParams).lean();
    return exists;
  };

  create = async ({ first_name, last_name, email, age, password }) => {
    const result = usersModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
    });
    return result;
  };
}
