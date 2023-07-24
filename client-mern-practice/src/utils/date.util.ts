export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const currentDate = new Date();
  const timeDiffInMs = currentDate.getTime() - date.getTime();

  // Calculate time differences in seconds, minutes, hours, days, and weeks
  const secondsDiff = Math.floor(timeDiffInMs / 1000);
  const minutesDiff = Math.floor(secondsDiff / 60);
  const hoursDiff = Math.floor(minutesDiff / 60);
  const daysDiff = Math.floor(hoursDiff / 24);
  const weeksDiff = Math.floor(daysDiff / 7);

  // Format date as "dd.mm.yyyy" if it's older than a week
  if (weeksDiff >= 1) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // Format as relative time if it's within the last week
  if (daysDiff >= 1) {
    return `${daysDiff} ${daysDiff === 1 ? "day" : "days"} ago`;
  } else if (hoursDiff >= 1) {
    return `${hoursDiff} ${hoursDiff === 1 ? "hour" : "hours"} ago`;
  } else if (minutesDiff >= 1) {
    return `${minutesDiff} ${minutesDiff === 1 ? "minute" : "minutes"} ago`;
  } else {
    return `Less than a minute ago`;
  }
};
