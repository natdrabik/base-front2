import Swiper from 'swiper';
import Map from './Map';
import Dropzone from './Dropzone';
import Choices from 'choices.js';
import Forms from './forms';
import throttle from 'lodash.throttle';
import Velocity from 'velocity-animate';

const HomeCarouselContainer = document.querySelector('[data-carousel="home"]');

if (HomeCarouselContainer) {

  const HomeCarousel = new Swiper(HomeCarouselContainer, {
    speed: 400,
    loop: true,
    watchOverflow: true,
    init: false,
    autoplay: {
      delay: 10000
    },
    pagination: {
      el: HomeCarouselContainer.querySelector('.swiper-pagination'),
      type: 'bullets',
      renderBullet: (index, className) => `<button class="${className}" type="button" aria-title="${index}">
      </button>`,
      clickable: true
    },
    on: {
      slideChangeTransitionStart() {
        let activeSlide = this.slides[this.activeIndex];

        try {
          var color = activeSlide.querySelector('[data-header-color]').dataset.headerColor;
          this.el.style.color = color;
          if (window.pageYOffset < this.el.offsetHeight) document.getElementById('brand').style.color = color;

        } catch(e) {
          this.el.style.color = '#000';
          if (window.pageYOffset < this.el.offsetHeight) document.getElementById('brand').style.color = '#000';
        }
      }
    }
  });

  if (HomeCarouselContainer.querySelectorAll('.swiper-slide').length > 1) {
    HomeCarousel.init();
  } else {
    document.getElementById('brand').style.color = HomeCarouselContainer.querySelector('[data-header-color]').dataset.headerColor;
  }
}

const ClientsCarouselContainer = document.querySelector('[data-carousel="clients"]');

if (ClientsCarouselContainer) {
  const ClientsCarousel = new Swiper(ClientsCarouselContainer, {
    speed: 400,
    loop: false,
    slidesPerView: 4,
    slidesPerGroup: 4,
    watchOverflow: true,
    navigation: {
      nextEl: ClientsCarouselContainer.querySelector('.swiper-button-next'),
      prevEl: ClientsCarouselContainer.querySelector('.swiper-button-prev'),
    },
    breakpoints: {
      414: {
        slidesPerView: 1,
        slidesPerGroup: 1,
      },

      767: {
        slidesPerView: 2,
        slidesPerGroup: 2,
      },

      1027: {
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
    },
  });
}

const RelatedCarouselContainer = document.querySelector('[data-carousel="related"]');

if (RelatedCarouselContainer) {
  const RelatedCarousel = new Swiper(RelatedCarouselContainer, {
    speed: 400,
    loop: false,
    slidesPerView: 3,
    spaceBetween: 12,
    watchOverflow: true,
    navigation: {
      nextEl: RelatedCarouselContainer.querySelector('.swiper-button-next'),
      prevEl: RelatedCarouselContainer.querySelector('.swiper-button-prev'),
    },
    breakpoints: {
      414: {
        slidesPerView: 1,
        slidesPerGroup: 1,
      },

      767: {
        slidesPerView: 2,
        slidesPerGroup: 2,
      },
    },
  });
}

// Dropdown

[...document.querySelectorAll('[data-toggle="dropdown"]')].forEach((el) => {
  el.addEventListener('click', event => {
    event.preventDefault();
    el.parentNode.classList.toggle('is--open');
  }, true)
});

document.querySelector('[data-toggle="search"]').addEventListener('click', event => {
  event.preventDefault();
  document.body.classList.toggle('has--search');
}, true);

document.querySelector('[data-toggle="nav"]').addEventListener('click', event => {
  event.preventDefault();
  document.body.classList.toggle('has--nav');
}, true);

document.body.addEventListener('click', event => {
  const target = event.target;
  const dropdowns = [...document.querySelectorAll('[data-toggle="dropdown"]')];
  const search = document.querySelector('[data-search]');

  let wasTheClickWithinADropdown = dropdowns.find((btn) => {
    const parent = btn.parentNode;
    return parent === target || parent.contains(target);
  });

  if (!wasTheClickWithinADropdown) {
    dropdowns.forEach((el) => {
      el.parentNode.classList.remove('is--open');
    });
  }

  if (search !== target && !search.contains(target)) {
    document.body.classList.remove('has--search');
  }
}, true);

// Features Carousel

[...document.querySelectorAll('[data-features="container"]')].forEach((container) => {
  const grid = container.querySelector('[data-features="grid"]');
  const prev = container.querySelector('[data-features="prev"]');
  const next = container.querySelector('[data-features="next"]');
  const features = [...grid.children];

  prev.addEventListener('click', event => {
    event.preventDefault();
    const gridWidth = grid.offsetWidth;
    const gridScrollWidth = grid.scrollWidth;
    const gridScrollLeft = grid.scrollLeft;

    const featuresInView = features.filter(feat => {
      return feat.offsetLeft >= gridScrollLeft
        && feat.offsetLeft <= gridScrollLeft + gridWidth - (feat.offsetWidth / 2);
    });

    const featuresInViewLength = featuresInView.length;
    const firstVisibleIndex = features.indexOf(featuresInView[0]);

    const prevFeatures =
      firstVisibleIndex - featuresInViewLength < 0
      ? features.slice(0, firstVisibleIndex)
      : features.slice(firstVisibleIndex - featuresInViewLength, firstVisibleIndex);

    if (prevFeatures.length) {
      grid.scrollBy({
        top: 0, // could be negative value
        left: -gridWidth,
        behavior: 'smooth'
      });
    }
  }, true);

  next.addEventListener('click', event => {
    event.preventDefault();
    const gridWidth = grid.offsetWidth;
    const gridScrollWidth = grid.scrollWidth;
    const gridScrollLeft = grid.scrollLeft;

    const featuresInView = features.filter(feat => {
      return feat.offsetLeft >= gridScrollLeft
        && feat.offsetLeft <= gridScrollLeft + gridWidth - (feat.offsetWidth / 2);
    });

    const featuresInViewLength = featuresInView.length;
    const lastVisibleIndex = features.indexOf(featuresInView[featuresInViewLength - 1]);

    const nextFeatures = features.slice(lastVisibleIndex + 1, lastVisibleIndex + 1 + featuresInViewLength);

    if (nextFeatures.length) {
      grid.scrollBy({
        top: 0, // could be negative value
        left: gridWidth,
        behavior: 'smooth'
      });
    }
  }, true);
});

if (document.querySelector('[data-map="map"]')) new Map();

if (document.getElementsByTagName('select').length) {
  new Choices('select', {
    shouldSort: false,
  });
}

// Details / Summary

if (document.getElementsByTagName('details').length) {
  [...document.getElementsByTagName('details')].forEach(details => {
    details.addEventListener('toggle', () => {
      if (details.open) {
        [...details.parentNode.children].forEach(sibling => {
          if (sibling.nodeType == 1 && sibling !== details && sibling.open) {
            sibling.open = false;
          }
        })
      }
    });
  })
}

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

if (document.querySelector('[data-dropzone]')) {
  [...document.querySelectorAll('[data-dropzone]')].forEach(zone => {
    new Dropzone({ zone });
  });
}

Forms.init({
  'clean-after-success': true,
  validate: true,
  beforeSubmit(data) {
    let dz = this._form.querySelector('[data-dropzone]');
    if (dz && dz.dropzone) {
      if (dz.dropzone.droppedFiles && dz.dropzone.droppedFiles.length) {
        dz.dropzone.droppedFiles.forEach(file => {
          data.append('file', file);
        });
      } else {
        if (!data.has('file')) throw new Error('Não tem arquivo.');
      }
    }

    return data;
  }
});

window.onscroll = throttle(() => {

  const pageOffset = window.pageYOffset;
  const windowHeight = window.innerHeight;

  if (pageOffset > (windowHeight / 10)) {
    document.body.classList.add('has--scrolled');
  } else {
    document.body.classList.remove('has--scrolled');
  }

  if (pageOffset >= windowHeight) {
    document.body.classList.add('is--below-fold');
  } else {
    document.body.classList.remove('is--below-fold');
  }

  if (HomeCarouselContainer) {
    [...HomeCarouselContainer.querySelectorAll('.home-banners__figure')].forEach((figure) => {
      figure.style.transform = `translateY(${Math.floor(Math.max(0, Math.min(pageOffset / 10, 50)))}px)`;
    })
  }

}, 10);

// Efeitinhos na rolagem



if ('IntersectionObserver' in window) {
  const observed = document.querySelectorAll('[data-observe]');
  const observedContainer = document.querySelectorAll('[data-observe-container]');

  function makeCounter(el) {
    if (!isNaN(+el.textContent)) {
      el.dataset.counter = el.textContent;
      el.style.display = 'inline-block';
      el.style.width = el.offsetWidth + 'px';
      el.style.textAlign = 'center';
      el.textContent = 0;
    }

    return el;
  }

  function countCounter(el) {
    var final = +el.dataset.counter;

    if (typeof final !== 'undefined' && !isNaN(final)) {
      var current = +el.textContent;
      Velocity(el, {}, {
        easing: 'ease-in',
        duration: 2000,
        progress(elements, percent) {
          var newCurrent = Math.ceil(Math.min(final, final * percent));
          if (current != newCurrent) {
            current = newCurrent;
            elements[0].textContent = current;
          }
        }
      });
    }
  }

  if (observed.length || observedContainer.length) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {

          if (entry.target.matches('[data-counter]')) countCounter(entry.target);

          if (entry.target.querySelectorAll('[data-counter]').length) [...entry.target.querySelectorAll('[data-counter]')].forEach(countCounter);

          entry.target.style.transitionDelay = (index * 0.1) + 's';
          entry.target.classList.remove('is--below-scroll');

          observer.unobserve(entry.target);
        }
      })
    }, {
      rootMargin: '0px',
      threshold: 0.5
    });

    [...observed].forEach(el => {
      if (!el.isIntersecting) {
        el.classList.add('is--below-scroll');

        if (el.matches('[data-counter]')) {
          makeCounter(el);
        }

        if (el.querySelectorAll('[data-counter]').length) {
          [...el.querySelectorAll('[data-counter]')].forEach(makeCounter)
        }

        observer.observe(el);
      }
    });

    [...observedContainer].forEach(container => {
      [...container.children].forEach(el => {
        if (!el.isIntersecting) {
          el.classList.add('is--below-scroll');
          el.classList.add('is--observed');

          if (el.matches('[data-counter]')) {
            makeCounter(el);
          }

          if (el.querySelectorAll('[data-counter]').length) {
            [...el.querySelectorAll('[data-counter]')].forEach(makeCounter)
          }

          observer.observe(el);
        }
      })
    });
  }
}


