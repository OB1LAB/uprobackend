import * as fs from "fs";
import libs from "../libs.js";
class ScheduleController {
  constructor() {
    this.schedule = JSON.parse(fs.readFileSync(`schedule.json`).toString());
  }
  async get(req, res, next) {
    try {
      res.json(this.schedule);
    } catch (e) {
      next(e);
    }
  }
  async getDifference(req, res, next) {
    try {
      const data = await libs.generateDifference();
      this.schedule = JSON.parse(fs.readFileSync(`schedule.json`).toString());
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
}

export default new ScheduleController();
