function parseQueryParams(q) {
  let query = q || location.search;

  if (query) {
    if (query.indexOf('?') === 0) {
      query = query.substr(1);
    }

    return query.split('&').reduce((t, v) => {
      let arr = v.split('=');
      let key = decodeURIComponent(arr[0]);
      let value = decodeURIComponent(arr[1]);

      t[key] = value;
      return t;
    }, {});
  }

  return {};
}

function convertToQueryParams(obj) {
  return Object.keys(obj).reduce((t, v) => {
    var query = encodeURIComponent(v) + '=' + encodeURIComponent(obj[v]);

    if(t) {
      query = '&' + query;
    }

    return (t + query);
  }, '');
}

function pascalToKebab(str) {
  return str.replace(/([A-Z])/g, function($1){return '-'+$1.toLowerCase();}).replace(/^-/, '');
}

function camelToKebab(str) {
  return str.replace(/([A-Z])/g, function($1){return '-'+$1.toLowerCase();});
}

function parseParamsFromData(element, prefix='param') {

  const dataset = element.dataset || element.data() || {};
  return Object.keys(dataset).reduce((obj, data) => {
    if (data.indexOf(prefix) === 0) {
      let k = pascalToKebab(data.slice(prefix.length));
      obj[k] = dataset[data];
    }

    return obj;
  }, {});
}

function whichAnimationEvent(){
  var t,
      el = document.createElement('fakeelement');

  var animations = {
    'animation'      : 'animationend',
    'OAnimation'     : 'oAnimationEnd',
    'MozAnimation'   : 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd'
  }

  for (t in animations){
    if (el.style[t] !== undefined){
      return animations[t];
    }
  }
}

function fillTemplate(templateString='', params={}) {
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      let str = '{{\\s?' + key + '\\s?}}';
      let rx = new RegExp(str, 'g');
      templateString = templateString.replace(rx, params[key]);
    }
  }

  return templateString;
}

function parseLink(href='#') {
  let l = document.createElement('a');
  l.href = href;
  return l;
}

function whichTransitionEvent() {
  var el = document.createElement('fakeelement');
  var transitions = {
    'transition':'transitionend',
    'OTransition':'oTransitionEnd',
    'MozTransition':'transitionend',
    'WebkitTransition':'webkitTransitionEnd'
  }

  for(let t in transitions){
      if( el.style[t] !== undefined ){
          return transitions[t];
      }
  }
}

function trigger(eventTarget, eventName, eventData) {
  let event;

  if (!eventTarget || !eventName) return false;
  if (typeof eventData === 'undefined') eventData = {};

  if (window.CustomEvent) {
    event = new CustomEvent(eventName, {detail: eventData, bubbles: true, cancellable: true});
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, true, true, eventData);
  }

  return eventTarget.dispatchEvent(event);
}

function addEventListenerOnce(target, type, listener, addOptions, removeOptions) {
    target.addEventListener(type, function fn(event) {
        target.removeEventListener(type, fn, removeOptions);
        listener.apply(this, arguments, addOptions);
    });
}

export {
          pascalToKebab,
          parseParamsFromData,
          parseQueryParams,
          convertToQueryParams,
          whichAnimationEvent,
          whichTransitionEvent,
          trigger,
          addEventListenerOnce,
          fillTemplate,
          parseLink
       };
