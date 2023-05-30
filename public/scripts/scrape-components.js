// a web scraper that scrapes all components of the radix ui library
// it fetches all components under the url segment https://www.radix-ui.com/docs/primitives/components/[component-name]
// per component it fetches and saves the following data as json into the public/scripts/radix-components folder
// {
//   "name" // the content of this element /html/body/div[1]/div[2]/div/div[2]/div[1]/h1
//   "link" // the link of the page
//   "description" // the content of this element /html/body/div[1]/div[2]/div/div[2]/div[1]/p[1]
// }

const { chromium } = require('playwright');
const fs = require('fs').promises;

const baseUrl = 'https://www.radix-ui.com/docs/primitives/components';
const components = [
	'accordion',
	'alert-dialog',
	'aspect-ratio',
	'avatar',
	'checkbox',
	'collapsible',
	'context-menu',
	'dialog',
	'dropdown-menu',
	'form',
	'hover-card',
	'menubar',
	'navigation-menu',
	'popover',
	'progress',
	'radio-group',
	'scroll-area  ',
	'select',
	'separator',
	'slider',
	'switch',
	'tabs',
	'toast',
	'toggle',
	'toggle-group',
	'toolbar',
	'tooltip',
];

(async () => {
	const browser = await chromium.launch();
	const context = await browser.newContext();
	const page = await context.newPage();

	for (const component of components) {
		const url = `${baseUrl}/${component}`;
		try {
			await page.goto(url);
			const name = await page.$eval('h1', (el) => el.textContent);
			const descriptionElement = await page.$(
				'.c-MVuEH.c-MVuEH-cNGvkq-size-5.c-MVuEH-czEtpN-variant-contrast.c-MVuEH-bJheoJ-size-6.c-MVuEH-ijJqMFA-css'
			);
			const description = await page.evaluate(
				(descriptionElement) => descriptionElement.textContent,
				descriptionElement
			);
			const link = await page.url();
			const data = { name, description, link };
			await fs.writeFile(
				`public/scripts/radix-components/${component}.json`,
				JSON.stringify(data)
			);
			console.log(`scraped ${url}`);
		} catch (error) {
			console.error(`Error scraping ${url}: ${error.message}`);
		}
	}

	console.log('finished scraping');
	await browser.close();
})();
