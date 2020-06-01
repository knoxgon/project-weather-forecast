export const dateTimeToDay = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const dayDigit = new Date(date).getDay();

  switch (dayDigit) {
    case 1:
      return 'Mon';
    case 2:
      return 'Tue';
    case 3:
      return 'Wed';
    case 4:
      return 'Thu';
    case 5:
      return 'Fri';
    case 6:
      return 'Sat';
    case 7:
      return 'Sun';
    default:
      return '';
  }
};

export const dateTimeToFullDate = (timestamp) => {
  const monthNamesAbbreviated = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  const date = new Date(timestamp * 1000);
  // eslint-disable-next-line operator-linebreak
  const day =
    date.getDay() > 0 && date.getDay() < 10
      ? `0${date.getDay()}`
      : date.getDay();
  const month = monthNamesAbbreviated[date.getMonth()];
  const year = date.getFullYear();

  return `${day} - ${month} / ${year}`;
};
