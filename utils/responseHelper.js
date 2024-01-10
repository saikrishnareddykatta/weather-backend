const currentWeatherResponse = (weatherResponse) => {
  const { lat, lon } = weatherResponse?.coord;
  const { id, icon, description } = weatherResponse?.weather[0];
  const weatherConditions = {
    id,
    icon,
    description,
    weatherType: weatherResponse?.weather[0]?.main,
  };
  const { main, visibility, wind, clouds, dt, sys, timezone, name } =
    weatherResponse;
  const { pressure, humidity } = main;
  const snowConditions = {
    lastOneHour: weatherResponse.snow ? weatherResponse.snow["1h"] : 0,
    lastThreeHour: weatherResponse.snow ? weatherResponse.snow["3h"] : 0,
  };
  const rainConditions = {
    lastOneHour: weatherResponse.rain ? weatherResponse.rain["1h"] : 0,
    lastThreeHour: weatherResponse.rain ? weatherResponse.rain["3h"] : 0,
  };
  const currentWeatherInfo = {
    temperature: main.temp,
    feelsLike: main.feels_like,
    minTemperature: main.temp_min,
    maxTemperature: main.temp_max,
    seaLevelPressure: main.sea_level,
    groundLevelPressure: main.grnd_level,
    pressure,
    humidity,
  };
  const { speed, gust } = wind;
  const windConditions = {
    speed,
    degree: wind?.deg,
    gust,
  };
  const cloudinessPercentage = clouds.all;
  const { country, sunrise, sunset } = sys;
  const timestamps = {
    UTC: dt,
    sunrise,
    sunset,
    timezoneShift: timezone,
  };
  const geographics = {
    country,
    cityName: name,
  };
  const currentWeather = {};
  currentWeather[dt] = {
    currentWeatherInfo,
    weatherConditions,
    cloudinessPercentage,
    windConditions,
    visibility,
    snowConditions,
    rainConditions,
  };
  const response = {
    latitude: lat,
    longitude: lon,
    geographics,
    timestamps,
    currentWeather,
  };
  return response;
};

const forecastWeatherResponse = (forecastResponse) => {
  const { name, country, coord, population, timezone, sunrise, sunset } =
    forecastResponse.city;
  const { lat, lon } = coord;
  const geographics = {
    cityName: name,
    country,
    population,
  };
  const timestamps = { sunrise, sunset, timezoneShift: timezone };
  const formattedData = {
    latitude: lat,
    longitude: lon,
    geographics,
    timestamps,
    forecastedWeather: {},
  };
  forecastResponse.list.forEach((item) => {
    const { main, dt, clouds, wind, visibility, pop, snow, rain, pod, dt_txt } =
      item;
    const { pressure, humidity } = main;
    const { id, icon, description } = item?.weather[0];
    const forecastWeather = {
      temperature: main.temp,
      feelsLike: main.feels_like,
      minTemperature: main.temp_min,
      maxTemperature: main.temp_max,
      seaLevelPressure: main.sea_level,
      groundLevelPressure: main.grnd_level,
      pressure,
      humidity,
    };
    const weatherConditions = {
      id,
      icon,
      description,
      weatherType: item?.weather[0]?.main,
    };
    const cloudinessPercentage = clouds.all;
    const { speed, gust } = wind;
    const windConditions = {
      speed,
      degree: wind?.deg,
      gust,
    };
    const snowConditions = {
      lastThreeHour: snow ? snow["3h"] : 0,
    };
    const rainConditions = {
      lastThreeHour: rain ? rain["3h"] : 0,
    };
    const response = {
      forecastWeather,
      weatherConditions,
      cloudinessPercentage,
      windConditions,
      visibility,
      probabilityOfPrecipitation: pop,
      snowConditions,
      rainConditions,
      partOfDay: pod,
      timestamp: {
        UTC: dt_txt,
      },
    };
    formattedData.forecastedWeather[dt] = response;
  });
  return formattedData;
};

const marineWeatherResponse = (marineResponse) => {
  const { latitude, longitude, elevation, current_units, current } =
    marineResponse;
  const currentMarineUnits = {
    time: current_units.time,
    interval: current_units.interval,
    waveHeight: current_units.wave_height,
    waveDirection: current_units.wave_direction,
    wavePeriod: current_units.wave_period,
    windWaveHeight: current_units.wind_wave_height,
    windWaveDirection: current_units.wind_wave_direction,
    windWavePeriod: current_units.wind_wave_period,
    windWavePeakPeriod: current_units.wind_wave_peak_period,
    swellWaveHeight: current_units.swell_wave_height,
    swellWaveDirection: current_units.swell_wave_direction,
    swellWavePeriod: current_units.swell_wave_period,
    swellWavePeakPeriod: current_units.swell_wave_peak_period,
  };
  const currentMarineWeather = {
    time: current.time,
    interval: current.interval,
    waveHeight: current.wave_height,
    waveDirection: current.wave_direction,
    wavePeriod: current.wave_period,
    windWaveHeight: current.wind_wave_height,
    windWaveDirection: current.wind_wave_direction,
    windWavePeriod: current.wind_wave_period,
    windWavePeakPeriod: current.wind_wave_peak_period,
    swellWaveHeight: current.swell_wave_height,
    swellWaveDirection: current.swell_wave_direction,
    swellWavePeriod: current.swell_wave_period,
    swellWavePeakPeriod: current.swell_wave_peak_period,
  };
  const response = {
    latitude,
    longitude,
    elevation,
    currentMarineUnits,
    currentMarineWeather,
  };
  return response;
};

module.exports = {
  currentWeatherResponse,
  forecastWeatherResponse,
  marineWeatherResponse,
};
