// import { parseLink } from './helpers';

export default class Map {
  constructor(options = {}) {
    const defaults = {
      stateSelector: '.map__state',
      tooltipActiveClass: 'is--active',
      stateActiveClass: 'is--active'
    }

    this.settings = Object.assign({}, defaults, options.settings || {})

    this.currentState = null;
    this.currentTooltip = null;
    this.currentUrl = null;

    this.tooltipPosition = {
      x: 0,
      y: 0
    }

    this.map = options.map || document.querySelector('[data-map="map"]');

    if (!this.map) throw new Error('container is required.');

    this.wrapper = options.wrapper || this.map.querySelector('[data-map="wrapper"]');
    this.svg = options.svg || this.map.querySelector('[data-map="svg"]');
    this.tooltip = options.tooltip || this.map.querySelector('[data-map="tooltip"]');
    this.states = Array.from(this.map.querySelectorAll(this.settings.stateSelector));

    if (this.tooltip) {
      this.tooltip.addEventListener('mouseleave', this.onTooltipLeave.bind(this), false);
      this.tooltipTitle = options.tooltipTitle || this.map.querySelector('[data-map="tooltipTitle"]');
      this.tooltipButton = options.tooltipButton || this.map.querySelector('[data-map="tooltipButton"]');
      this.tooltipOffsetParent = this.tooltip.offsetParent
    }

    this.states.forEach(state => {
      state.addEventListener('mouseenter', this.onFocus.bind(this));
      state.addEventListener('mouseleave', this.onMouseLeave.bind(this));
      state.addEventListener('focus', this.onFocus.bind(this));
      state.addEventListener('blur', this.onBlur.bind(this));
      // state.addEventListener('click', this.onClick.bind(this));
    });

    this.wrapper.addEventListener('mouseleave', this.onWrapperLeave.bind(this));

    this.returnTooltipToStartPosition();
  }

  returnTooltipToStartPosition() {
    // const wrapperbox = this.wrapper.getBoundingClientRect();

    // this.tooltipPosition = {
    //   x: window.scrollX + wrapperbox.left + (wrapperbox.width * 0.25),
    //   y: window.scrollY + wrapperbox.top + (wrapperbox.width * 0.75),
    // };

    this.tooltip.classList.remove(this.settings.tooltipActiveClass);
  }

  getURL() {
    return location.origin ? location.origin + location.pathname : location.protocol + '//' + location.host + location.pathname;
  }

  positionTooltip(elementToCenter) {
    if (!this.tooltipOffsetParent && this.tooltip.offsetParent) {
      this.tooltipOffsetParent = this.tooltip.offsetParent;
    } else if (!this.tooltip.offsetParent) {
      return false;
    }

    const bbox = elementToCenter.getBoundingClientRect();
    const offsetbox = this.tooltipOffsetParent.getBoundingClientRect();

    this.tooltip.classList.add(this.settings.tooltipActiveClass);

    const center = {
      x: bbox.left - offsetbox.left + (bbox.width / 2),
      y: bbox.top - offsetbox.top + (bbox.height / 2),
    };

    this.tooltipPosition = center;

    this.tooltip.style.top = `${center.y}px`;
    this.tooltip.style.left = `${center.x}px`;

    this.tooltipTitle.textContent = this.currentTooltip;
    this.tooltipButton.href = this.currentUrl;
  }

  // onClick(event) {
  //   // event.preventDefault();
  //   // const parent = event.target.parentNode;

  //   window.location = parseLink(this.currentUrl).href;
  // }

  onFocus(event) {
    let el = event.target;
    let parent = el.parentNode;

    if (el.nodeName === 'use' || !parent.parentNode) {
      el = document.getElementById(el.id);
      parent = el.parentNode;
    }

    el.classList.add(this.settings.stateActiveClass);
    this.currentState = el.id;
    this.currentTooltip = parent.dataset && parent.dataset.state;
    this.currentUrl = parent.dataset && parent.dataset.stateUrl

    this.states.forEach((state) => {
      if (state !== el) state.classList.remove(this.settings.stateActiveClass);
    });

    if (this.tooltip) this.positionTooltip(parent);
  }

  onBlur(event) {
    const el = event.target;
    el.classList.remove(this.settings.stateActiveClass);
    this.currentState = null;
    this.currentTooltip = null;
    this.currentUrl = null;

    window.setTimeout(() => {
      if (!this.map.contains(document.activeElement)) {
        this.returnTooltipToStartPosition();
      }
    }, 1);
  }

  onMouseLeave(event) {

    const hoverEl = document.elementFromPoint(event.clientX, event.clientY);

    if (hoverEl !== this.tooltip && !this.tooltip.contains(hoverEl)) {
      const el = event.target;
      el.classList.remove(this.settings.stateActiveClass);
      el.blur();

      this.currentState = null;
      this.currentTooltip = null;
      this.currentUrl = null;

      window.setTimeout(() => {
        if (!this.map.contains(hoverEl) || this.map === hoverEl) {
          this.returnTooltipToStartPosition();
        }
      }, 1);
    }
  }

  onTooltipLeave(event) {
    const hoverEl = document.elementFromPoint(event.clientX, event.clientY);

    window.setTimeout(() => {
      if (!this.svg.contains(hoverEl)) {
        this.currentState = null;
        this.currentTooltip = null;
        this.currentUrl = null;
        this.returnTooltipToStartPosition();
      }
    }, 1);
  }

  onWrapperLeave(event) {
    const hoverEl = document.elementFromPoint(event.clientX, event.clientY);

    window.setTimeout(() => {
      if (!this.map.contains(hoverEl)) {
        this.currentState = null;
        this.currentTooltip = null;
        this.currentUrl = null;
        this.returnTooltipToStartPosition();
      }
    }, 1);
  }
}
