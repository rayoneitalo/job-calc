const Profile = require("../model/Profile");

module.exports = {
  async index(req, res) {
    return res.render("profile", { profile: await Profile.get() });
  },

  async update(req, res) {
    const data = req.body;
    const weeksPerYear = 52;
    const weeksPerMonth = (weeksPerYear - data.vacationPerYear) / 12;
    const weekTotalHours = data.hoursPerDay * data.daysPerWeek;
    const monthlyTotalHours = weekTotalHours * weeksPerMonth;

    const hours = data.monthlyBudget / monthlyTotalHours;

    const profile = await Profile.get();

    await Profile.update({
      ...profile,
      ...req.body,
      valueHour: hours,
    });

    return res.redirect("/profile");
  },
};
