export const KYIV = { name: 'Kyiv, Ukraine', latitude: 50.4501, longitude: 30.5234 };

export async function fetchForecast(location, signal) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', location.latitude);
  url.searchParams.set('longitude', location.longitude);
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '5');

  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Weather request failed (${response.status}).`);
  const { daily } = await response.json();
  const requiredFields = ['time', 'weather_code', 'temperature_2m_max', 'temperature_2m_min'];
  if (!requiredFields.every((field) => Array.isArray(daily?.[field]) && daily[field].length >= 5)) {
    throw new Error('The weather service returned an incomplete forecast.');
  }

  return daily.time.slice(0, 5).map((date, index) => {
    const code = daily.weather_code[index];
    const high = daily.temperature_2m_max[index];
    const low = daily.temperature_2m_min[index];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || ![code, high, low].every(Number.isFinite)) {
      throw new Error('The weather service returned invalid weather data.');
    }
    return {
      date, code, high, low,
      rain: daily.precipitation_probability_max?.[index],
      wind: daily.wind_speed_10m_max?.[index],
    };
  });
}

// Open-Meteo returns WMO weather codes, which we turn into text and an icon.
export function describeWeather(code) {
  if (code === 0) return { label: 'Clear sky', icon: 'sun' };
  if (code === 1 || code === 2) return { label: 'Partly cloudy', icon: 'partly-cloudy' };
  if (code === 3) return { label: 'Overcast', icon: 'cloud' };
  if (code === 45 || code === 48) return { label: 'Foggy', icon: 'fog' };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Drizzle', icon: 'rain' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: 'Rain', icon: 'rain' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Snow', icon: 'snow' };
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', icon: 'storm' };
  return { label: 'Weather unavailable', icon: 'cloud' };
}
