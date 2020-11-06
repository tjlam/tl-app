const xTimeHasPassed = (timeAmountMs, prevTime) => {
  const currentTime = new Date(Date.now());
  const diff = Math.floor(currentTime - prevTime);
  return diff > timeAmountMs;
};

module.exports = {
  xTimeHasPassed: xTimeHasPassed,
};
