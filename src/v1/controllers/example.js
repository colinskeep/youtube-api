const puppeteer = require('puppeteer');
require('dotenv').config();

/**
 * Function to execute when endpoint reached
 * @param {string} req - incoming request
 * @param {string} res - outgoing response
 */
async function youtube(req, res) {
  const link = req.body.link;
  const arr2 = req.body.logins;
  const options = req.body.radio;
  const time = req.body.time;
  const headless = (req.body.headless == 'true');
  const like = (options == 'Like') ? "#top-level-buttons > ytd-toggle-button-renderer:nth-child(1) > a" : "#top-level-buttons > ytd-toggle-button-renderer:nth-child(2) > a";
  res.send('started');
  for (let z = 0; z < arr2.length; z++) {
    try {
      const browser = await puppeteer.launch({
        headless: headless,
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        //'args': ['--incognito'],
      });
      //const context = await browser.createIncognitoBrowserContext();
      const page = await browser.newPage();
      await page.waitFor(time);
      await page.goto('https://accounts.google.com/signin/v2/identifier?hl=en&continue=https%3A%2F%2Fwww.google.com%2F&flowName=GlifWebSignIn&flowEntry=AddSession');
      await page.waitFor(time);
      await page.type('.whsOnd.zHQkBf', arr2[z].email.replace(' ', ''));
      await page.click('div[id="identifierNext"]');
      await page.waitFor(time);
      await page.type('.whsOnd.zHQkBf', arr2[z].password.replace(' '), '');
      await page.click('div[id="passwordNext"]');
      await page.waitFor(time);
      if (page.url().indexOf('https://accounts.google.com/signin/v2/sl/pwd') > -1 && page.evaluate(() => document.querySelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > content > section > div > content > div.Xk3mYe.VxoKGd.Jj6Lae > div.xgOPLd > div:nth-child(2) > content').innerText == 'Wrong password. Try again or click Forgot password to reset it.')) {
        console.log('invalid password for email: ', arr2[z].email);
        continue;
      }
      console.log(page.url().indexOf('https://accounts.google.com/signin/v2/challenge/'));
      console.log(page.url());
      if (page.url().indexOf('https://accounts.google.com/signin/v2/challenge/') > -1) {
        console.log('verification needed');
        if (await page.$('div[class="vdE7Oc"]') !== null) {
          await page.click('div[class="vdE7Oc"]');
          await page.waitFor(time);
          await page.type('.whsOnd.zHQkBf', process.env.USER_RECOVERY_EMAIL);
          await page.waitFor(time);
          if (await page.$('div[class="ZFr60d CeoRYc"]') !== null) {
            await page.click('div[class="ZFr60d CeoRYc"]');
          }
          await page.waitFor(time);
          if (page.url().indexOf('https://www.google.com') < 0) {
            if (await page.$('div[class="ZFr60d CeoRYc"]') !== null) {
              await page.click('div[class="ZFr60d CeoRYc"]');
            }
          }
          await page.waitFor(time);
          if (page.url().indexOf('https://accounts.google.com/signin/v2/challenge/') > -1) {
            console.log('unable to authenticate: ', arr[z].email, 'with recovery email');
            continue;
          }
        }
      }
      await page.waitFor(time);
      console.log('logged in: ', arr2[z].email);
      await page.goto('https://www.youtube.com/channel_switcher');
      console.log('checking brand accounts.....');
      if (await page.$('#identity-prompt-lb > div > div') !== null) {
        await page.waitFor(time);
        console.log('selecting user');
        await page.click('#identity-prompt-account-list > ul > label:nth-child(1) > li > span > span.yt-uix-form-input-radio-container > input')
        await page.click('#identity-prompt-confirm-button > span')
      }
      await page.waitFor(time);
      const hrefs = await page.$$eval('a', as => as.map(a => a.href));
      let arr = [];
      arr.push('https://www.youtube.com/signin?feature=channel_switcher&next=%2F&authuser=0&action_handle_signin=true&skip_identity_prompt=True');
      for (let i = 0; i < hrefs.length; i++) {
        if (hrefs[i].indexOf('pageid') > -1) {
          arr.push(hrefs[i]);
        }
        if (i == hrefs.length - 1) {
          console.log('found ', arr.length, 'main + brand accounts for', arr2[z].email);
          if (arr.length == 0 ) {
            await page.waitFor(time);
            await page.goto(link);
            await page.waitFor(time);
            await page.evaluate(function(like) {
              if (document.querySelector(like).innerHTML.indexOf('aria-pressed="true"') == -1 ) {
                console.log('added input');
                document.querySelector(like).click();
              }
            }, like)
            await browser.close();
          } else {
            for (let x = 0; x < arr.length; x++) {
              console.log('attempting brand #', x)
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
                if (document.querySelector(like) && document.querySelector(like).innerHTML.indexOf('aria-pressed="true"') == -1 ) {
                  document.querySelector(like).click();
                } else (console.log("not found"));
              }, like);
              if (x == arr.length - 1) {
                await browser.close();
              }
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      continue;
    }
  }
}
module.exports = {
  youtube,
};
