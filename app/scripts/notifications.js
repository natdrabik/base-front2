// Function from David Walsh: http://davidwalsh.name/css-animation-callback

import { whichTransitionEvent } from './helpers';

function onTransitionEnd(event) {
  event.target.parentNode.removeChild(event.target);
}

function fadeNotification(notification, redirect, callback) {

  if (callback && typeof callback === 'function') {
    callback.call(notification);
  }

  if (redirect) {
    if (redirect === 'refresh' || redirect === 'reload' || redirect === 'atualizar') return function() { window.reload() };

    let a = document.createElement('a');
    a.href = redirect;
    return function() { window.location.href = a.href };
  }

  const transitionEvent = whichTransitionEvent();

  return function() {
    notification.addEventListener(transitionEvent, onTransitionEnd);
    notification.style.opacity = 0;
  }
}

// const icon_success = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><style>.st0{fill:#404040}</style><path class="st0" d="M449.7 239.8c-.5-7.5-7.1-13.2-14.6-12.7s-13.2 7.1-12.7 14.6c.3 4.7.5 9.4.5 14.2 0 109.1-88.7 197.8-197.8 197.8S27.4 365.1 27.4 256 116.1 58.2 225.1 58.2c43.2 0 84.2 13.7 118.6 39.5 6 4.5 14.6 3.3 19.2-2.7 4.5-6 3.3-14.6-2.7-19.2-39.2-29.4-85.9-45-135.1-45C101 30.9 0 131.9 0 256s101 225.1 225.1 225.1 225.1-101 225.1-225.1c.1-5.4-.1-10.9-.5-16.2z"/><path class="st0" d="M496.4 61.8a53.48 53.48 0 0 0-75.5 0L223.8 258.9 153.9 189a53.48 53.48 0 0 0-75.5 0 53.48 53.48 0 0 0 0 75.5l120.3 120.3c6.9 6.9 16 10.3 25 10.3 9.1 0 18.1-3.4 25-10.3l247.6-247.6a53.26 53.26 0 0 0 .1-75.4zM477 117.9L229.5 365.5a8.03 8.03 0 0 1-11.3 0L97.8 245.1a26.13 26.13 0 0 1 0-36.8c5.1-5.1 11.7-7.6 18.4-7.6s13.3 2.5 18.4 7.6l71.9 71.9c4.6 4.6 10.8 7.2 17.3 7.2 6.6 0 12.7-2.6 17.3-7.2L440.3 81.1a26.13 26.13 0 0 1 36.8 0 26.04 26.04 0 0 1-.1 36.8z"/><path d="M477 117.9L229.5 365.5a8.03 8.03 0 0 1-11.3 0L97.8 245.1a26.13 26.13 0 0 1 0-36.8c5.1-5.1 11.7-7.6 18.4-7.6s13.3 2.5 18.4 7.6l71.9 71.9c4.6 4.6 10.8 7.2 17.3 7.2 6.6 0 12.7-2.6 17.3-7.2L440.3 81.1a26.13 26.13 0 0 1 36.8 0 26.04 26.04 0 0 1-.1 36.8z" fill="#3ae3b5"/></svg>';
// const icon_error = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><style>.st0{fill:#404040}</style><path class="st0" d="M437.1 74.9c-99.8-99.8-262.3-99.8-362.1 0C26.6 123.3 0 187.6 0 256s26.6 132.7 75 181c49.9 49.9 115.5 74.9 181.1 74.9s131.1-25 181.1-74.9c99.8-99.8 99.8-262.2-.1-362.1zm-28 334.1c-84.4 84.4-221.7 84.4-306 0-40.9-40.9-63.4-95.2-63.4-153S62.2 143.9 103 103c84.4-84.4 221.7-84.4 306 0 84.4 84.4 84.4 221.7.1 306z"/><path d="M346.1 316L286 256l60.1-60c8.3-8.3 8.3-21.7 0-30s-21.7-8.3-30 0L256 226l-60.1-60c-8.3-8.3-21.7-8.3-30 0s-8.3 21.7 0 30l60.1 60-60.1 60c-8.3 8.3-8.3 21.7 0 30 4.1 4.2 9.6 6.2 15 6.2s10.9-2.1 15-6.2l60.1-60 60.1 60c4.1 4.1 9.6 6.2 15 6.2s10.9-2.1 15-6.2c8.3-8.3 8.3-21.8 0-30z" fill="#f28181"/><path class="st0" d="M331.1 159.8a21.18 21.18 0 0 1 15 36.2L286 256l60.1 60a21.18 21.18 0 0 1-15 36.2c-5.4 0-10.9-2.1-15-6.2L256 286l-60.1 60c-4.1 4.1-9.6 6.2-15 6.2s-10.9-2.1-15-6.2c-8.3-8.3-8.3-21.7 0-30l60.1-60-60.1-60c-8.3-8.3-8.3-21.7 0-30 4.1-4.2 9.6-6.2 15-6.2s10.9 2.1 15 6.2l60.1 60 60.1-60c4.1-4.1 9.6-6.2 15-6.2m0-23c-11.8 0-22.9 4.6-31.3 12.9L256 193.5l-43.8-43.8a44.27 44.27 0 0 0-31.3-12.9 44.21 44.21 0 0 0-31.2 75.5l43.7 43.7-43.8 43.7a44.3 44.3 0 0 0-.1 62.5c8.3 8.4 19.4 13 31.3 13 11.8 0 22.9-4.6 31.2-12.9l43.9-43.8 43.8 43.8c8.3 8.3 19.4 12.9 31.2 12.9s22.9-4.6 31.3-12.9c17.2-17.3 17.2-45.3 0-62.5L318.6 256l43.8-43.7c17.2-17.2 17.2-45.2.1-62.5-8.5-8.4-19.6-13-31.4-13z"/></svg>';

export function Notification(data) {
  let { type, message, calltoaction, container, delay, redirect, callback} = data;
  const duration = 8000;

  if (!container) container = document.body;
  if (!delay)  delay = duration;

  let overlay = document.createElement('div');
  overlay.classList.add('notification__overlay');

  let notification = document.createElement('div');
  notification.classList.add('notification');
  if (type) notification.classList.add(`notification--${type}`);

  let popup = document.createElement('div');
  popup.classList.add('notification__popup');
  popup.setAttribute('role', 'alert');

  // switch (type) {
  //   case 'success':
  //     popup.innerHTML = `<figure class="notification__figure">${icon_success}</figure>`;
  //     break;
  //   case 'error':
  //     popup.innerHTML = `<figure class="notification__figure">${icon_error}</figure>`;
  //     break;
  // }

  popup.innerHTML = popup.innerHTML + `<div class="notification__message">${message}</div>`;

  if (calltoaction) popup.innerHTML = popup.innerHTML + `<a href="${calltoaction.link}" class="notification__button">${calltoaction.title}</a>`

  notification.appendChild(popup);
  notification.appendChild(overlay);

  container.appendChild(notification);
  notification.classList.add('is--alerting');

  let timer = window.setTimeout(fadeNotification(notification, redirect, callback), delay);

  notification.addEventListener('click', function() {
    fadeNotification(notification, redirect, callback).call();
    window.clearTimeout(timer);
  });

  return notification;
}
