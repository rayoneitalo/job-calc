const Profile = require("../model/Profile");
const JobUtils = require("../utils/JobUtils");
const Job = require("../model/Job");

module.exports = {
  async index(req, res) {
    const profile = await Profile.get();
    const jobs = await Job.get();

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      statusCount[status] += 1;

      jobTotalHours =
        status == "progress"
          ? jobTotalHours + Number(job.dailyHours)
          : jobTotalHours;

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile.valueHour),
      };
    });

    const freeHours = profile.hoursPerDay - jobTotalHours;

    return res.render("index", {
      profile: profile,
      jobs: updatedJobs,
      statusCount: statusCount,
      freeHours: freeHours,
    });
  },
};
