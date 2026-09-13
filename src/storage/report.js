import path from "path"
import { mkdir, writeFile } from "fs/promises"

export async function write_report(cities) {
    cities.forEach(async (city) => {
        const cityName = city.city
        const date = city.dates[0].date
        const reportName = `${cityName}-${date}.json`

        const dir = path.join(process.cwd(), "reports")
        const filePath = path.join(dir, reportName)

        await mkdir(dir, { recursive: true })

        await writeFile(filePath, JSON.stringify(city, null, 2), "utf-8")
    })
}
