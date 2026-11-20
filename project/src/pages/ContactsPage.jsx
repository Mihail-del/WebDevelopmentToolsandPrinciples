import './ContactsPage.scss';

const mapUrl = 'https://www.openstreetmap.org';
const marker = '50.4489,30.5133';
const mapEmbed = `${mapUrl}/export/embed.html?bbox=30.508%2C50.446%2C30.519%2C50.453&layer=mapnik&marker=${marker}`;
const mapLink = `${mapUrl}/?mlat=50.4489&mlon=30.5133#map=16/50.4489/30.5133`;

export default function ContactsPage() {
  return (
    <section className="container shop-page">
      <h1>Контакти</h1>
      <div className="contacts-layout">
        <div className="shop-empty">
          <h2>Сувенірна крамниця</h2>
          <p>Демонстраційна локація: Київ, біля станції метро «Золоті ворота».</p>
          <a className="text-link" href="mailto:kramnytsia@example.com">kramnytsia@example.com</a>
          <a className="text-link" href={mapLink} target="_blank" rel="noreferrer">Відкрити в OpenStreetMap</a>
        </div>
        <iframe className="contacts-map" title="Карта з демонстраційною локацією крамниці" src={mapEmbed} loading="lazy" />
      </div>
      <section className="contacts-faq">
        <h2>Питання про замовлення</h2>
        <details>
          <summary>Як оформити замовлення?</summary>
          <p>Додайте сувеніри в кошик, відкрийте оформлення і заповніть форму.</p>
        </details>
        <details>
          <summary>Чи можна отримати або оплатити замовлення?</summary>
          <p>Крамниця навчальна. Замовлення зберігається в браузері, доставка й оплата не виконуються.</p>
        </details>
      </section>
    </section>
  );
}
