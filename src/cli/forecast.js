export function get_forecast_argv() {
    const args = process.argv.slice(2)

    const cityIndex = args.indexOf("--city")
    if (cityIndex === -1 || !args[cityIndex + 1]) {
        console.error("Аргумент --city обязателен")
        process.exit(1)
    }

    const cities = args[cityIndex + 1].split(",").map((city) => city.trim())

    const daysIndex = args.indexOf("--days")

    let days = 3
    if (daysIndex !== -1 && args[daysIndex + 1]) {
        const argv_days = args[daysIndex + 1]
        days = Number(argv_days)

        if (Number.isNaN(days)) {
            console.error("Аргумент --days не является числом")
            process.exit(1)
        } else if (days < 1 || days > 7) {
            console.error("Допустимый диапозон --days - от 1 до 7")
            process.exit(1)
        }
    }

    return { cities, days }
}
