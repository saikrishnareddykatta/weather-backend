const cityDetailsResponse = (data) => {
  const cityComponents = data.components;
  const latitude = data.geometry.lat;
  const longitude = data.geometry.lng;
  const geographics = {
    cityName: data.components.city,
    country: data.components.country,
  };
  const locationComponents = {
    type: cityComponents._type,
    city: cityComponents.city,
    county: cityComponents.county,
    state: cityComponents.state,
    stateCode: cityComponents.state_code,
    country: cityComponents.country,
    countryCode: cityComponents.country_code,
  };
  const response = {
    latitude,
    longitude,
    geographics,
    locationComponents,
    formattedLocation: data.formatted,
  };
  return response;
};

const currentWeatherResponse = (
  weatherResponse,
  timezoneResponse,
  cityComponents,
  formatted
) => {
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
  const timezoneData = {
    name: timezoneResponse.name,
    nowInDST: timezoneResponse.now_in_dst,
    offsetSec: timezoneResponse.offset_sec,
    offsetString: timezoneResponse.offset_string,
    shortName: timezoneResponse.short_name,
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
  const locationComponents = {
    type: cityComponents._type,
    city: cityComponents.city,
    county: cityComponents.county,
    state: cityComponents.state,
    stateCode: cityComponents.state_code,
    country: cityComponents.country,
    countryCode: cityComponents.country_code,
  };
  const response = {
    latitude: lat,
    longitude: lon,
    geographics,
    timezone: timezoneData,
    locationComponents,
    formattedLocation: formatted,
    timestamps,
    currentWeather,
  };
  return response;
};

const forecastWeatherResponse = (
  forecastResponse,
  timezoneResponse,
  cityComponents,
  formatted
) => {
  const { name, country, coord, population, timezone, sunrise, sunset } =
    forecastResponse.city;
  const { lat, lon } = coord;
  const geographics = {
    cityName: name,
    country,
    population,
  };
  const timestamps = { sunrise, sunset, timezoneShift: timezone };
  const timezoneData = {
    name: timezoneResponse.name,
    nowInDST: timezoneResponse.now_in_dst,
    offsetSec: timezoneResponse.offset_sec,
    offsetString: timezoneResponse.offset_string,
    shortName: timezoneResponse.short_name,
  };
  const locationComponents = {
    type: cityComponents._type,
    city: cityComponents.city,
    county: cityComponents.county,
    state: cityComponents.state,
    stateCode: cityComponents.state_code,
    country: cityComponents.country,
    countryCode: cityComponents.country_code,
  };
  const formattedData = {
    latitude: lat,
    longitude: lon,
    geographics,
    timezone: timezoneData,
    locationComponents,
    formattedLocation: formatted,
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

const marineWeatherResponse = (
  marineResponse,
  timezoneResponse,
  cityComponents,
  formatted
) => {
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
  const timezone = {
    name: timezoneResponse.name,
    nowInDST: timezoneResponse.now_in_dst,
    offsetSec: timezoneResponse.offset_sec,
    offsetString: timezoneResponse.offset_string,
    shortName: timezoneResponse.short_name,
  };
  const locationComponents = {
    type: cityComponents._type,
    city: cityComponents.city,
    county: cityComponents.county,
    state: cityComponents.state,
    stateCode: cityComponents.state_code,
    country: cityComponents.country,
    countryCode: cityComponents.country_code,
  };
  const response = {
    latitude,
    longitude,
    elevation,
    timezone,
    locationComponents,
    formattedLocation: formatted,
    currentMarineUnits,
    currentMarineWeather,
  };
  return response;
};

const airQualityWeatherResponse = (
  aqResponse,
  timezoneResponse,
  cityComponents,
  formatted
) => {
  const { latitude, longitude, elevation, current_units, current } = aqResponse;
  const airQualityUnits = {
    time: current_units.time,
    interval: current_units.interval,
    europeanAQI: current_units.european_aqi,
    usAQI: current_units.us_aqi,
    carbonMonoxide: current_units.carbon_monoxide,
    nitrogenDioxide: current_units.nitrogen_dioxide,
    sulphurDioxide: current_units.sulphur_dioxide,
    ozone: current_units.ozone,
    dust: current_units.dust,
    uvIndex: current_units.uv_index,
    uvIndexClearSky: current_units.uv_index_clear_sky,
    ammonia: current_units.ammonia,
  };
  const airQualityWeather = {
    time: current.time,
    interval: current.interval,
    europeanAQI: current.european_aqi,
    usAQI: current.us_aqi,
    carbonMonoxide: current.carbon_monoxide,
    nitrogenDioxide: current.nitrogen_dioxide,
    sulphurDioxide: current.sulphur_dioxide,
    ozone: current.ozone,
    dust: current.dust,
    uvIndex: current.uv_index,
    uvIndexClearSky: current.uv_index_clear_sky,
    ammonia: current.ammonia,
  };
  const timezone = {
    name: timezoneResponse.name,
    nowInDST: timezoneResponse.now_in_dst,
    offsetSec: timezoneResponse.offset_sec,
    offsetString: timezoneResponse.offset_string,
    shortName: timezoneResponse.short_name,
  };
  const locationComponents = {
    type: cityComponents._type,
    city: cityComponents.city,
    county: cityComponents.county,
    state: cityComponents.state,
    stateCode: cityComponents.state_code,
    country: cityComponents.country,
    countryCode: cityComponents.country_code,
  };
  const response = {
    latitude,
    longitude,
    elevation,
    timezone,
    locationComponents,
    formattedLocation: formatted,
    airQualityUnits,
    airQualityWeather,
  };
  return response;
};

module.exports = {
  cityDetailsResponse,
  currentWeatherResponse,
  forecastWeatherResponse,
  marineWeatherResponse,
  airQualityWeatherResponse,
};
