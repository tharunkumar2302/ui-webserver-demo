function betweenRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getPassedDateAndMidnight(date) {
  const midNightDate = new Date(new Date(date).setHours(5, 30, 0, 0));
  const tdata = new Date(new Date(date).setHours(29, 30, 0, 0));
  return {
    date: tdata,
    midNight: midNightDate,
  };
}

function lastMonth(month, year) {
  return (new Date(year, month,0)).getDate() - 9;
}

function getPreviousMonthDate(date) {
  const dateNew = new Date(date);
  return new Date(dateNew.setMonth(dateNew.getMonth() - 1 < 0 ? 12 : dateNew.getMonth() - 1));
}


const generalEmails = ['gmail','hotmail','outlook','yahoo','icloud','aol','protonmail','zoho','mail','gmx','fastmail'];
module.exports = { betweenRandomNumber, getPassedDateAndMidnight, lastMonth, getPreviousMonthDate,generalEmails };
