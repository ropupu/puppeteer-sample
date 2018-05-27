class Item {
    constructor (page) {
        this.page = page;
    }
    async detail () {
        const url = `${process.env.BASE_URL}/item`;
        return await this.page.goto(url, {waitUntil: 'networkidle0'});
    }
    async getDetailItemName() {
        let selector = '#main .content > h1';
        await this.detail();
        return await this.page.$eval(selector, (el) => {return el.innerText;});
    }
    async pressAddCartButton() {
        let selector = '#main .content > #cart_button';
        await this.detail();
        await this.page.evaluate("window.scrollTo(0, 500);");
        await this.page.waitForSelector(selector, {visible: true});
        await this.page.click(selector);
        return await this.page.url();
    }
    async fillOutComment(comment) {
        let selector = 'textarea';
        const textarea = await this.page.$(selector);
        await textarea.type(comment);
        return await this.page.$eval(selector, (el) => {
            return el.value;
        });
    }
    async pressOrderButton() {
        let selector = '#order';
        await this.page.click(selector);
        await this.page.waitFor(10000);
        return await this.page.url();
    }
}

module.exports = Item;
