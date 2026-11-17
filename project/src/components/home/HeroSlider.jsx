import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';

const slides = [
  { image: '/images/banners/hero.webp', label: 'Сувеніри з українських міст', title: <>Маленькі речі.<br /><em>Великі спогади.</em></>, text: 'Знайомі вулиці, улюблені міста. Збережіть їх поруч.', button: 'Переглянути каталог', to: '/catalog' },
  { image: '/images/products/kyiv-mug/main.webp', label: 'Тепло, яке залишається', title: <>Для ранків<br /><em>зі своїм містом.</em></>, text: 'Кераміка з українським характером і місцем для вашої кави.', button: 'Переглянути чашки', to: '/catalog?category=mugs' },
  { image: '/images/products/odesa-poster/main.webp', label: 'Трохи моря вдома', title: <>Улюблені місця.<br /><em>Нові історії.</em></>, text: 'Постери, що повертають до найтепліших подорожей.', button: 'Переглянути постери', to: '/catalog?category=posters' },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [interacting, setInteracting] = useState(false);

  useEffect(() => {
    if (paused || interacting) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused, interacting, active]);

  function selectSlide(index) { setActive((index + slides.length) % slides.length); }
  const slide = slides[active];

  return (
    <section className={`hero hero--${active}`} aria-label="Добірки сувенірів" aria-roledescription="карусель"
      onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
      <div className="hero__images" aria-hidden="true">
        {slides.map((item, index) => <img key={item.image} className={index === active ? 'is-active' : ''} src={item.image} alt="" fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" />)}
      </div>
      <div className="hero__wash" />
      <div className="container hero__content">
        <p className="eyebrow">{slide.label}</p>
        <h1>{slide.title}</h1>
        <p className="hero__description">{slide.text}</p>
        <Link className="button" to={slide.to}>{slide.button}<ArrowRight size={18} strokeWidth={1.5} /></Link>
      </div>
      <div className="container hero__controls">
        <div className="hero__pagination" aria-label="Оберіть слайд">
          {slides.map((item, index) => <button key={item.image} className={index === active ? 'is-active' : ''} aria-label={`Слайд ${index + 1}: ${item.label}`} aria-pressed={index === active} onClick={() => selectSlide(index)} />)}
          <span className="hero__count" aria-live={paused || interacting ? 'polite' : 'off'}>0{active + 1} / 03</span>
        </div>
        <div className="hero__arrows">
          <button className="icon-button" aria-label={paused ? 'Увімкнути автоматичну зміну слайдів' : 'Призупинити слайдер'} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>
          <button className="icon-button" aria-label="Попередній слайд" onClick={() => selectSlide(active - 1)}><ArrowLeft size={19} /></button>
          <button className="icon-button" aria-label="Наступний слайд" onClick={() => selectSlide(active + 1)}><ArrowRight size={19} /></button>
        </div>
      </div>
    </section>
  );
}
