
import express from 'express';
import puppeteer from 'puppeteer';
import {load} from 'cheerio';
//import * as cheerio from 'cheerio';
import cors from 'cors';
import ColorThief from 'color-thief-node';


const app = express();
app.use(cors());
app.use(express.json()); 

app.post('/scrape', async (req, res) => {
    const { url } = req.body;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const html = await page.content();
        const $ = load(html);

        
        const title = $('title').text();
        const headlines = $('h1').map((i, element) => $(element).text()).get();

        const logo = $('img').filter((i, el) => $(el).attr('alt')?.toLowerCase().includes('logo')).attr('src');
        const screenshot = await page.screenshot();
        const topColors = await ColorThief.getPalette(screenshot, 3);

        const typography = await page.evaluate(() => {
            const heading = document.querySelector('h1');
            return window.getComputedStyle(heading)['font-family'];
        });
        
        const ctaStyles = await page.evaluate(() => {
            const button = document.querySelector('button, a.btn, a.button');
            return button ? {
                backgroundColor: window.getComputedStyle(button)['background-color'],
                textColor: window.getComputedStyle(button)['color'],
                borderRadius: window.getComputedStyle(button)['border-radius']
            } : {};
        });
        
        await browser.close();

        
        res.json({
            title,
            headlines,
            logo,
            topColors,
            typography,
            ctaStyles
        });

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
