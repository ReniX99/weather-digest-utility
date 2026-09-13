import { getCoordinates, getForecast } from "../api/open-meteo.js"
import { getReport } from "../format/forecast.js"
import { checkCache } from "../storage/cache.js"
import { writeReport } from "../storage/report.js"

export async function getWeatherDigest(cities, days) {
    const pipeline = async (city, days) => {
        const cacheData = await checkCache(city, days)
        if (cacheData) {
            return {
                country: cacheData.country,
                latitude: cacheData.latitude,
                longitude: cacheData.longitude,
                dates: cacheData.dates.map((date) => date.date),
                minTemperatures: cacheData.dates.map(
                    (date) => date.minTemperature,
                ),
                maxTemperatures: cacheData.dates.map(
                    (date) => date.maxTemperature,
                ),
                precipitationSums: cacheData.dates.map(
                    (date) => date.precipitationSum,
                ),
            }
        }

        const { latitude, longitude, country } = await getCoordinates(city)
        const { dates, minTemperatures, maxTemperatures, precipitationSums } =
            await getForecast(latitude, longitude, days)

        return {
            country,
            latitude,
            longitude,
            dates,
            minTemperatures,
            maxTemperatures,
            precipitationSums,
        }
    }

    const forecasts = await Promise.all(
        cities.map((city) => pipeline(city, days)),
    )

    const processedForecasts = forecasts.map((forecast, index) => ({
        city: cities[index],
        country: forecast.country,
        latitude: forecast.latitude,
        longitude: forecast.longitude,
        dates: forecast.dates.map((date, index) => ({
            date: date,
            minTemperature: forecast.minTemperatures[index],
            maxTemperature: forecast.maxTemperatures[index],
            precipitationSum: forecast.precipitationSums[index],
        })),
    }))

    getReport(processedForecasts)
    await writeReport(processedForecasts)
}
