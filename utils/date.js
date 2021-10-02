const setTime = (date, hour, min, ampm) => {
  const d = new Date(date.valueOf());
  d.setHours(ampm === "AM" ? hour : hour + 12);
  d.setMinutes(min);
  d.setSeconds(0);
  return d;
};

const addHours = (date, hours) => {
  const d = new Date(date.valueOf());
  d.setHours(d.getHours() + hours);
  return d;
};

const addMinutes = (date, minutes) => {
  const d = new Date(date.valueOf());
  d.setMinutes(d.getMinutes() + minutes);
  return d;
};

module.exports = { setTime, addHours, addMinutes };
