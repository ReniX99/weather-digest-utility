export async function get_coordinates(city) {
    const params = new URLSearchParams({
        name: city,
        count: 1,
        language: "ru",
        format: "json",
    })

    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?${params}`,
    )
    const json = await response.json()

    const results = json["results"]
    if (!results) return

    const latitude = results[0]["latitude"]
    const longitude = results[0]["longitude"]

    const country = results[0]["country"]
    return { latitude, longitude, country }
}

export async function get_forecast(latitude, longitude, days) {
    const params = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
        forecast_days: days,
        timezone: "auto",
    })

    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?${params}`,
    )

    const json = await response.json()
    const daily = json["daily"]

    if (!daily) {
        console.error()
    }

    const dates = daily["time"]
    const minTemperatures = daily["temperature_2m_min"]
    const maxTemperatures = daily["temperature_2m_max"]
    const precipitationSums = daily["precipitation_sum"]

    return {
        dates,
        minTemperatures,
        maxTemperatures,
        precipitationSums,
    }
}
