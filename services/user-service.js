import { UserModel } from "../models/models.js";

class UserService {
  async getUsers() {
    return await UserModel.findAll();
  }
  async create(userId, name, group) {
    return await UserModel.create({
      id: userId,
      name,
      group,
      scheduler: JSON.stringify([]),
    });
  }
  async setGroup(userId, group) {
    return await UserModel.update({ group }, { where: { id: userId } });
  }
  async setScheduler(userId, scheduler) {
    await UserModel.update(
      { scheduler: JSON.stringify(scheduler) },
      { where: { id: userId } },
    );
  }
}

export default new UserService();
