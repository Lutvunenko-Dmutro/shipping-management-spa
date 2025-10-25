import React, { useState, useEffect } from 'react'; // useRef вже не потрібен
import './App.css'; 

import ContainerList from './components/ContainerList';
import AddContainerForm from './components/AddContainerForm';

const INITIAL_CONTAINERS = [
  { id: 'UA-123456', status: 'У дорозі', location: 'Порт Одеса', destination: 'Порт Гамбург' },
  { id: 'UA-654321', status: 'Доставлено', location: 'Склад (Київ)', destination: 'Склад (Київ)' },
  { id: 'UA-789012', status: 'Очікує', location: 'Порт Роттердам', destination: 'Склад (Львів)' }
];

function App() {
  const [containers, setContainers] = useState(INITIAL_CONTAINERS);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  
  // --- ЗАВДАННЯ 3.1 (jQuery): Реалізація паралакс-ефекту ---
  useEffect(() => {
    // Цей ефект спрацює, коли 'activeTab' зміниться
    if (activeTab === 'dashboard' && window.$) { // Перевіряємо, чи jQuery завантажено і чи ми на потрібній вкладці
      const $window = window.$(window); 
      const $parallaxElement = window.$('.parallax-container'); 
      
      if ($parallaxElement.length) { 
        
        const handleScroll = () => { // Виносимо обробник в окрему функцію
          const scrolled = $window.scrollTop(); 
          // Змінюємо позицію фону. Позитивне значення (scrolled * 0.4)
          // змусить фон рухатися ВНИЗ, але повільніше за скрол. Це виглядає краще.
          $parallaxElement.css('background-position', 'center ' + (scrolled * 0.4) + 'px');
        };

        // Додаємо обробник
        $window.on('scroll.parallax', handleScroll);
        
        // Повертаємо функцію "очищення".
        // Вона спрацює, коли компонент зникне (напр., при переході на іншу вкладку).
        return () => {
          $window.off('scroll.parallax'); // Видаляємо *саме цей* обробник
        };
      }
    }
  }, [activeTab]); // Запускаємо ефект, коли змінюється вкладка


  const addContainer = (newContainerData) => {
    const newContainer = { ...newContainerData, status: 'Очікує' };
    setContainers( (prevContainers) => [...prevContainers, newContainer] );
    setActiveTab('dashboard');
  };

  const deleteContainer = (idToDelete) => {
    setContainers( (prevContainers) =>
      prevContainers.filter(container => container.id !== idToDelete)
    );
  };
  
  const updateContainerStatus = (idToUpdate, newStatus) => {
    setContainers( (prevContainers) =>
      prevContainers.map(container =>
        (container.id === idToUpdate)
          ? { ...container, status: newStatus }
          : container 
      )
    );
  };

  const stats = {

    total: containers.length,
    transit: containers.filter(c => c.status === 'У дорозі').length,
    delivered: containers.filter(c => c.status === 'Доставлено').length,
    pending: containers.filter(c => c.status === 'Очікує').length,
  };

  const handleNavClick = (tabName) => {

    setActiveTab(tabName);
  };

  return (
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
            
            {/* Це буде наш паралакс-елемент */}
            <div 
              className="parallax-container" 
              style={{ backgroundImage: `url('/containers.jpg')` }} // Шлях до вашої локальної фотографії
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

