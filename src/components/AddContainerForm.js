import React, { useState } from 'react';

// Компонент для форми додавання
function AddContainerForm({ onAdd }) {
  
  // Локальний стан для полів вводу
  const [id, setId] = useState('');
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState(''); // Стан для помилки валідації

  // Обробник відправки форми
  const handleSubmit = (event) => {
    event.preventDefault(); // Заборона перезавантаження сторінки

    // Валідація
    const idRegex = /^[A-Z]{2}-\d{6}$/;
    if (!idRegex.test(id)) {
      setError('Невірний формат ID. Очікується XX-123456');
      return;
    }
    if (location.trim().length < 3) {
      setError('Локація має містити мінімум 3 символи');
      return;
    }
    if (destination.trim().length < 3) {
      setError('Призначення має містити мінімум 3 символи');
      return;
    }

    // Якщо все добре
    setError(''); 
    onAdd({ id, location, destination }); // Викликаємо функцію з App.js

    // Очищуємо поля
    setId('');
    setLocation('');
    setDestination('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="containerId">ID Контейнера:</label>
        <input
          type="text"
          id="containerId"
          placeholder="Напр., UA-987654"
          value={id} 
          onChange={(e) => setId(e.target.value)} // Оновлюємо стан при вводі
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Поточне місцезнаходження:</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="destination">Призначення:</label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      {/* Показ помилки */}
      {error && <p className="error-message">{error}</p>}

      <button type="submit" className="btn btn-submit">
        Додати
      </button>
    </form>
  );
}

export default AddContainerForm;
