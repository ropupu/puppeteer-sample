const puppeteer = require('puppeteer');
const chai = require('chai');
const assert = chai.assert;

require('dotenv').config({path: __dirname + '/.env'});

const Item = require('./PageObjects/Item');

let browser = null;
let page = null;
let item = null;
describe('Test Sample', function() {
    before(async function() {
        browser = await puppeteer.launch({args: ['--no-sandbox']});
        page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', interceptedRequest => {
            // add authorization header param when url includes BASE_URL
            if (interceptedRequest.url().includes(process.env.BASE_URL)) {
                let headers = interceptedRequest.headers();
                if (process.env.USER && process.env.PASSWORD) {
                    headers.authorization = `Basic ${new Buffer(`${process.env.USER}:${process.env.PASSWORD}`).toString('base64')}`;
                }
                interceptedRequest.continue({headers: headers});
            } else {
                interceptedRequest.continue();
            }
        });
        item = new Item(page);
    });
    after(async function() {
        await browser.close();
    });
    describe('detail page', function() {
        it('display a valid item name', function(done) {
            this.timeout(10000);
            (async () => {
                const itemName = await item.getDetailItemName();
                assert.equal(itemName, 'example item name');
                done();
            })();
        });
        it('move to order page', function(done) {
            this.timeout(10000);
            (async () => {
                const url = await item.pressAddCartButton();
                assert.equal(url, process.env.BASE_URL + '/item/order');
                done();
            })();
        })
    });
    describe('order page', function() {
        it ('fill out a comment form', function(done) {
            this.timeout(10000);
            (async () => {
                const comment = 'hello!hello!hello!';
                const input = await item.fillOutComment(comment);
                assert.equal(input, comment);
                done();
            })();
        });
        it('order', function(done) {
            this.timeout(10000);
            (async () => {
                const url = await item.pressOrderButton();
                assert.equal(url, process.env.BASE_URL + '/order/complete');
                done();
            })();
        });
    });
});
