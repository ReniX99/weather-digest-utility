import { get_forecast_argv } from "./cli/forecast.js"
import { get_weather_digest } from "./services/forecast.js"

const { cities, days } = get_forecast_argv()
await get_weather_digest(cities, days)
