import { createElement } from '../utils.js';

export class SimpleBadge {
  constructor(label) {
    this.label = label;
  }

  render() {
    const el = createElement('span', 'simple-badge', this.label);
    return el;
  }
}
