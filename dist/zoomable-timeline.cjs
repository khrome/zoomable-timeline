"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ZoomableTimeline = void 0;
var _elements = require("@environment-safe/elements");
/* global links:false*/

class ZoomableTimeline extends _elements.HTMLElement {
  constructor() {
    super();
    this._data = [];
    this.attachShadow({
      mode: 'open'
    });
    const link = document.getElementById('timeline.css');
    const animateCSSLink = link ? link.getAttribute('href') : '/timeline.css';
    this._link = document.createElement('link');
    this._link.setAttribute('rel', 'stylesheet');
    this._link.setAttribute('href', animateCSSLink);
    this.shadowRoot.appendChild(this._link);
    this._container = document.createElement('div');
    this.shadowRoot.appendChild(this._container);
    this._timeline = new links.Timeline(this._container);
    links.events.addListener(this._timeline, 'rangechanged', function (properties) {
      //document.getElementById('info').innerHTML += 'rangechanged ' +
      //        properties.start + ' - ' + properties.end + '<br>';
    });
    this.width = this.getAttribute('width') || this._container.offsetWidth + 'px';
    this.height = this.getAttribute('height') || this._container.offsetHeight + 'px';
    window.addEventListener('resize', () => {
      if (this.width && this.height) {
        console.log('ser', this.width, this.height);
        //this gives percentages a chance to adjust
        //this.setDimensions(this.width, this.height);
        this._timeline.setSize();
      }
    });
  }
  connectedCallback() {
    this.render();
    this.display();
  }
  static get observedAttributes() {
    return ['data', 'src'];
  }

  // We reflect attribute changes into property changes
  attributeChangedCallback(attr, oldVal, newVal) {
    if (oldVal !== newVal) {
      this[attr] = newVal;
    }
  }

  // Getter and setters for data
  get data() {
    return this._data;
  }
  set data(value) {
    const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
    let start = null;
    if (parsedValue != this._data) {
      this._data.forEach(item => {
        const date = new Date(item.start);
        if (!start || start > date) start = date;
      });
      this._timeline.start = start;
      this._data = parsedValue;
      this.setAttribute('data', JSON.stringify(parsedValue));
      this.dispatchEvent(new CustomEvent('changed', {
        detail: parsedValue
      }));
      this.render();
      this.display();
    }
  }

  // Getter and setters for src
  get src() {
    return this._src;
  }
  set src(uri) {
    this._src = uri;
    (async () => {
      const response = await fetch(this._src);
      const list = await response.json();
      this.data = list;
    })();
  }
  render() {
    //normalize
    let min;
    let max;
    this._data.forEach((item, index) => {
      Object.keys(item).forEach(key => {
        if (item[key] && item[key].match) {
          var matches = item[key].match(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);
          if (matches) this._data[index][key] = new Date(matches[3], matches[1], matches[2], matches[4], matches[5], matches[6]);
          if (item[key] == '{{now}}') this._data[index][key] = new Date();
          if (this._data[index][key] < min || !min) min = this._data[index][key];
          if (this._data[index][key] > max || !max) max = this._data[index][key];
        }
      });
    });
    this._timeline.draw(this._data, {
      'width': '100%',
      'height': '300px',
      'editable': false,
      'style': 'box',
      min: min,
      max: max,
      onSelect: text => {
        const item = (this._data || []).find(item => {
          return item.content === text;
        });
        var event = new CustomEvent('timeline-select', {
          detail: item
        });
        this.dispatchEvent(event);
      }
    });
    //
  }

  display() {
    //this.output.innerHTML = `${this.counter}`;
  }
}
exports.ZoomableTimeline = ZoomableTimeline;
_elements.customElements.define('zoomable-timeline', ZoomableTimeline);