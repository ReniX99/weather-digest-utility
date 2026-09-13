import { get_coordinates, get_forecast } from "../api/open-meteo.js"
import { get_report } from "../format/forecast.js"

export async function get_weather_digest(cities, days) {
    const pipeline = async (city, days) => {
        const { latitude, longitude, country } = await get_coordinates(city)
        const { dates, minTemperatures, maxTemperatures, precipitationSums } =
            await get_forecast(latitude, longitude, days)

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

    const result_forecasts = forecasts.map((forecast, index) => ({
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

    get_report(result_forecasts)
}
