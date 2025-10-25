import React from 'react';

// Компонент для відображення списку контейнерів
function ContainerList({ containers, onDelete, onUpdate }) {

  // Функція для отримання CSS-класу статусу
  const getStatusClass = (status) => {
    switch (status) {
      case 'У дорозі':
        return 'status-transit';
      case 'Доставлено':
        return 'status-delivered';
      case 'Очікує':
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID Контейнера</th>
            <th>Статус</th>
            <th>Місцезнаходження</th>
            <th>Призначення</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {/* Перебираємо масив 'containers' і для кожного малюємо <tr> */}
          {containers.map((container) => (
            <tr key={container.id}>
              <td>{container.id}</td>
              <td>
                <span className={`status ${getStatusClass(container.status)}`}>
                  {container.status}
                </span>
              </td>
              <td>{container.location}</td>
              <td>{container.destination}</td>
              <td>
                <button
                  className="btn btn-update"
                  onClick={() => onUpdate(container.id, 'Доставлено')}
                >
                  Доставлено
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => onDelete(container.id)}
                >
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContainerList;
