let data = []; //name | budget | dailyHours | remaining | status | lastId | createdAt | totalHours

module.exports = {
  get() {
    return data;
  },

  update(newJob) {
    data = newJob;
  },

  delete(id) {
    data = data.filter((job) => Number(job.id) != id);
  },
};
