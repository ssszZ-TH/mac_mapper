export const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  try {
    // Assume the input date string is in UTC and append 'Z' to ensure UTC parsing
    const date = new Date(`${dateString}Z`);
    return date.toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      calendar: 'gregory', // Use Gregorian calendar (ค.ศ.)
    });
  } catch {
    return 'N/A';
  }
};

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  try {
    // Assume the input date string is in UTC and append 'Z' to ensure UTC parsing
    const date = new Date(`${dateString}Z`);
    return date.toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      calendar: 'gregory', // Use Gregorian calendar (ค.ศ.)
    });
  } catch {
    return 'N/A';
  }
};