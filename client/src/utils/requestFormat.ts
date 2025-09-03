export default function requestFormat(data: any) {
  const { at, time, service, master, ...rest } = data;

  // Проверяем и нормализуем дату
  let dateOnly = at;
  if (at.includes('T')) {
    dateOnly = at.split('T')[0]; // Получаем только дату "2025-09-02"
  }
  
  // Проверяем формат даты
  if (!dateOnly.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new Error(`Invalid date format: ${dateOnly}. Expected format: YYYY-MM-DD`);
  }
  
  // Создаем объект Date из строки даты (только дата, без времени)
  const dateObj = new Date(dateOnly + 'T00:00:00'); // Устанавливаем начало дня в локальном времени
  // Проверяем, что дата валидна
  if (isNaN(dateObj.getTime())) {
    throw new Error(`Invalid date: ${dateOnly}`);
  }
  
  // Парсим время из строки формата "HH:MM AM/PM"
  const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!timeMatch) {
    throw new Error(`Invalid time format: ${time}. Expected format: "HH:MM AM/PM"`);
  }
  
  let hours = parseInt(timeMatch[1], 10);
  const minutes = parseInt(timeMatch[2], 10);
  const ampm = timeMatch[3].toUpperCase();
  
  // Конвертируем в 24-часовой формат
  if (ampm === 'PM' && hours !== 12) {
    hours += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }
  
  // Устанавливаем время в объект даты (в локальном времени)
  dateObj.setHours(hours, minutes, 0, 0);

  // Убираем поле time из результата, так как сервер его не ожидает
  const { time: _, ...dataWithoutTime } = rest;

  return {
    ...dataWithoutTime,
    at: dateObj.toISOString(),
    serviceId: service, // Переименовываем service в serviceId
    masterId: master,   // Переименовываем master в masterId
  };
}