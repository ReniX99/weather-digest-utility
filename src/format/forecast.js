export function getReport(cities) {
    cities.forEach((c) => {
        const city = c.city
        const country = c.country
        const latitude = c.latitude
        const longitude = c.longitude

        const dates = c.dates
        console.log(
            `Город: ${city}\nСтрана: ${country}\nШирота: ${latitude}\nДолгота: ${longitude}\n\nПрогноз:`,
        )

        const tableDates = dates.map((d) => ({
            Дата: d.date,
            "Мин. температура": d.minTemperature,
            "Макс. температура": d.maxTemperature,
            "Суммарные осадки": d.precipitationSum,
        }))
        console.table(tableDates)
        console.log("\n")
    })
}
