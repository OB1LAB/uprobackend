import axios from "axios";
import fs from "fs";
import moment from "moment-timezone";
const weekdayConverter = {
  1: "Понедельник",
  2: "Вторник",
  3: "Среда",
  4: "Четверг",
  5: "Пятница",
  6: "Суббота",
};
const reWeekdayConverter = {
  Понедельник: 1,
  Вторник: 2,
  Среда: 3,
  Четверг: 4,
  Пятница: 5,
  Суббота: 6,
};
const weekdayDifference = {
  Понедельник: "в понедельник",
  Вторник: "во вторник",
  Среда: "в среду",
  Четверг: "в четверг",
  Пятница: "в пятницу",
  Суббота: "в субботу",
};
const lessonConverter = {
  1: "08:00-09:20",
  2: "09:35-10:55",
  3: "11:35-12:55",
  4: "13:10-14:30",
  5: "15:10-16:30",
  6: "16:45-18:05",
  7: "18:20-19:40",
  8: "19:55-21:15",
};
const getCurrentWeek = () => {
  return (
    moment().tz("Asia/Yekaterinburg").diff(moment("2024-09-02"), "weeks") + 1
  );
};
class Libs {
  groups = { 201: "6225", 202: "6226", 203: "6227", 204: "6228" };
  async getSchedule() {
    const scheduleData = {};
    for (const currentGroup of Object.keys(this.groups)) {
      scheduleData[currentGroup] = {};
      const bodyFormData = new FormData();
      bodyFormData.append("funct", "group_semestr");
      bodyFormData.append("group_id", this.groups[currentGroup]);
      const res = await axios.post(
        "https://isu.uust.ru/module/schedule/schedule_2024_script.php",
        bodyFormData,
      );
      const scheduleHtml = res.data.split("\n");
      scheduleHtml.forEach((line) => {
        const splitedLine = line.split("<br>");
        if (splitedLine.length === 5) {
          const lesson = line.split("$('#")[1].split("_")[0];
          const weekDay = line.split("_")[1];
          const lessonName = splitedLine[1].split(" (")[0];
          const lessonType = splitedLine[1]
            .replaceAll(" (", "(")
            .split("(")[1]
            .split(")")[0];
          const lessonTeacher = splitedLine[2];
          const lessonPos = splitedLine[3];
          const lessonTimes = [];
          splitedLine[4]
            .split(": ")[1]
            .split("<")[0]
            .split(",")
            .forEach((lessonWeek) => {
              const splitedWeek = lessonWeek.split("-");
              if (splitedWeek.length === 1) {
                lessonTimes.push(lessonWeek);
              } else {
                for (
                  let lessonWeekNum = parseInt(splitedWeek[0]);
                  lessonWeekNum <= parseInt(splitedWeek[1]);
                  lessonWeekNum++
                ) {
                  lessonTimes.push(lessonWeekNum.toString());
                }
              }
            });
          lessonTimes.forEach((weekLesson) => {
            if (!Object.keys(scheduleData[currentGroup]).includes(weekLesson)) {
              scheduleData[currentGroup][weekLesson] = {};
            }
            if (
              !Object.keys(scheduleData[currentGroup][weekLesson]).includes(
                weekdayConverter[weekDay],
              )
            ) {
              scheduleData[currentGroup][weekLesson][
                weekdayConverter[weekDay]
              ] = [];
            }
            scheduleData[currentGroup][weekLesson][
              weekdayConverter[weekDay]
            ].push({
              name: lessonName,
              type: lessonType,
              number: lesson,
              time: lessonConverter[lesson],
              teacher: lessonTeacher,
              pos: lessonPos,
            });
          });
        }
      });
      Object.keys(scheduleData[currentGroup]).forEach((weekDay) => {
        scheduleData[currentGroup][weekDay] = Object.keys(
          scheduleData[currentGroup][weekDay],
        )
          .sort((a, b) => reWeekdayConverter[a] - reWeekdayConverter[b])
          .reduce((obj, key) => {
            obj[key] = scheduleData[currentGroup][weekDay][key];
            return obj;
          }, {});
        Object.keys(scheduleData[currentGroup][weekDay]).forEach((weekName) => {
          scheduleData[currentGroup][weekDay][weekName].sort(
            (a, b) => parseInt(a.number) - parseInt(b.number),
          );
        });
      });
    }
    return scheduleData;
  }
  getDifferenceSchedule(oldSchedule, newSchedule) {
    const currentWeek = getCurrentWeek();
    const currentLogs = {};
    const totalLogs = {};
    Object.keys(this.groups).forEach((group) => {
      currentLogs[group] = {
        logs: [],
        weeksEdit: [],
      };
      totalLogs[group] = [];
      Object.keys(oldSchedule[group]).forEach((week) => {
        if (Object.keys(newSchedule[group]).includes(week)) {
          Object.keys(oldSchedule[group][week]).forEach((weekDay) => {
            if (Object.keys(newSchedule[group][week]).includes(weekDay)) {
              oldSchedule[group][week][weekDay].forEach((oldLesson) => {
                let oldCount = 0;
                let newCount = 0;
                oldSchedule[group][week][weekDay].forEach((newLesson) => {
                  if (
                    oldLesson.name === newLesson.name &&
                    oldLesson.type === newLesson.type &&
                    oldLesson.teacher === newLesson.teacher
                  ) {
                    oldCount += 1;
                  }
                });
                newSchedule[group][week][weekDay].forEach((newLesson) => {
                  if (
                    oldLesson.name === newLesson.name &&
                    oldLesson.type === newLesson.type &&
                    oldLesson.teacher === newLesson.teacher
                  ) {
                    newCount += 1;
                  }
                });
                if (oldCount > newCount) {
                  if (
                    parseInt(week) === currentWeek ||
                    parseInt(week) === currentWeek + 1
                  ) {
                    currentLogs[group].logs.push(
                      `Удалён предмет ${oldLesson.name} (${oldLesson.type}) ${weekdayDifference[weekDay]} на ${week} недели у группы ${group}Б`,
                    );
                    if (!currentLogs[group].weeksEdit.includes(week)) {
                      currentLogs[group].weeksEdit.push(week);
                    }
                  }
                  totalLogs[group].push(
                    `Удалён предмет ${oldLesson.name} (${oldLesson.type}) ${weekdayDifference[weekDay]} на ${week} недели у группы ${group}Б`,
                  );
                } else if (newCount > oldCount) {
                  if (
                    parseInt(week) === currentWeek ||
                    parseInt(week) === currentWeek + 1
                  ) {
                    currentLogs[group].logs.push(
                      `Добавлен предмет ${oldLesson.name} (${oldLesson.type}) ${weekdayDifference[weekDay]} на ${week} недели у группы ${group}Б`,
                    );
                    if (!currentLogs[group].weeksEdit.includes(week)) {
                      currentLogs[group].weeksEdit.push(week);
                    }
                  }
                  totalLogs[group].push(
                    `Добавлен предмет ${oldLesson.name} (${oldLesson.type}) ${weekdayDifference[weekDay]} на ${week} недели у группы ${group}Б`,
                  );
                }
              });
            } else {
              if (
                parseInt(week) === currentWeek ||
                parseInt(week) === currentWeek + 1
              ) {
                currentLogs[group].logs.push(
                  `Удален ${weekDay} на ${week} недели у группы ${group}Б`,
                );
                if (!currentLogs[group].weeksEdit.includes(week)) {
                  currentLogs[group].weeksEdit.push(week);
                }
              }
              totalLogs[group].push(
                `Удален ${weekDay} на ${week} недели у группы ${group}Б`,
              );
            }
          });
        } else {
          if (
            parseInt(week) === currentWeek ||
            parseInt(week) === currentWeek + 1
          ) {
            currentLogs.push(`Удалена ${week} неделя у группы ${group}Б`);
          }
          totalLogs.push(`Удалена ${week} неделя у группы ${group}Б`);
        }
      });
      Object.keys(newSchedule[group]).forEach((week) => {
        if (Object.keys(oldSchedule[group]).includes(week)) {
          Object.keys(newSchedule[group][week]).forEach((weekDay) => {
            if (Object.keys(oldSchedule[group][week]).includes(weekDay)) {
              newSchedule[group][week][weekDay].forEach((oldLesson) => {
                let oldCount = 0;
                let newCount = 0;
                oldSchedule[group][week][weekDay].forEach((newLesson) => {
                  if (
                    oldLesson.name === newLesson.name &&
                    oldLesson.type === newLesson.type &&
                    oldLesson.teacher === newLesson.teacher
                  ) {
                    oldCount += 1;
                  }
                });
                newSchedule[group][week][weekDay].forEach((newLesson) => {
                  if (
                    oldLesson.name === newLesson.name &&
                    oldLesson.type === newLesson.type &&
                    oldLesson.teacher === newLesson.teacher
                  ) {
                    newCount += 1;
                  }
                });
                if (oldCount > newCount) {
                  if (
                    parseInt(week) === currentWeek ||
                    parseInt(week) === currentWeek + 1
                  ) {
                    currentLogs[group].logs.push(
                      `Удалён предмет ${oldLesson.name} (${oldLesson.type}) ${weekdayDifference[weekDay]} на ${week} недели у группы ${group}Б`,
                    );
                    if (!currentLogs[group].weeksEdit.includes(week)) {
                      currentLogs[group].weeksEdit.push(week);
                    }
                  }
                  totalLogs[group].push(
                    `Удалён предмет ${oldLesson.name} (${oldLesson.type}) ${weekdayDifference[weekDay]} на ${week} недели у группы ${group}Б`,
                  );
                } else if (newCount > oldCount) {
                  if (
                    parseInt(week) === currentWeek ||
                    parseInt(week) === currentWeek + 1
                  ) {
                    currentLogs[group].logs.push(
                      `Добавлен предмет ${oldLesson.name} (${oldLesson.type}) ${weekdayDifference[weekDay]} на ${week} недели у группы ${group}Б`,
                    );
                    if (!currentLogs[group].weeksEdit.includes(week)) {
                      currentLogs[group].weeksEdit.push(week);
                    }
                  }
                  totalLogs[group].push(
                    `Добавлен предмет ${oldLesson.name} (${oldLesson.type}) ${weekdayDifference[weekDay]} на ${week} недели у группы ${group}Б`,
                  );
                } else if (
                  newCount === 1 &&
                  (parseInt(week) === currentWeek ||
                    parseInt(week) === currentWeek + 1)
                ) {
                  const findLesson = oldSchedule[group][week][weekDay].find(
                    (newLesson) => {
                      return (
                        oldLesson.name === newLesson.name &&
                        oldLesson.type === newLesson.type &&
                        oldLesson.teacher === newLesson.teacher
                      );
                    },
                  );
                  if (oldLesson.pos !== findLesson.pos) {
                    currentLogs[group].logs.push(
                      `Изменена аудитория предмета ${oldLesson.name} (${oldLesson.type}) с ${findLesson.pos} на ${oldLesson.pos} ${weekdayDifference[weekDay]} на ${week} недели у группы ${group}Б`,
                    );
                    if (!currentLogs[group].weeksEdit.includes(week)) {
                      currentLogs[group].weeksEdit.push(week);
                    }
                  }
                }
              });
            }
          });
        }
      });
      currentLogs[group].logs = Array.from(new Set(currentLogs[group].logs));
      currentLogs[group].weeksEdit.sort();
      totalLogs[group] = Array.from(new Set(totalLogs[group]));
    });
    return {
      totalLogs,
      currentLogs,
    };
  }
  async generateDifference() {
    let isEdit = false;
    const newSchedule = await this.getSchedule();
    const oldSchedule = JSON.parse(fs.readFileSync(`schedule.json`).toString());
    const { currentLogs, totalLogs } = this.getDifferenceSchedule(
      newSchedule,
      oldSchedule,
    );
    Object.keys(totalLogs).forEach((group) => {
      if (totalLogs[group].length > 0) {
        isEdit = true;
      }
    });
    if (isEdit) {
      fs.writeFileSync(`schedule.json`, JSON.stringify(newSchedule), () => {});
    }
    return {
      currentLogs,
      totalLogs,
    };
  }
}

export default new Libs();
