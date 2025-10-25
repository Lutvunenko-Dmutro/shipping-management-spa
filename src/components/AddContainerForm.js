// Шлях: container-app/src/components/AddContainerForm.js

import React, { useState } from 'react';

// Цей компонент тепер має значно потужнішу логіку валідації
function AddContainerForm({ onAdd }) {
  
  // 1. Стан для значень полів
  const [id, setId] = useState('');
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');

  // 2. Стан для ПОМИЛОК (окремо для кожного поля)
  const [errors, setErrors] = useState({
    id: '',
    location: '',
    destination: ''
  });

  // 3. Стан для відстеження, чи торкався користувач поля
  const [touched, setTouched] = useState({
    id: false,
    location: false,
    destination: false
  });

  // --- Функція валідації ---
  // Вона перевіряє поле і оновлює стан помилок
  const validateField = (fieldName, value) => {
    let errorMessage = '';

    switch (fieldName) {
      case 'id':
        const idRegex = /^[A-Z]{2}-\d{6}$/;
        if (value.length > 0 && !idRegex.test(value)) {
          errorMessage = 'Невірний формат. Очікується XX-123456';
        }
        break;
      case 'location':
        if (value.length > 0 && value.trim().length < 3) {
          errorMessage = 'Поле має містити мінімум 3 символи';
        }
        break;
      case 'destination':
        if (value.length > 0 && value.trim().length < 3) {
          errorMessage = 'Поле має містити мінімум 3 символи';
        }
        break;
      default:
        break;
    }
    
    // Оновлюємо об'єкт помилок
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: errorMessage
    }));
  };

  // --- Обробники ---

  // Обробник 'onChange' (при кожному натисканні клавіші)
  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'id':
        setId(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'destination':
        setDestination(value);
        break;
      default:
        break;
    }
    
    // Валідуємо поле в реальному часі
    validateField(name, value);
  };

  // Обробник 'onBlur' (коли користувач клікнув *з* поля)
  const handleBlur = (e) => {
    const { name } = e.target;
    // Позначаємо поле як "торкнуте", щоб знати, чи показувати помилку
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    // Ще раз валідуємо на випадок, якщо користувач нічого не ввів
    validateField(name, e.target.value);
  };
  

  // Обробник відправки форми
  const handleSubmit = (event) => {
    event.preventDefault(); 
    
    // Позначаємо всі поля як "торкнуті", щоб показати всі помилки
    setTouched({ id: true, location: true, destination: true });

    // Перевіряємо помилки ще раз + перевіряємо на порожні поля
    validateField('id', id);
    validateField('location', location);
    validateField('destination', destination);

    let hasErrors = false;
    let newErrors = { ...errors }; // Створюємо копію

    // Перевірка на порожні поля при відправці
    if (id.trim().length === 0) {
      newErrors.id = 'Поле не може бути порожнім';
      hasErrors = true;
    }
    if (location.trim().length === 0) {
      newErrors.location = 'Поле не може бути порожнім';
      hasErrors = true;
    }
    if (destination.trim().length === 0) {
      newErrors.destination = 'Поле не може бути порожнім';
      hasErrors = true;
    }

    setErrors(newErrors);

    // Перевіряємо, чи є хоч одна помилка в стані
    if (hasErrors || Object.values(newErrors).some(error => error.length > 0)) {
      console.log('Форма невалідна');
      return; // Не відправляємо
    }

    // --- Якщо все добре ---
    onAdd({ id, location, destination });

    // Очищуємо форму
    setId('');
    setLocation('');
    setDestination('');
    setErrors({ id: '', location: '', destination: '' });
    setTouched({ id: false, location: false, destination: false });
  };
  
  // --- Функції для визначення CSS-класу ---
  const getFieldClass = (fieldName) => {
    if (!touched[fieldName]) return ''; // Не чіпаємо, якщо не торкалися
    if (errors[fieldName]) return 'invalid'; // Червоне, якщо є помилка
    // Перевіряємо, чи поле не порожнє перед тим, як зробити зеленим
    if (fieldName === 'id' && id.length > 0) return 'valid'; 
    if (fieldName === 'location' && location.length > 0) return 'valid';
    if (fieldName === 'destination' && destination.length > 0) return 'valid';
    return '';
  };


  return (
    <form onSubmit={handleSubmit}>
      
      <div className="form-group">
        <label htmlFor="containerId">ID Контейнера:</label>
        <input 
          type="text" 
          id="containerId"
          name="id" // Додаємо 'name'
          placeholder="Напр., UA-987654"
          value={id} 
          onChange={handleChange}
          onBlur={handleBlur} // Додаємо 'onBlur'
          className={getFieldClass('id')} // Динамічний CSS клас
        />
        {/* Повідомлення про помилку з'являється тут */}
        {touched.id && errors.id && <div className="error-message">{errors.id}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="location">Поточне місцезнаходження:</label>
        <input 
          type="text" 
          id="location"
          name="location"
          value={location}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getFieldClass('location')}
        />
        {touched.location && errors.location && <div className="error-message">{errors.location}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="destination">Призначення:</label>
        <input 
          type="text" 
          id="destination"
          name="destination"
          value={destination}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getFieldClass('destination')}
        />
        {touched.destination && errors.destination && <div className="error-message">{errors.destination}</div>}
      </div>
      
      <button type="submit" className="btn btn-submit">
        Додати
      </button>
    </form>
  );
}

export default AddContainerForm;