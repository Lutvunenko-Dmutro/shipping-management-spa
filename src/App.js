import React, { useState, useEffect } from 'react'; // Імпортуємо React та хуки useState (для стану) і useEffect (для побічних ефектів)
import './App.css'; // Імпортуємо основні стилі додатку

// Імпортуємо дочірні компоненти
import ContainerList from './components/ContainerList';       // Компонент для відображення таблиці
import AddContainerForm from './components/AddContainerForm'; // Компонент для форми додавання

// Початкові дані для списку контейнерів при першому завантаженні
const INITIAL_CONTAINERS = [
  { id: 'UA-123456', status: 'У дорозі', location: 'Порт Одеса', destination: 'Порт Гамбург' },
  { id: 'UA-654321', status: 'Доставлено', location: 'Склад (Київ)', destination: 'Склад (Київ)' },
  { id: 'UA-789012', status: 'Очікує', location: 'Порт Роттердам', destination: 'Склад (Львів)' }
];

/**
 * Головний компонент додатку React ("App").
 * Він відповідає за:
 * - Зберігання основного стану (список контейнерів, активна вкладка).
 * - Надання логіки (функцій) для зміни цього стану дочірнім компонентам.
 * - Рендеринг (відображення) відповідних компонентів залежно від стану.
 */
function App() {
  // --- Стан Компонента (useState) ---

  // Стан для зберігання масиву об'єктів контейнерів.
  // `containers` - поточне значення стану.
  // `setContainers` - функція для оновлення цього стану.
  const [containers, setContainers] = useState(INITIAL_CONTAINERS); // Початкове значення - INITIAL_CONTAINERS

  // Стан для зберігання ідентифікатора активної вкладки ('dashboard', 'add', 'reports').
  // `activeTab` - поточна активна вкладка.
  // `setActiveTab` - функція для зміни активної вкладки.
  const [activeTab, setActiveTab] = useState('dashboard'); // Початково активна вкладка 'dashboard'
  
  // --- Побічний Ефект (useEffect) для jQuery Parallax ---
  // `useEffect` дозволяє виконувати код з побічними ефектами (напр., робота з DOM напряму, запити до API)
  // ПІСЛЯ того, як React відрендерив компоненти.
  useEffect(() => {
    // Цей код виконається КОЖНОГО разу, коли значення `activeTab` зміниться (бо [activeTab] вказано як залежність).

    // Перевіряємо, чи ми зараз на вкладці 'dashboard' І чи бібліотека jQuery ($) вже завантажена (з public/index.html)
    if (activeTab === 'dashboard' && window.$) { 
      const $window = window.$(window); // Отримуємо об'єкт вікна jQuery для зручності
      const $parallaxElement = window.$('.parallax-container'); // Знаходимо наш div для паралаксу за класом
      
      // Перевіряємо, чи елемент для паралаксу існує на сторінці
      if ($parallaxElement.length) { 
        
        // Функція, яка буде викликатися при кожній події прокрутки
        const handleScroll = () => { 
          const scrolled = $window.scrollTop(); // Дізнаємося, на скільки пікселів прокручено вікно зверху

          // Змінюємо вертикальну позицію фону (`background-position`).
          // Множимо прокрутку на коефіцієнт (0.4), щоб фон рухався повільніше за сторінку.
          // Це створює ефект паралаксу (глибини).
          $parallaxElement.css('background-position', 'center ' + (scrolled * 0.4) + 'px');
        };

        // Додаємо обробник події 'scroll' до вікна.
        // '.parallax' - це простір імен, щоб ми могли потім видалити саме цей обробник.
        $window.on('scroll.parallax', handleScroll);
        
        // Функція "очищення" (cleanup function).
        // React автоматично викличе цю функцію, КОЛИ ефект буде "прибиратися":
        // 1. Перед наступним запуском цього ж ефекту (якщо activeTab зміниться).
        // 2. Коли компонент App буде видалено зі сторінки (тут це не актуально).
        // Це ВАЖЛИВО для запобігання витокам пам'яті та "подвійним" обробникам.
        return () => {
          $window.off('scroll.parallax'); // Видаляємо наш обробник події scroll
        };
      }
    }
    // Масив залежностей: [activeTab]. Цей useEffect буде перезапускатися тільки тоді,
    // коли значення `activeTab` зміниться.
  }, [activeTab]); 


  // --- Функції для Керування Даними (CRUD) ---

  /**
   * Додає новий контейнер до списку.
   * Викликається з компонента AddContainerForm.
   * @param {object} newContainerData - Об'єкт з даними нового контейнера { id, location, destination }.
   */
  const addContainer = (newContainerData) => {
    // Створюємо повний об'єкт нового контейнера, додаючи статус за замовчуванням
    const newContainer = { ...newContainerData, status: 'Очікує' };
    // Оновлюємо стан `containers`, використовуючи функціональну форму setContainers.
    // Це гарантує, що ми працюємо з найсвіжішим попереднім станом.
    // Створюємо НОВИЙ масив, копіюючи всі старі контейнери (...prevContainers) і додаючи новий в кінець.
    // ВАЖЛИВО: Ніколи не змінюйте стан напряму (push), завжди створюйте новий масив/об'єкт.
    setContainers( (prevContainers) => [...prevContainers, newContainer] );
    // Після додавання автоматично переходимо на вкладку "Панель управління"
    setActiveTab('dashboard');
  };

  /**
   * Видаляє контейнер зі списку за його ID.
   * Викликається з компонента ContainerList.
   * @param {string} idToDelete - ID контейнера, який потрібно видалити.
   */
  const deleteContainer = (idToDelete) => {
    // Оновлюємо стан `containers`.
    // Використовуємо метод .filter(), щоб створити НОВИЙ масив,
    // який містить тільки ті контейнери, чий 'id' НЕ дорівнює 'idToDelete'.
    setContainers( (prevContainers) =>
      prevContainers.filter(container => container.id !== idToDelete)
    );
  };
  
  /**
   * Оновлює статус існуючого контейнера.
   * Викликається з компонента ContainerList.
   * @param {string} idToUpdate - ID контейнера, статус якого потрібно оновити.
   * @param {string} newStatus - Новий статус для контейнера.
   */
  const updateContainerStatus = (idToUpdate, newStatus) => {
    // Оновлюємо стан `containers`.
    // Використовуємо метод .map(), щоб створити НОВИЙ масив.
    setContainers( (prevContainers) =>
      prevContainers.map(container =>
        // Якщо 'id' поточного контейнера збігається з 'idToUpdate'...
        (container.id === idToUpdate)
          // ...то створюємо НОВИЙ об'єкт контейнера, копіюючи всі старі властивості (...container)
          // і перезаписуючи властивість 'status' новим значенням 'newStatus'.
          ? { ...container, status: newStatus }
          // ...інакше (якщо це не той контейнер, який ми шукаємо) - повертаємо його без змін.
          : container 
      )
    );
  };

  // --- Розрахунок Статистики ---
  // Цей об'єкт розраховується ПРИ КОЖНОМУ рендері компонента App на основі ПОТОЧНОГО стану `containers`.
  // Це гарантує, що статистика завжди актуальна.
  const stats = {
    // Загальна кількість = довжина масиву containers
    total: containers.length,
    // Кількість "У дорозі" = довжина відфільтрованого масиву
    transit: containers.filter(c => c.status === 'У дорозі').length,
    // Кількість "Доставлено"
    delivered: containers.filter(c => c.status === 'Доставлено').length,
    // Кількість "Очікує"
    pending: containers.filter(c => c.status === 'Очікує').length,
  };

  // --- Обробник Навігації ---

  /**
   * Обробляє клік на посилання в навігації.
   * Оновлює стан `activeTab`, що призводить до перемикання відображуваного контенту.
   * @param {string} tabName - Ідентифікатор вкладки ('dashboard', 'add', 'reports').
   */
  const handleNavClick = (tabName) => {
    // Просто оновлюємо стан активної вкладки
    setActiveTab(tabName);
  };

  // --- JSX Розмітка Компонента ---
  // Повертає структуру UI, яку React має відобразити.
  return (
    // Головний div-обгортка з класом 'App'
    <div className="App"> 
      <header className="header">

        <h1>🚢 Система управління перевезеннями (React SPA)</h1>
      </header>

      <nav className="navigation">
        <ul>
          <li>

            <a 
              href="#!" 
              onClick={() => handleNavClick('dashboard')} 
              className={activeTab === 'dashboard' ? 'active' : ''}
            >
              Панель управління
            </a>
          </li>
          <li>
            <a 

              href="#!" 
              onClick={() => handleNavClick('add')}
              className={activeTab === 'add' ? 'active' : ''}
            >
              Додати контейнер
            </a>
          </li>
          <li>
            <a 

              href="#!" 
              onClick={() => handleNavClick('reports')}
              className={activeTab === 'reports' ? 'active' : ''}
            >
              Звіти
            </a>
          </li>
        </ul>
      </nav>

      <main className="container">
        
        {activeTab === 'dashboard' && (
          // --- ЗАВДАННЯ 3.1: Додаємо паралакс-контейнер ---
          <section id="dashboard-section" style={{ gridColumn: '1 / -1' }}> 
            
            {/* Це типу паралакс-елемент */}
            <div 
              className="parallax-container" 
              style={{ backgroundImage: `url('/containers.jpg')` }} 
            >
              <div className="parallax-content">
                <h2>Активні Контейнери & Моніторинг</h2>
                <p>Ефективне управління вашими перевезеннями в реальному часі.</p>
              </div>
            </div>

            {/* Тепер таблиця з контейнерами буде йти нижче */}
            <div className="dashboard-section" style={{ marginTop: '2rem' }}>
              <h2>Список активних контейнерів</h2>
              <ContainerList
                containers={containers}
                onDelete={deleteContainer}
                onUpdate={updateContainerStatus}
              />
            </div>
          </section>
        )}

        {activeTab === 'add' && (
          <section id="add-section" className="form-section" style={{ gridColumn: '1 / -1' }}> 
            <h2>Додати новий контейнер</h2>
            <AddContainerForm onAdd={addContainer} />
          </section>
        )}

        {activeTab === 'reports' && (
          <section id="reports-section" className="dashboard-section" style={{ gridColumn: '1 / -1' }}>
            <h2>Звіти: Поточний стан</h2>
            <p>Ця сторінка показує просту аналітику на основі активного списку контейнерів...</p>
            
            <ul style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>

              <li><strong>Загальна кількість контейнерів:</strong> {stats.total}</li>
              <li><strong>Кількість у дорозі:</strong> {stats.transit}</li>
              <li><strong>Кількість доставлених:</strong> {stats.delivered}</li>
              <li><strong>Кількість в очікуванні:</strong> {stats.pending}</li>
            </ul>
          </section>
        )}
      </main>

      <footer className="footer">

        <p>&copy; 2025 Модульна робота, {useName ? useName : 'Дмитро'}. React SPA.</p>
      </footer>
    </div>
  );
}

const useName = "Литвиненко Дмитро"; 

export default App;

