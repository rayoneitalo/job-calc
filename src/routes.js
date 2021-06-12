const express = require("express");
const routes = express.Router();

const views = __dirname + "/views/";

const Profile = {
    data: {
        name: "Italo Rayone",
        avatar: "https://github.com/ItaloRayonne.png",
        monthlyBudget: 3000,
        daysPerWeek: 5,
        hoursPerDay: 5,
        vacationPerYear: 4,
        valueHour: 45,
    },
    controllers: {
        index(req, res) {
            return res.render(views + "profile", { profile: Profile.data });
        },
    },
};

const Job = {
    // Valores do Array Job
    //name | budget | dailyHours | remaining | status | lastId | createdAt | totalHours
    data: [],
    controllers: {
        index(req, res) {
            const updatedJobs = Job.data.map((job) => {
                const remaining = Job.services.remainingDays(job);
                const status = remaining <= 0 ? "done" : "progress";

                return {
                    ...job,
                    remaining,
                    status,
                    budget: Profile.data.valueHour * job.totalHours,
                };
            });

            return res.render(views + "index", { profile: Profile.data, jobs: updatedJobs });
        },

        create(req, res) {
            return res.render(views + "job");
        },

        save(req, res) {
            const name = req.body.name;
            const dailyHours = req.body["daily-hours"];
            const totalHours = req.body["total-hours"];
            const createdAt = Date.now();
            const lastId = Job.data[Job.data.length - 1]?.id || 1;

            Job.data.push({
                id: lastId + 1,
                createdAt,
                name,
                dailyHours,
                totalHours,
            });
            return res.redirect("/");
        },
    },
    services: {
        remainingDays(job) {
            const remainingdays = job.totalHours / job.dailyHours;
            const createdDate = new Date(job.createdAt);
            const dueDay = createdDate.getDate() + Number(remainingdays);
            const dueDateInMs = createdDate.setDate(dueDay);
            const timeDiffInMs = dueDateInMs - Date.now();
            const dayInMs = 1000 * 60 * 60 * 24;
            const dayDiff = Math.floor(timeDiffInMs / dayInMs);

            return dayDiff;
        },
    },
};

routes.get("/", Job.controllers.index);
routes.get("/job", Job.controllers.create);
routes.get("/job/edit", (req, res) => res.render(views + "job-edit"));
routes.get("/profile", Profile.controllers.index);
routes.post("/job", Job.controllers.save);

module.exports = routes;
