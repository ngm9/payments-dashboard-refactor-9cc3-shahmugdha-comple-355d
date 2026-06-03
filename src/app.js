import { PaymentsDashboard } from './components/paymentsDashboard.js';
import { eventBus } from './events.js';

const selectRootElement = () => {
  const root = document.getElementById('dashboard-root');
  if (!root) {
    throw new Error('Missing #dashboard-root element');
  }
  return root;
};

const initializeDashboard = () => {
  const root = selectRootElement();
  const dashboard = new PaymentsDashboard(root, eventBus);
  dashboard.init();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
  });
} else {
  initializeDashboard();
}
