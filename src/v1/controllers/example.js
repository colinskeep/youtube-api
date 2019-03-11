const puppeteer = require('puppeteer');
require('dotenv').config();

/**
 * Function to execute when endpoint reached
 * @param {string} req - incoming request
 * @param {string} res - outgoing response
 */
async function youtube(req, res) {
  console.log(req.body)
  const link = req.body.link;
  const arr2 = req.body.logins;
  const options = req.body.radio;
  const time = req.body.time;
  const headless = req.body.headless;
  const like = (options == 'Like') ? "a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer" : "#top-level-buttons > ytd-toggle-button-renderer:nth-child(2) > a";
  res.send('started');
  try {
    for (let z = 0; z < arr2.length; z++) {
      const browser = await puppeteer.launch({
        headless: headless,
        'args': ['--incognito'],
      });
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      await page.goto('https://accounts.google.com/signin/v2/identifier?hl=en&continue=https%3A%2F%2Fwww.google.com%2F&flowName=GlifWebSignIn&flowEntry=AddSession');
      await page.type('.whsOnd.zHQkBf', arr2[z].email);
      await page.click('div[id="identifierNext"]');
      await page.waitFor(time);
      await page.type('.whsOnd.zHQkBf', arr2[z].password);
      await page.click('div[id="passwordNext"]');
      await page.waitFor(time);
      if (page.url().indexOf('https://accounts.google.com/signin/v2/challenge/') > -1) {
        console.log('verification needed');
        await page.click('div[class="vdE7Oc"]');
        await page.waitFor(time);
        await page.type('.whsOnd.zHQkBf', process.env.USER_RECOVERY_EMAIL);
        await page.click('div[class="ZFr60d CeoRYc"]');
        await page.waitFor(time);
        await page.click('div[class="ZFr60d CeoRYc"]');
      }
      console.log('logged in: ', arr2[z].email)
      await page.goto('https://www.youtube.com/channel_switcher');
      console.log('checking brand accounts.....')
      await page.waitFor(time);
      const hrefs = await page.$$eval('a', as => as.map(a => a.href));
      let arr = [];
      for (let i = 0; i < hrefs.length; i++) {
        if (hrefs[i].indexOf('pageid') > -1) {
          arr.push(hrefs[i]);
        }
        if (i == hrefs.length - 1) {
          console.log('found ', arr.length, 'brand accounts for', arr2[z].email);
          if (arr.length == 0 ) {
            await page.waitFor(time);
            await page.goto(link);
            await page.waitFor(time);
            await page.evaluate(function(like) {
              console.log('1st block', like);
              if (document.querySelector(like).innerHTML.indexOf('aria-pressed="true"') == -1 ) {
                document.querySelector(like).click()
              }
            }, like)
            await browser.close();
          } else {for (let x = 0; x < arr.length; x++) {
            await page.goto(arr[x]);
            await page.waitFor(time);
            if (page.url().indexOf('https://accounts.google.com/signin/v2/') > -1) {
              await page.waitFor(time);
              await page.type('.whsOnd.zHQkBf', arr2[z].password);
              await page.click('div[id="passwordNext"]');
            }
            await page.waitFor(time);
            await page.goto(link)
            await page.waitFor(time);
            await page.evaluate(function(like) {
              if (document.querySelector(like).innerHTML.indexOf('aria-pressed="true"') == -1 ) {
                document.querySelector(like).click()
              }
              else (console.log("not found"))
            }, like);
            if (x == arr.length - 1) {
              await context.close();
            }
          }
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}
module.exports = {
  youtube,
};
