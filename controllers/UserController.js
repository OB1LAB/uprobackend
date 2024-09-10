import UserService from "../services/user-service.js";

class UserController {
  async getUsers(req, res, next) {
    try {
      const users = await UserService.getUsers();
      const returnedUsers = {};
      users.forEach((user) => {
        returnedUsers[user.id] = {
          selectedGroup: user.group,
          schedules: JSON.parse(user.scheduler),
        };
      });
      res.json(returnedUsers);
    } catch (e) {
      next(e);
    }
  }
  async createUser(req, res, next) {
    try {
      const { userId, name, group } = req.body;
      await UserService.create(userId, name, group);
      res.json("");
    } catch (e) {
      next(e);
    }
  }
  async setGroup(req, res, next) {
    try {
      const { userId, group } = req.body;
      await UserService.setGroup(userId, group);
      res.json("");
    } catch (e) {
      next(e);
    }
  }
  async setScheduler(req, res, next) {
    try {
      const { userId, scheduler } = req.body;
      await UserService.setScheduler(userId, scheduler);
      res.json("");
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
