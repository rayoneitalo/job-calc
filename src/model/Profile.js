const Database = require("../database/config");

module.exports = {
  async get() {
    const db = await Database();

    const data = await db.get(`SELECT * FROM profile`);

    db.close();

    return {
      name: data.name,
      avatar: data.avatar_url,
      monthlyBudget: data.monthly_budget,
      hoursPerDay: data.hours_per_day,
      daysPerWeek: data.days_per_week,
      vacationPerYear: data.vacation_per_year,
      valueHour: data.value_hour,
    };
  },

  async update(newData) {
    const db = await Database();

    db.run(`

      UPDATE profile 
      SET name              = "${newData.name}",
          avatar_url        = "${newData.avatar}",
          monthly_budget    = ${newData.monthlyBudget},
          hours_per_day     = ${newData.hoursPerDay},
          days_per_week     = ${newData.daysPerWeek},
          vacation_per_year = ${newData.vacationPerYear},
          value_hour        = ${newData.valueHour}

    `);

    db.close();
  },
};
