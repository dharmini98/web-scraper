
import express from 'express';
import puppeteer from 'puppeteer';
import {load} from 'cheerio';
import cors from 'cors';
import {getPaletteFromURL} from 'color-thief-node';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

//const getPalette = ColorThief.getPalette;

const app = express();
app.use(cors());
app.use(express.json()); 

app.post('/scrape', async (req, res) => {
    const { url } = req.body;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        await Promise.all([
            page.waitForSelector('img[alt*="logo"]', {visible: true, timeout: 20000}).catch(e => console.error(e)),
            page.waitForSelector('svg[id*="logo"], svg[class*="logo"]', {visible: true, timeout: 20000}).catch(e => console.error(e)),
            page.waitForSelector('.svgContainer svg', { visible: true, timeout: 20000 }),

        ]).catch(e => {
            console.error('Logo did not load in time or was not found', e);
          });
        const html = await page.content();
        const $ = load(html);

        
        const title = $('title').text();
        const headlines = $('h1').map((i, element) => $(element).text()).get();

        let logo = $('img').filter((i, el) => $(el).attr('alt')?.toLowerCase().includes('logo')).attr('src');
    
        if (!logo) {
            const logoSvgElement = $('svg[id*="logo"], svg[class*="logo"]').first();
            if (logoSvgElement.length) {
                logo = $('<div>').append(logoSvgElement.clone()).html();
            } else {
                const logoSvgContainer = $('svg').closest('[id*="logo"], [class*="logo"]');
                if (logoSvgContainer.length) {
                    // Take only the SVG element, not the entire parent HTML
                    logo = $('<div>').append(logoSvgContainer.find('svg').first().clone()).html();
                }
            }
        }
    
        //colorpalette
        const __filename=fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const tempDir = path.join(__dirname, 'temp');

        fs.mkdirSync(tempDir, { recursive: true });

        const screenshotFileName = `screenshot-${uuidv4()}.png`;
        const screenshotPath = path.join(tempDir, screenshotFileName);

      try{
        await page.screenshot({ path: screenshotPath });

        const topColors = await getPaletteFromURL(screenshotPath, 3);

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

        
        res.json({
            title,
            headlines,
            logo,
            topColors,
            typography,
            ctaStyles
        });
      } catch(error)
      {
        console.error('Error during scraping:', error);
        res.status(500).send('An error during scraping');
      } finally
      {
         fs.unlink(screenshotPath, err => {
            if (err) console.error('Failed to delete screenshot:', err);
        });
        await browser.close();
      }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
