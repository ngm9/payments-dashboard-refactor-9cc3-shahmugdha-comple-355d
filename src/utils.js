const getSessionTokenKey = () => 'UTKRUSHT_PAYMENTS_JWT';

export const getSessionToken = () => {
  try {
    return sessionStorage.getItem(getSessionTokenKey());
  } catch (e) {
    return null;
  }
};

export const setSessionToken = (token) => {
  try {
    if (token) {
      sessionStorage.setItem(getSessionTokenKey(), token);
    } else {
      sessionStorage.removeItem(getSessionTokenKey());
    }
  } catch (e) {
  }
};

export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number') {
    return '-';
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  } catch (e) {
    return `${amount.toFixed(2)} ${currency}`;
  }
};

export const formatDateISO = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  return d.toISOString().slice(0, 10);
};

export const createElement = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  if (typeof text === 'string') {
    el.textContent = text;
  }
  return el;
};

export const replaceChildren = (parent, newChildren) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  if (Array.isArray(newChildren)) {
    newChildren.forEach((child) => parent.appendChild(child));
  } else if (newChildren instanceof Node) {
    parent.appendChild(newChildren);
  }
};
