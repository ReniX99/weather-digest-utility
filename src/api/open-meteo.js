process.loadEnvFile(".env")

function getTimeout() {
    const envTimeout = Number(process.env.REQUEST_TIMEOUT)
    if (!Number.isNaN(envTimeout)) {
        return envTimeout
    }
    return 5000
}

export async function getCoordinates(city) {
    const GEOCODING_API_URL = process.env.GEOCODING_API_URL
    if (!GEOCODING_API_URL) {
        console.error(
            "В переменных окружения на найден URL API для получения координат города",
        )
        process.exit(1)
    }

    const params = new URLSearchParams({
        name: city,
        count: 1,
        language: "ru",
        format: "json",
    })

    const timeout = getTimeout()

    const response = await fetch(`${GEOCODING_API_URL}?${params}`, {
        signal: AbortSignal.timeout(timeout),
    })
    const json = await response.json()

    const results = json["results"]
    if (!results) return

    const latitude = results[0]["latitude"]
    const longitude = results[0]["longitude"]

    const country = results[0]["country"]
    return { latitude, longitude, country }
}

export async function getForecast(latitude, longitude, days) {
    const FORECAST_API_URL = process.env.FORECAST_API_URL
    if (!FORECAST_API_URL) {
        console.error(
            "В переменных окружения на найден URL API для получения прогноза погоды",
        )
        process.exit(1)
    }

    const params = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
        forecast_days: days,
        timezone: "auto",
    })

    const timeout = getTimeout()

    const response = await fetch(`${FORECAST_API_URL}?${params}`, {
        signal: AbortSignal.timeout(timeout),
    })

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
