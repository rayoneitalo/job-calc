const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  create(req, res) {
    return res.render("job");
  },

  save(req, res) {
    const { name, dailyHours, totalHours } = req.body;
    const createdAt = Date.now();
    const lastId = Job.get()[Job.get().length - 1]?.id || 0;

    Job.get().push({
      id: lastId + 1,
      name,
      totalHours,
      dailyHours,
      createdAt,
    });

    return res.redirect("/");
  },

  show(req, res) {
    const jobId = req.params.id;

    const job = Job.get().find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    job.budget = JobUtils.calculateBudget(job, Profile.get().valueHour);

    return res.render("job-edit", { job });
  },

  update(req, res) {
    const jobId = req.params.id;

    const job = Job.get().find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    const updatedJob = {
      ...job,
      name: req.body.name,
      totalHours: req.body.totalHours,
      dailyHours: req.body.dailyHours,
    };

    const newJobs = Job.get().map((job) => {
      if (Number(job.id) === Number(jobId)) {
        job = updatedJob;
      }

      return job;
    });

    Job.update(newJobs);

    res.redirect("/job/" + jobId);
  },

  delete(req, res) {
    const jobId = req.params.id;

    Job.delete(jobId);

    return res.redirect("/");
  },
};
