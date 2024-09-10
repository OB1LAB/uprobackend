import * as fs from "fs";
import libs from "../libs.js";
class ScheduleController {
  async get(req, res, next) {
    try {
      res.json(schedule);
    } catch (e) {
      next(e);
    }
  }
  async getDifference(req, res, next) {
    try {
      const data = await libs.generateDifference();
      schedule = JSON.parse(fs.readFileSync(`schedule.json`).toString());
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
}

let schedule = JSON.parse(fs.readFileSync(`schedule.json`).toString());
export default new ScheduleController();
