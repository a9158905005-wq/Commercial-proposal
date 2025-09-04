import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

interface Item {
  id: number;
  description: string;
  prices: {
    standard: number;
    optimal: number;
    premium: number;
  };
}

interface DiscountValues {
  standard: string;
  optimal: string;
  premium: string;
}

interface DiscountsState {
  cash: DiscountValues;
  volume: DiscountValues;
  contract: DiscountValues;
  contractDate: string;
  loyalCustomer: DiscountValues;
  designer: DiscountValues;
}

interface OfferState {
  logo: string;
  offerNumber: string;
  date: string;
  validUntil: string;
  from: {
    name: string;
    address: string;
    email: string;
  };
  to: {
    name: string;
    company: string;
    address: string;
  };
  introduction: string;
  photos: string[];
  items: Item[];
  discounts: DiscountsState;
  notes: string;
  footer: {
    mission: string;
    contact: {
        phone1: string;
        phone2: string;
        email: string;
        website: string;
        address: string;
    };
    telegram: string;
    whatsapp: string;
  }
}

const CONCEPT_DESIGN_LOGO_BASE64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQoAAABLCAMAAABqDs8AAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiaOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///0S5a40AAABidFJOU///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////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`;

const initialOfferState: OfferState = {
  logo: CONCEPT_DESIGN_LOGO_BASE64,
  offerNumber: '12345',
  date: new Date().toISOString().split('T')[0],
  validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  from: {
    name: 'КОНЦЕПТ DESIGN',
    address: 'г. Обнинкс, пр. Маркса, 114, ТК Центр Мебель (бывший "12 месяцев"), 2-ой этаж',
    email: 'info@mebel-concept.ru',
  },
  to: {
    name: 'Иван Иванов',
    company: 'Клиентская Компания',
    address: 'ул. Другая, 456, г. Санкт-Петербург, Россия',
  },
  introduction: `Уважаемый Иван Иванов,

Благодарим вас за интерес к нашим услугам. В продолжение нашего недавнего разговора, мы рады представить вам следующее коммерческое предложение для рассмотрения.`,
  photos: [],
  items: [
    { id: 1, description: 'Разработка веб-сайта', prices: { standard: 350000, optimal: 450000, premium: 600000 } },
    { id: 2, description: 'Ежемесячные SEO-услуги', prices: { standard: 150000, optimal: 195000, premium: 255000 } },
  ],
  discounts: {
    cash: { standard: '0', optimal: '0', premium: '0' },
    volume: { standard: '0', optimal: '0', premium: '0' },
    contract: { standard: '0', optimal: '0', premium: '0' },
    contractDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    loyalCustomer: { standard: '0', optimal: '0', premium: '0' },
    designer: { standard: '0', optimal: '0', premium: '0' },
  },
  notes: 'Условия оплаты: 50% предоплата, 50% по завершении.\nСроки проекта: 4-6 недель.',
  footer: {
    mission: "Наша миссия — создать уют и функциональный комфорт в вашем доме, предлагая доступные цены и высокий уровень обслуживания. Мы постоянно совершенствуем наш ассортимент, учитывая актуальные тренды потребительских предпочтений, что позволяет нам гармонично сочетать дизайн, цену и качество продукции.",
    contact: {
      phone1: "+7(484) 39-50-7-50",
      phone2: "+7(910) 912-62-03",
      email: "info@mebel-concept.ru",
      website: "https://mebel-concept.ru/",
      address: "г. Обнинкс, пр. Маркса, 114, ТК Центр Мебель (бывший \"12 месяцев\"), 2-ой этаж"
    },
    telegram: "https://t.me/your_telegram",
    whatsapp: "https://wa.me/79158905005"
  }
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const IconPhone = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconMail = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IconMapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconGlobe = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
const IconTelegram = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.58c-.28 1.13-1.02 1.4-1.74 1.02l-4.84-3.56l-2.31 2.2a1.28 1.28 0 0 1-1.01.51z"/></svg>;
const IconWhatsApp = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.043 4.957A9.954 9.954 0 0 0 12.001 2C6.478 2 2 6.477 2 12.001c0 1.756.452 3.425 1.258 4.904l-1.258 4.601 4.708-1.235a9.924 9.924 0 0 0 4.293 1.079h.001c5.522 0 9.999-4.477 9.999-9.999a9.952 9.952 0 0 0-2.958-7.043zm-7.042 14.088c-1.402 0-2.756-.4-3.95-1.125l-.285-.168l-2.943.774l.788-2.872l-.183-.298c-.802-1.3-1.218-2.8-1.218-4.354c0-4.411 3.589-7.999 8-7.999c2.146 0 4.13.826 5.657 2.343c1.527 1.527 2.343 3.511 2.343 5.657c0 4.411-3.588 7.999-7.999 7.999zm4.33-5.913c-.233-.116-1.37-.674-1.583-.75c-.212-.075-.367-.116-.522.116c-.155.232-.598.75-.733.9c-.135.151-.27.168-.503.052c-.233-.116-.99-.364-1.884-1.16c-.694-.614-1.16-1.365-1.3-1.597c-.134-.232-.014-.358.102-.474c.104-.105.233-.27.348-.405c.116-.135.155-.232.233-.387c.078-.155.039-.29-.019-.404c-.058-.116-.522-1.255-.717-1.716c-.187-.446-.38-.385-.521-.392c-.135-.008-.29-.008-.445-.008c-.155 0-.406.056-.618.3c-.212.24-.81.797-.81 1.94c0 1.144.83 2.253.945 2.408c.115.155 1.636 2.495 3.978 3.5c.56.24.99.387 1.32.495c.57.185 1.04.16 1.43.098c.44-.072 1.37-.56 1.56-1.1c.196-.54.196-1.004.136-1.1c-.058-.096-.213-.155-.446-.27z"/></svg>;


const App: React.FC = () => {
  const [offer, setOffer] = useState<OfferState>(initialOfferState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [totals, setTotals] = useState({ standard: 0, optimal: 0, premium: 0 });

  useEffect(() => {
    const subtotals = offer.items.reduce((acc, item) => {
        acc.standard += item.prices.standard;
        acc.optimal += item.prices.optimal;
        acc.premium += item.prices.premium;
        return acc;
    }, { standard: 0, optimal: 0, premium: 0 });

    setTotals({
        standard: subtotals.standard,
        optimal: subtotals.optimal,
        premium: subtotals.premium,
    });
  }, [offer.items]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const parts = name.split('.');
    
    if (parts.length === 3) { // Handles footer.contact.phone1
        const [section, subSection, field] = parts;
        setOffer(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subSection]: {
                    ...prev[section][subSection],
                    [field]: value
                }
            }
        }));
    } else if (parts.length === 2) { // Handles to.name, footer.mission etc.
        const [section, field] = parts;
        setOffer(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    } else {
        setOffer(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setOffer(prev => ({
          ...prev,
          logo: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setOffer(prev => ({
      ...prev,
      logo: ''
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        const currentPhotosCount = offer.photos.length;
        const remainingSlots = 3 - currentPhotosCount;

        if (files.length > remainingSlots) {
            alert(`Вы можете загрузить еще не более ${remainingSlots} фото.`);
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                setOffer(prev => ({
                    ...prev,
                    photos: [...prev.photos, event.target?.result as string]
                }));
            };
            reader.readAsDataURL(file);
        });
        e.target.value = ''; // Reset input value
    }
  };

  const removePhoto = (indexToRemove: number) => {
      setOffer(prev => ({
          ...prev,
          photos: prev.photos.filter((_, index) => index !== indexToRemove)
      }));
  };

  const handleItemChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [field, tier] = name.split('.'); // e.g., name="prices.standard"

    setOffer(prev => ({
        ...prev,
        items: prev.items.map(item => {
            if (item.id !== id) return item;

            if (field === 'prices' && tier) {
                return {
                    ...item,
                    prices: {
                        ...item.prices,
                        [tier]: parseFloat(value) || 0
                    }
                };
            } else {
                return { ...item, [name]: value };
            }
        })
    }));
  };
  
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [field, tier] = name.split('.'); // e.g., "cash.standard"
    
    if (field === 'contractDate') {
        setOffer(prev => ({
            ...prev,
            discounts: { ...prev.discounts, contractDate: value }
        }));
    } else if (tier && field in offer.discounts) {
        setOffer(prev => ({
            ...prev,
            discounts: {
                ...prev.discounts,
                [field]: {
                    ...((prev.discounts as any)[field] as DiscountValues),
                    [tier]: value
                }
            }
        }));
    }
  };


  const addItem = () => {
    setOffer(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Date.now(), description: '', prices: { standard: 0, optimal: 0, premium: 0 } }
      ]
    }));
  };

  const removeItem = (id: number) => {
    setOffer(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };
  
  const generateIntro = async () => {
      if (isGenerating) return;
      setIsGenerating(true);
      try {
          const itemsDescription = offer.items.map(i => `- ${i.description}`).join('\n');
          const prompt = `Напиши профессиональное и убедительное введение для коммерческого предложения клиенту по имени ${offer.to.name} из компании ${offer.to.company}.
Предложение включает следующие позиции:
${itemsDescription}

Мы предлагаем три варианта стоимости: Стандарт (${formatCurrency(totals.standard)}), Оптимальный (${formatCurrency(totals.optimal)}) и Премиум (${formatCurrency(totals.premium)}).

Тон должен быть уверенным, дружелюбным и ориентированным на клиента. Начни с персонализированного приветствия. Не включай тему письма или заголовок "Введение". Просто напиши текст введения.`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });
          
          const newIntroduction = response.text;
          setOffer(prev => ({ ...prev, introduction: newIntroduction.trim() }));
      } catch (error) {
          console.error("Error generating introduction:", error);
          alert("Не удалось сгенерировать введение. Подробности в консоли.");
      } finally {
          setIsGenerating(false);
      }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };
  
  const isDiscountRowVisible = (discount: DiscountValues) => {
    return (discount.standard && discount.standard !== '0') || 
           (discount.optimal && discount.optimal !== '0') || 
           (discount.premium && discount.premium !== '0');
  }

  const areAnyDiscountsVisible = () => {
      const d = offer.discounts;
      return isDiscountRowVisible(d.cash) ||
             isDiscountRowVisible(d.volume) ||
             isDiscountRowVisible(d.contract) ||
             isDiscountRowVisible(d.loyalCustomer) ||
             isDiscountRowVisible(d.designer);
  }

  const renderDiscounts = () => {
    let counter = 1;
    const d = offer.discounts;

    const formatDiscountCell = (value: string) => {
        return value && value !== '0' ? `${value}%` : '';
    };

    return (
        <tbody>
            {isDiscountRowVisible(d.cash) && <tr><td>{counter++}. Скидка за наличный расчет</td><td>{formatDiscountCell(d.cash.standard)}</td><td>{formatDiscountCell(d.cash.optimal)}</td><td>{formatDiscountCell(d.cash.premium)}</td></tr>}
            {isDiscountRowVisible(d.volume) && <tr><td>{counter++}. Скидка за объем</td><td>{formatDiscountCell(d.volume.standard)}</td><td>{formatDiscountCell(d.volume.optimal)}</td><td>{formatDiscountCell(d.volume.premium)}</td></tr>}
            {isDiscountRowVisible(d.contract) && <tr><td>{counter++}. Скидка за заключение договора до {d.contractDate ? new Date(d.contractDate).toLocaleDateString('ru-RU') : '___'}</td><td>{formatDiscountCell(d.contract.standard)}</td><td>{formatDiscountCell(d.contract.optimal)}</td><td>{formatDiscountCell(d.contract.premium)}</td></tr>}
            {isDiscountRowVisible(d.loyalCustomer) && <tr><td>{counter++}. Скидка постоянному заказчику</td><td>{formatDiscountCell(d.loyalCustomer.standard)}</td><td>{formatDiscountCell(d.loyalCustomer.optimal)}</td><td>{formatDiscountCell(d.loyalCustomer.premium)}</td></tr>}
            {isDiscountRowVisible(d.designer) && <tr><td>{counter++}. Скидка консультанта-дизайнера</td><td>{formatDiscountCell(d.designer.standard)}</td><td>{formatDiscountCell(d.designer.optimal)}</td><td>{formatDiscountCell(d.designer.premium)}</td></tr>}
        </tbody>
    );
  };


  return (
    <div className="app-container">
      <div className="form-panel">
        <h1>Генератор коммерческих предложений</h1>

        {/* Offer Details */}
        <div className="form-section">
          <h2>Детали предложения</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="offerNumber">Номер предложения</label>
              <input type="text" id="offerNumber" name="offerNumber" value={offer.offerNumber} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="date">Дата</label>
              <input type="date" id="date" name="date" value={offer.date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="validUntil">Действительно до</label>
              <input type="date" id="validUntil" name="validUntil" value={offer.validUntil} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="form-section">
          <h2>Логотип компании</h2>
          <div className="form-group full-width">
            <label htmlFor="logo">Загрузить логотип</label>
            <input 
              type="file" 
              id="logo" 
              name="logo" 
              accept="image/*" 
              onChange={handleLogoChange} 
            />
            {offer.logo && (
              <div className="logo-preview-container">
                <img src={offer.logo} alt="Предварительный просмотр логотипа" className="logo-preview" />
                <button onClick={removeLogo} className="btn-remove-photo" aria-label="Удалить логотип">×</button>
              </div>
            )}
          </div>
        </div>

        {/* From/To */}
        <div className="form-section">
            <div className="form-grid">
                <div>
                    <h2>От кого</h2>
                    <div className="form-group">
                        <label>Название компании</label>
                        <input type="text" name="from.name" value={offer.from.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Адрес</label>
                        <input type="text" name="from.address" value={offer.from.address} onChange={handleChange} />
                    </div>
                     <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="from.email" value={offer.from.email} onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <h2>Кому</h2>
                     <div className="form-group">
                        <label>Имя клиента</label>
                        <input type="text" name="to.name" value={offer.to.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Компания клиента</label>
                        <input type="text" name="to.company" value={offer.to.company} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Адрес</label>
                        <input type="text" name="to.address" value={offer.to.address} onChange={handleChange} />
                    </div>
                </div>
            </div>
        </div>
        
        {/* Introduction */}
        <div className="form-section">
            <h2>Введение</h2>
            <div className="form-group full-width ai-input-group">
                <label htmlFor="introduction">Введение к предложению</label>
                <textarea id="introduction" name="introduction" value={offer.introduction} onChange={handleChange} rows={6}></textarea>
                 <button onClick={generateIntro} className={`btn-primary btn-ai ${isGenerating ? 'loading' : ''}`} disabled={isGenerating} aria-label="Сгенерировать введение с помощью ИИ">
                    {isGenerating ? 'Генерация...' : '✨ Сгенерировать с помощью ИИ'}
                </button>
            </div>
        </div>

        {/* Project Photos */}
        <div className="form-section">
          <h2>Фотографии проекта</h2>
          <div className="form-group full-width">
            <label htmlFor="photos">Загрузить до 3-х изображений</label>
            <input 
              type="file" 
              id="photos" 
              name="photos" 
              accept="image/*" 
              multiple 
              onChange={handlePhotoChange} 
              disabled={offer.photos.length >= 3}
            />
             <div className="photo-previews">
              {offer.photos.map((photo, index) => (
                <div key={index} className="photo-preview-item">
                  <img src={photo} alt={`Предварительный просмотр ${index + 1}`} />
                  <button onClick={() => removePhoto(index)} className="btn-remove-photo" aria-label={`Удалить фото ${index + 1}`}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Items */}
        <div className="form-section">
          <h2>Позиции</h2>
          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Описание</th>
                  <th>Стандарт</th>
                  <th>Оптимальный</th>
                  <th>Премиум</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {offer.items.map(item => (
                  <tr key={item.id} className="item-row">
                    <td><input type="text" name="description" value={item.description} onChange={(e) => handleItemChange(item.id, e)} placeholder="Описание позиции" /></td>
                    <td><input type="number" name="prices.standard" value={item.prices.standard} onChange={(e) => handleItemChange(item.id, e)} style={{width: '90px'}}/></td>
                    <td><input type="number" name="prices.optimal" value={item.prices.optimal} onChange={(e) => handleItemChange(item.id, e)} style={{width: '90px'}}/></td>
                    <td><input type="number" name="prices.premium" value={item.prices.premium} onChange={(e) => handleItemChange(item.id, e)} style={{width: '90px'}}/></td>
                    <td><button onClick={() => removeItem(item.id)} className="btn-danger" aria-label={`Удалить ${item.description}`}>-</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addItem} className="btn-secondary" style={{marginTop: '1rem'}}>+ Добавить позицию</button>
          </div>
        </div>
        
        {/* Discounts */}
        <div className="form-section">
          <h2 className="discounts-header">Скидки %</h2>
          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Описание</th>
                  <th>Стандарт</th>
                  <th>Оптимальный</th>
                  <th>Премиум</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Скидка за наличный расчет</td>
                  <td><input type="text" name="cash.standard" value={offer.discounts.cash.standard} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.cash.standard && offer.discounts.cash.standard !== '0') ? 'non-zero-discount' : ''} /></td>
                  <td><input type="text" name="cash.optimal" value={offer.discounts.cash.optimal} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.cash.optimal && offer.discounts.cash.optimal !== '0') ? 'non-zero-discount' : ''} /></td>
                  <td><input type="text" name="cash.premium" value={offer.discounts.cash.premium} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.cash.premium && offer.discounts.cash.premium !== '0') ? 'non-zero-discount' : ''} /></td>
                </tr>
                <tr>
                  <td>Скидка за объем</td>
                  <td><input type="text" name="volume.standard" value={offer.discounts.volume.standard} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.volume.standard && offer.discounts.volume.standard !== '0') ? 'non-zero-discount' : ''} /></td>
                  <td><input type="text" name="volume.optimal" value={offer.discounts.volume.optimal} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.volume.optimal && offer.discounts.volume.optimal !== '0') ? 'non-zero-discount' : ''} /></td>
                  <td><input type="text" name="volume.premium" value={offer.discounts.volume.premium} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.volume.premium && offer.discounts.volume.premium !== '0') ? 'non-zero-discount' : ''} /></td>
                </tr>
                 <tr>
                    <td className="contract-date-cell">
                        Скидка за заключение договора до {' '}
                        <input type="date" name="contractDate" value={offer.discounts.contractDate} onChange={handleDiscountChange} className="inline-date-input"/>
                    </td>
                    <td><input type="text" name="contract.standard" value={offer.discounts.contract.standard} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.contract.standard && offer.discounts.contract.standard !== '0') ? 'non-zero-discount' : ''} /></td>
                    <td><input type="text" name="contract.optimal" value={offer.discounts.contract.optimal} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.contract.optimal && offer.discounts.contract.optimal !== '0') ? 'non-zero-discount' : ''} /></td>
                    <td><input type="text" name="contract.premium" value={offer.discounts.contract.premium} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.contract.premium && offer.discounts.contract.premium !== '0') ? 'non-zero-discount' : ''} /></td>
                </tr>
                <tr>
                  <td>Скидка постоянному заказчику</td>
                  <td><input type="text" name="loyalCustomer.standard" value={offer.discounts.loyalCustomer.standard} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.loyalCustomer.standard && offer.discounts.loyalCustomer.standard !== '0') ? 'non-zero-discount' : ''} /></td>
                  <td><input type="text" name="loyalCustomer.optimal" value={offer.discounts.loyalCustomer.optimal} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.loyalCustomer.optimal && offer.discounts.loyalCustomer.optimal !== '0') ? 'non-zero-discount' : ''} /></td>
                  <td><input type="text" name="loyalCustomer.premium" value={offer.discounts.loyalCustomer.premium} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.loyalCustomer.premium && offer.discounts.loyalCustomer.premium !== '0') ? 'non-zero-discount' : ''} /></td>
                </tr>
                <tr>
                  <td>Скидка консультанта-дизайнера</td>
                  <td><input type="text" name="designer.standard" value={offer.discounts.designer.standard} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.designer.standard && offer.discounts.designer.standard !== '0') ? 'non-zero-discount' : ''} /></td>
                  <td><input type="text" name="designer.optimal" value={offer.discounts.designer.optimal} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.designer.optimal && offer.discounts.designer.optimal !== '0') ? 'non-zero-discount' : ''} /></td>
                  <td><input type="text" name="designer.premium" value={offer.discounts.designer.premium} onChange={handleDiscountChange} placeholder="0" className={(offer.discounts.designer.premium && offer.discounts.designer.premium !== '0') ? 'non-zero-discount' : ''} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals & Notes */}
        <div className="form-section">
            <h2>Итоги и примечания</h2>
            <div className="form-grid">
                <div className="form-group full-width">
                    <label htmlFor="notes">Примечания / Условия</label>
                    <textarea id="notes" name="notes" value={offer.notes} onChange={handleChange} rows={4}></textarea>
                </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="form-section">
            <h2>Подвал и контакты</h2>
            <div className="form-group full-width">
                <label htmlFor="footer.mission">Текст в подвале (миссия)</label>
                <textarea id="footer.mission" name="footer.mission" value={offer.footer.mission} onChange={handleChange} rows={4}></textarea>
            </div>
            <div className="form-grid">
                <div className="form-group">
                    <label>Телефон 1</label>
                    <input type="text" name="footer.contact.phone1" value={offer.footer.contact.phone1} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Телефон 2</label>
                    <input type="text" name="footer.contact.phone2" value={offer.footer.contact.phone2} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="footer.contact.email" value={offer.footer.contact.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Веб-сайт</label>
                    <input type="text" name="footer.contact.website" value={offer.footer.contact.website} onChange={handleChange} />
                </div>
                <div className="form-group full-width">
                    <label>Адрес</label>
                    <input type="text" name="footer.contact.address" value={offer.footer.contact.address} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Ссылка на Telegram</label>
                    <input type="text" name="footer.telegram" value={offer.footer.telegram} onChange={handleChange} />
                </div>
                 <div className="form-group">
                    <label>Ссылка на WhatsApp</label>
                    <input type="text" name="footer.whatsapp" value={offer.footer.whatsapp} onChange={handleChange} />
                </div>
            </div>
        </div>

        <div className="print-button-container">
            <button onClick={() => window.print()} className="btn-primary">Распечатать предложение</button>
        </div>
      </div>

      <div className="preview-panel">
        <div className="offer-document">
          <header className="offer-header">
            <div className="header-left">
              {offer.logo ? (
                  <img src={offer.logo} alt="Логотип компании" className="company-logo" />
              ) : (
                  <div className="company-name-fallback">{offer.from.name}</div>
              )}
              <div className="offer-details">
                <strong>Номер:</strong> {offer.offerNumber}<br/>
                <strong>Дата:</strong> {offer.date}<br/>
                <strong>Действительно до:</strong> {offer.validUntil}<br/>
              </div>
            </div>
            <div className="header-right">
                <div className="client-info">
                  <strong>Кому:</strong><br/>
                  {offer.to.name}<br/>
                  {offer.to.company}<br/>
                  {offer.to.address.split(',').map((line, i) => <React.Fragment key={i}>{line.trim()}<br/></React.Fragment>)}
                </div>
            </div>
          </header>

          <main className="offer-body">
            <p>{offer.introduction}</p>

            {offer.photos.length > 0 && (
                <div className="offer-photos">
                    {offer.photos.map((photo, index) => (
                        <img key={index} src={photo} alt={`Фото проекта ${index + 1}`} className="project-photo" />
                    ))}
                </div>
            )}
            
            <table className="pricing-comparison-table">
              <thead>
                <tr>
                  <th>Стоимость проекта</th>
                  <th>Стандарт</th>
                  <th className="optimal-column-header">
                    <div className="best-price-badge">🔥 Лучшая цена</div>
                    Оптимальный
                  </th>
                  <th>Премиум</th>
                </tr>
              </thead>
              <tbody>
                <tr className="total-row">
                    <td>Итого:</td>
                    <td>{formatCurrency(totals.standard)}</td>
                    <td className="optimal-column">{formatCurrency(totals.optimal)}</td>
                    <td>{formatCurrency(totals.premium)}</td>
                </tr>
                {offer.items.map(item => (
                  <tr key={item.id}>
                    <td className="item-description">{item.description}</td>
                    <td>{formatCurrency(item.prices.standard)}</td>
                    <td className="optimal-column">{formatCurrency(item.prices.optimal)}</td>
                    <td>{formatCurrency(item.prices.premium)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {areAnyDiscountsVisible() && (
              <section className="offer-discounts">
                <table className="discounts-table">
                  <thead>
                    <tr>
                      <th>Скидки</th>
                      <th>Стандарт</th>
                      <th>Оптимальный</th>
                      <th>Премиум</th>
                    </tr>
                  </thead>
                  {renderDiscounts()}
                </table>
              </section>
            )}
          </main>
          
          <section className="offer-notes">
            <p><strong>Примечания и условия:</strong></p>
            <p style={{whiteSpace: 'pre-wrap'}}>{offer.notes}</p>
          </section>

          <footer className="offer-footer">
            <div className="footer-mission">
                <p>{offer.footer.mission}</p>
            </div>
            <div className="footer-contacts">
                <h3>Контакты компании:</h3>
                <div className="contacts-grid">
                    <div className="contact-item">
                        <span className="contact-icon"><IconPhone /></span>
                        <span>{offer.footer.contact.phone1}</span>
                    </div>
                     <div className="contact-item">
                        <span className="contact-icon"><IconPhone /></span>
                        <span>{offer.footer.contact.phone2}</span>
                    </div>
                    <div className="contact-item">
                        <span className="contact-icon"><IconMail /></span>
                        <span>{offer.footer.contact.email}</span>
                    </div>
                     <div className="contact-item">
                        <span className="contact-icon"><IconGlobe /></span>
                        <span>{offer.footer.contact.website}</span>
                    </div>
                    <div className="contact-item contact-item-full-width">
                        <span className="contact-icon"><IconMapPin /></span>
                        <span>{offer.footer.contact.address}</span>
                    </div>
                </div>
                <div className="social-buttons">
                    <a href={offer.footer.telegram} target="_blank" rel="noopener noreferrer" className="btn-social btn-telegram">
                        <IconTelegram /> Написать в Telegram
                    </a>
                    <a href={offer.footer.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-social btn-whatsapp">
                        <IconWhatsApp /> Написать в WhatsApp
                    </a>
                </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);