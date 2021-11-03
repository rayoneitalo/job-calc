const Profile = require("../model/Profile");
const JobUtils = require("../utils/JobUtils");
const Job = require("../model/Job");

module.exports = {
  index(req, res) {
    let statusCount = {
      progress: 0,
      done: 0,
      total: Job.get().length,
    };

    let jobTotalHours = 0;

    const updatedJobs = Job.get().map((job) => {
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
        budget: JobUtils.calculateBudget(job, Profile.get().valueHour),
      };
    });

    const freeHours = Profile.get().hoursPerDay - jobTotalHours;

    return res.render("index", {
      profile: Profile.get(),
      jobs: updatedJobs,
      statusCount: statusCount,
      freeHours: freeHours,
    });
  },
};
