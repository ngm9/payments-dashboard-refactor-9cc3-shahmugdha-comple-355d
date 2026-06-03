import { paymentsApi } from '../api.js';
import { createElement, replaceChildren, formatCurrency, formatDateISO } from '../utils.js';

export class PaymentsDashboard {
  constructor(rootElement, eventBus) {
    this.root = rootElement;
    this.eventBus = eventBus;
    this.state = {
      startDate: null,
      endDate: null,
      loading: false,
      errorMessage: '',
      bundle: null
    };

    this.elements = {
      errorBanner: null,
      filters: null,
      summaryGrid: null,
      loadingIndicator: null
    };
  }

  init() {
    this.setupInitialDates();
    this.renderShell();
    this.attachEvents();
    this.loadInitialData();
  }

  setupInitialDates() {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    this.state.startDate = formatDateISO(start);
    this.state.endDate = formatDateISO(today);
  }

  renderShell() {
    const container = this.root;

    const errorBanner = createElement('div', 'banner-error');
    errorBanner.style.display = 'none';

    const filters = createElement('div', 'filters');
    const startInput = createElement('input');
    startInput.type = 'date';
    startInput.value = this.state.startDate;

    const endInput = createElement('input');
    endInput.type = 'date';
    endInput.value = this.state.endDate;

    const applyButton = createElement('button', '', 'Apply');

    filters.appendChild(startInput);
    filters.appendChild(endInput);
    filters.appendChild(applyButton);

    const loadingIndicator = createElement('div', 'loading-indicator', 'Loading payments...');
    loadingIndicator.style.display = 'none';

    const summaryGrid = createElement('div', 'summary-grid');

    replaceChildren(container, [errorBanner, filters, loadingIndicator, summaryGrid]);

    this.elements.errorBanner = errorBanner;
    this.elements.filters = {
      container: filters,
      startInput,
      endInput,
      applyButton
    };
    this.elements.loadingIndicator = loadingIndicator;
    this.elements.summaryGrid = summaryGrid;
  }

  attachEvents() {
    const { startInput, endInput, applyButton } = this.elements.filters;

    applyButton.addEventListener('click', () => {
      const nextStart = startInput.value;
      const nextEnd = endInput.value;
      this.state.startDate = nextStart;
      this.state.endDate = nextEnd;
      this.fetchAndRenderBundle();
    });
  }

  loadInitialData() {
    this.fetchAndRenderBundle();
  }

  setLoading(isLoading) {
    this.state.loading = isLoading;
    if (this.elements.loadingIndicator) {
      this.elements.loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
  }

  setError(message) {
    this.state.errorMessage = message;
    if (!this.elements.errorBanner) {
      return;
    }
    if (message) {
      this.elements.errorBanner.textContent = message;
      this.elements.errorBanner.style.display = 'block';
    } else {
      this.elements.errorBanner.textContent = '';
      this.elements.errorBanner.style.display = 'none';
    }
  }

  async fetchAndRenderBundle() {
    this.setError('');
    this.setLoading(true);

    try {
      const bundle = await paymentsApi.getPaymentBundle(this.state.startDate, this.state.endDate);
      this.state.bundle = bundle;
      this.renderSummary(bundle);
    } catch (error) {
      this.setError('Failed to load payments. Please try again later.');
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  renderSummary(bundle) {
    if (!this.elements.summaryGrid) {
      return;
    }
    const fragment = document.createDocumentFragment();

    const dailyCard = createElement('div', 'summary-card');
    const dailyHeader = createElement('h3', '', 'Daily Total');
    const dailyValue = createElement('div', 'value', formatCurrency(Array.isArray(bundle.daily) ? bundle.daily.reduce((sum, row) => sum + (row.amount || 0), 0) : 0));
    dailyCard.appendChild(dailyHeader);
    dailyCard.appendChild(dailyValue);

    const monthlyCard = createElement('div', 'summary-card');
    const monthlyHeader = createElement('h3', '', 'Monthly Total');
    const monthlyValue = createElement('div', 'value', formatCurrency(Array.isArray(bundle.monthly) ? bundle.monthly.reduce((sum, row) => sum + (row.amount || 0), 0) : 0));
    monthlyCard.appendChild(monthlyHeader);
    monthlyCard.appendChild(monthlyValue);

    fragment.appendChild(dailyCard);
    fragment.appendChild(monthlyCard);

    replaceChildren(this.elements.summaryGrid, fragment);
  }
}
