export const logInfo = (message, payload) => {
  console.info(`[PaymentsDashboard] ${message}`, payload || '');
};

export const logError = (message, error) => {
  console.error(`[PaymentsDashboard] ${message}`, error);
};
