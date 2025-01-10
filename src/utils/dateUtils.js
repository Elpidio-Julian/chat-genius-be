/**
 * Creates an RFC3339 formatted timestamp
 * @param {Date} [date] - Optional Date object (defaults to current time if not provided)
 * @returns {string} RFC3339 formatted timestamp (e.g. "2024-03-20T07:15:20.902Z")
 */
function createRFC3339Timestamp(date = new Date()) {
  return date.toISOString();
}

module.exports = {
  createRFC3339Timestamp
};