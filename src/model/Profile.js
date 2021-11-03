let data = {
  name: "Italo Rayone",
  avatar: "https://avatars.githubusercontent.com/ItaloRayonne",
  monthlyBudget: 3500,
  daysPerWeek: 5,
  hoursPerDay: 12,
  vacationPerYear: 4,
  valueHour: 14.58,
};

module.exports = {
  get() {
    return data;
  },

  update(newData) {
    data = newData;
  },
};
