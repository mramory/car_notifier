import { Page} from "puppeteer";

class Scraper {
    page: Page

    constructor(page: Page) {
        this.page = page
    }

    async goTo(url: string) {
        await this.page.goto(url);

        await this.page.setViewport({width: 1080, height: 1024});
    }

    async waitForLoad() {
        await this.page.waitForSelector(".paging__button > a:not([aria-disabled=\"true\"])")
    }

    async wait(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    async count() {
        await this.page.waitForSelector('.filter__show-result')
        const element = await this.page.$('.filter__show-result')
        const text = await this.page.evaluate((el) => el?.textContent, element)

        return text?.split(" ")[1]
    }

    async loadAllCars() {
        const count = await this.count()
        for(let i = 1; i < Math.ceil(Number(count)/25); i++){
            await this.waitForLoad()
            await this.page.locator(".paging__button").click()
        }
    }

    async getIds() {
        await this.loadAllCars()
        await this.wait(5000)
        return await this.page.$$eval(".listing-item__link", link => {
            const href = link.map(link => link.getAttribute("href") as string)
            return href.map(href => href.split("/")[3])
        })
    }
}

export {Scraper}