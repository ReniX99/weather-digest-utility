import { readFile } from "fs/promises"
import path from "path"
import { checkNoCacheFlag } from "../cli/forecast.js"

export async function checkCache(city) {
    if (checkNoCacheFlag()) return null

    const date = new Date().toISOString().split("T")[0]
    const reportName = `${city}-${date}.json`

    const filePath = path.join(process.cwd(), "reports", reportName)
    try {
        const content = await readFile(filePath, "utf-8")
        const data = JSON.parse(content)

        return data
    } catch {
        return null
    }
}
