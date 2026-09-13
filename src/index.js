import { getForecastArgv } from "./cli/forecast.js"
import { getWeatherDigest } from "./services/forecast.js"

const { cities, days } = getForecastArgv()
await getWeatherDigest(cities, days)
