const express = require("express");
const routes = express.Router();

const views = __dirname + "/views/";

const Profile = {
    data: {
        name: "",
        avatar: "",
        monthlyBudget: 0,
        daysPerWeek: 0,
        hoursPerDay: 0,
        vacationPerYear: 0,
        valueHour: 0,
    },
    controllers: {
        index(req, res) {
            return res.render(views + "profile", { profile: Profile.data });
        },

        update(req, res) {
            //req.body para pegar os dados do profile
            const data = req.body;
            const weeksPerYear = 52;
            const weeksPerMonth = (weeksPerYear - data.vacationPerYear) / 12;
            const weekTotalHours = data.hoursPerDay * data.daysPerWeek;
            const monthlyTotalHours = weekTotalHours * weeksPerMonth;

            const hours = data.monthlyBudget / monthlyTotalHours;

            Profile.data = {
                ...Profile.data,
                ...req.body,
                valueHour: hours,
            };

            return res.redirect("/profile");
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
                    budget: Job.services.calculateBudget(job, Profile.data.valueHour),
                };
            });

            return res.render(views + "index", {
                profile: Profile.data,
                jobs: updatedJobs,
            });
        },

        create(req, res) {
            return res.render(views + "job");
        },

        save(req, res) {
            const { name, dailyHours, totalHours } = req.body;
            const createdAt = Date.now();
            const lastId = Job.data[Job.data.length - 1]?.id || 0;

            Job.data.push({
                id: lastId + 1,
                createdAt,
                name,
                dailyHours,
                totalHours,
            });
            return res.redirect("/");
        },

        show(req, res) {
            const jobId = req.params.id;

            const job = Job.data.find((job) => Number(job.id) === Number(jobId));

            if (!job) {
                return res.send("Job not found!");
            }

            job.budget = Job.services.calculateBudget(job, Profile.data.valueHour);

            return res.render(views + "job-edit", { job });
        },

        update(req, res) {
            const jobId = req.params.id;

            const job = Job.data.find((job) => Number(job.id) === Number(jobId));

            if (!job) {
                return res.send("Job not found!");
            }

            const updatedJob = {
                ...job,
                name: req.body.name,
                totalHours: req.body.totalHours,
                dailyHours: req.body.dailyHours,
            };

            Job.data = Job.data.map((job) => {
                if (Number(job.id) === Number(jobId)) {
                    job = updatedJob;
                }

                return job;
            });

            res.redirect("/");
        },

        delete(req, res) {
            const jobId = req.params.id;

            Job.data = Job.data.filter(job => Number(job.id) != Number(jobId));

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

        calculateBudget: (job, valueHour) => valueHour * job.totalHours,
    },
};

routes.get("/", Job.controllers.index);
routes.get("/job", Job.controllers.create);
routes.post("/job", Job.controllers.save);
routes.get("/job/:id", Job.controllers.show);
routes.post("/job/:id", Job.controllers.update);
routes.post("/job/delete/:id", Job.controllers.delete);
routes.get("/profile", Profile.controllers.index);
routes.post("/profile", Profile.controllers.update);

module.exports = routes;
