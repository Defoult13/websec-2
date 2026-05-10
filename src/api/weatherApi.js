const TOKEN = import.meta.env.VITE_EOL_TOKEN;

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

async function getWeatherForDate(city, date) {
  const url =
    `/eol-api/api/weather/` +
    `?lat=${city.lat}` +
    `&lon=${city.lon}` +
    `&date=${date}` +
    `&token=${TOKEN}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.log('Ответ сервера:', errorText);
    throw new Error(`Ошибка API: ${response.status}`);
  }

  return await response.json();
}

export async function getWeatherForecast(city) {
  if (!TOKEN) {
    throw new Error('Не указан токен Project EOL в .env');
  }

  const requests = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    requests.push(getWeatherForDate(city, formatDate(date)));
  }

  const results = await Promise.all(requests);

  return results.flat();
}