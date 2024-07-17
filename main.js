
// аниамция слайдеров
class SliderCounterNumber {
  constructor(element = new HTMLElement()) {
    this.element = element;
  }

  update(current, max) {
    this.element.textContent = `${current}/${max}`;
  }
}

class SliderCounterStages {
  constructor(element = new HTMLElement()) {
    this.element = element;
    this.arrayCircles = [];
    let circle = document.createElement('div')
    circle.classList.add('stages__circle');
    this.arrayCircles.push(circle.cloneNode());
    this.arrayCircles.push(circle.cloneNode());
    this.arrayCircles.push(circle.cloneNode());
    this.arrayCircles.push(circle.cloneNode());
    this.arrayCircles.push(circle.cloneNode());
    for (let circle of this.arrayCircles) {
      this.element.append(circle)
    }
  }

  update(_, max, index) {
    for (let i = 0; i < max; i++) {
      this.arrayCircles[i].style.backgroundColor = '#D9D9D9';
    }
    this.arrayCircles[index].style.backgroundColor = '#000';
  }
}

class Slider {
  constructor(element = HTMLElement, counter, btnNext, btnPrev) {
    this.btnNext = btnNext;
    this.btnPrev = btnPrev;
    this.element = element;
    this.itemWidth = element.children[0].offsetWidth;
    this.index = 0;
    this.counter = counter;
    this.wrapperWidth = element.parentElement.offsetWidth;
    this.counter.update(this.activeSliders, this.maxSlider, this.index);

    this.updateButtons();

    // клик на кнопки
    this.btnNext.addEventListener('click', this.right);
    this.btnPrev.addEventListener('click', this.left);

    this.isAnimation = false;
  }


  updateButtons() {
    if (this.index <= 0) {
      this.btnPrev.disabled = true;
      this.btnPrev.classList.add('disabled')
    } else {
      this.btnPrev.disabled = false;
      this.btnPrev.classList.remove('disabled')
    }

    if (this.activeSliders >= this.maxSlider) {
      this.btnNext.disabled = true;
      this.btnNext.classList.add('disabled');
    } else {
      this.btnNext.disabled = false;
      this.btnNext.classList.remove('disabled');
    }
  }

  get activeSliders() {
    return Math.round(this.wrapperWidth / this.itemWidth) + this.index
  }

  get maxSlider() {
    return this.element.children.length
  }

  scroll(direction) {
    if (this.isAnimation) return
    this.isAnimation = true;
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      let progress = timestamp - start;
      let offset = this.index * this.itemWidth;

      if (direction === 'right' && this.activeSliders < this.maxSlider) {
        this.element.style.transform = `translateX(-${(offset - 14) + progress}px)`;
        if (progress < this.itemWidth) window.requestAnimationFrame((t) => step(t));
        else {
          this.index++;
          this.updateButtons();
          this.isAnimation = false;
        }
      } else if (direction === 'left' && this.index > 0) {
        this.element.style.transform = `translateX(-${(offset + 14) - progress}px)`;
        if (progress < this.itemWidth) window.requestAnimationFrame((t) => step(t));
        else {
          this.index--;
          this.updateButtons();
          this.isAnimation = false;
        }
      }
      this.counter.update(this.activeSliders, this.maxSlider, this.index);
    }

    window.requestAnimationFrame(step);
  }

  left = () => {
    clearInterval(this.avtoScroll);
    this.scroll('left');
  }

  right = () => {
    clearInterval(this.avtoScroll);
    this.scroll('right');
  }

  interval () {
      this.avtoScroll = setInterval(() => this.scroll('right'), 4000)
  }
}

const counterParticipant = new SliderCounterNumber(document.getElementById('participant__number'));
const counterParticipantMobile = new SliderCounterNumber(document.getElementById('participant__number-mobile'));

const sliderParticipant = new Slider(
  document.querySelector('.slider'),
  counterParticipant,
  document.getElementById('participant__btn-next'),
  document.getElementById('participant__btn-prev')
);

const sliderParticipantMobile = new Slider(
  document.querySelector('.slider'),
  counterParticipantMobile,
  document.getElementById('participant__btn-next-mobile'),
  document.getElementById('participant__btn-prev-mobile')
);

if(window. innerWidth> 800) {
  sliderParticipant.interval()
} else sliderParticipantMobile.interval()


const counterStages = new SliderCounterStages(document.getElementById('stages__counter'));

const sliderStages = new Slider(
  document.querySelector('.stages__wrap-mobile'),
  counterStages,
  document.querySelector('.stages__btn-next'),
  document.querySelector('.stages__btn-prev')
);

// анимация прокрутки до секций

document.querySelector('.hero__btn-think').addEventListener('click', () => {
  smoothScroll(event)
});

document.querySelector('.hero__btn-detail').addEventListener('click', () => {
  smoothScroll(event)
});

function smoothScroll(event) {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute("href") === "#" ? "hero" : event.currentTarget.getAttribute("href");
  const targetPosition = document.querySelector(targetId).offsetTop;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 1000;
  let start = null;

  window.requestAnimationFrame(step);

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
    if (progress < duration) window.requestAnimationFrame(step);
  }
}

// easing функция

function easeInOutCubic(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t * t + b;
  t -= 2;
  return c / 2 * (t * t * t + 2) + b;
};


