"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimelineCard = void 0;
var _elements = require("@environment-safe/elements");
class TimelineCard extends _elements.HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    const link = document.querySelector('#animate.css');
    const animateCSSLink = link ? link.getAttribute('href') : '/node_modules/animate.css/animate.css';
    this._link = document.createElement('link');
    this._link.setAttribute('rel', 'stylesheet');
    this._link.setAttribute('href', animateCSSLink);
    this.shadowRoot.appendChild(this._link);
    this._container = document.createElement('div');
    this._container.innerHTML = '<slot></slot>';
    this.shadowRoot.appendChild(this._container);
    this.transitionPos = 0;
  }
  async setContent(html) {
    let transitions = this.getAttribute('transitions');
    transitions = transitions ? transitions.split(',').map(s => s.trim()) : ['flipInY'];
    return await new Promise((resolve, reject) => {
      try {
        const transition = transitions[this.transitionPos % transitions.length];
        if (html !== null) {
          this._container.innerHTML = html;
        } else {
          this._container.innerHTML = '<slot></slot>';
        }
        const animationTarget = this;
        const endFn = () => {
          animationTarget.removeEventListener('animationend', endFn);
          animationTarget.classList.remove(`animate__${'animated'}`);
          animationTarget.classList.remove(`animate__${transition}`);
          animationTarget.classList.remove(`animate__${'faster'}`);
          resolve();
        };
        animationTarget.addEventListener('animationend', endFn, false);
        animationTarget.classList.add(`animate__${'animated'}`);
        animationTarget.classList.add(`animate__${transition}`);
        animationTarget.classList.add(`animate__${'faster'}`);
        this.transitionPos++;
      } catch (ex) {
        reject(ex);
      }
    });
  }
  render() {}
  display() {}
}
exports.TimelineCard = TimelineCard;
_elements.customElements.define('timeline-card', TimelineCard);