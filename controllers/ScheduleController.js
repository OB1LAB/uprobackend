import * as fs from "fs";
class ScheduleController {
  async get(req, res, next) {
    res.json(schedule);
  }
}

const schedule = JSON.parse(fs.readFileSync(`schedule.json`).toString());
export default new ScheduleController();
