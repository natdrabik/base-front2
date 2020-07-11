import Swiper from 'swiper';
import Choices from 'choices.js';
// import Forms from './forms';
import throttle from 'lodash.throttle';
import Velocity from 'velocity-animate';

// Accessibility

sessionStorage.getItem('contrast') && +sessionStorage.getItem('contrast') && document.body.classList.add('has--high-contrast');

if(document.querySelector('[data-contrast]')) {
document.querySelector('[data-contrast]').addEventListener('click', () => {
document.body.classList.toggle('has--high-contrast');

sessionStorage.setItem('contrast', document.body.classList.contains('has--high-contrast') ? 1 : 0);
}, true);
}

if (sessionStorage.getItem('fontsize')) document.body.style.fontSize = sessionStorage.getItem('fontsize') + 'px';

if (document.querySelector('[data-fontsize-decrease]')) {
document.querySelector('[data-fontsize-decrease]').addEventListener('click', (event) => {
event.preventDefault();
let fontsize = parseInt(window.getComputedStyle(document.body, null).getPropertyValue('font-size'));

document.body.style.fontSize = --fontsize + 'px';

sessionStorage.setItem('fontsize', fontsize);
}, true);
}

if (document.querySelector('[data-fontsize-increase]')) {
document.querySelector('[data-fontsize-increase]').addEventListener('click', (event) => {
event.preventDefault();
let fontsize = parseInt(window.getComputedStyle(document.body, null).getPropertyValue('font-size'));

document.body.style.fontSize = ++fontsize + 'px';

sessionStorage.setItem('fontsize', fontsize);
}, true);
}