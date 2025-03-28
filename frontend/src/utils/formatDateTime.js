export function formatDate(isoString) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-GB').format(date);
}

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', ' ');
  };
  