import "dotenv/config";
import puppeteer from "puppeteer";
import {Scraper} from "./utils/scraper";
import {db} from "./db";
import * as TelegramBot from "node-telegram-bot-api";
import * as process from "node:process";

const bot = new TelegramBot(process.env.BOT_TOKEN as string);

(async () => {
    const baseUrl = process.env.AV_BY_URL as string

    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();

    const scraper = new Scraper(page);

    await scraper.goTo(baseUrl)

    const ids = await scraper.getIds()
    db.insertMany(ids)

    setInterval(async () => {
        await scraper.goTo(baseUrl)

        const ids = await scraper.getIds()
        const persistedIds = db.getAll()

        const newCars = ids.filter(id => !persistedIds.includes(id))

        if(newCars.length > 0 && newCars.length < 50){
            db.insertMany(newCars)

            newCars.map(async (carId) =>
                await bot.sendMessage("641926170", baseUrl+carId)
            )
        }
        else{
            console.log("no new cars(((")
        }
    }, 600000)
})()


