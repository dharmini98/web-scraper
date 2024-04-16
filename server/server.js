
import express from 'express';
import puppeteer from 'puppeteer';
import {load} from 'cheerio';
//import * as cheerio from 'cheerio';
import cors from 'cors';

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

        await browser.close();

        
        res.json({
            title,
            headlines
        });

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
