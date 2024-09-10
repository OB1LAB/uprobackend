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
      res.json(await libs.generateDifference());
    } catch (e) {
      next(e);
    }
  }
}

const schedule = JSON.parse(fs.readFileSync(`schedule.json`).toString());
export default new ScheduleController();
