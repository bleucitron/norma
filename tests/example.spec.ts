import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

test('has title', async ({ page }) => {
	await page.goto('http://localhost:5173/');

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Norma/);
});

test('has events list', async ({ page }) => {
	await page.goto('http://localhost:5173/');

	// Expect a title "to contain" a substring.
	const list = page.locator('ul.events-list:not(.events-archived)');
	await expect(list).toBeVisible();

	const event = page.locator('ul.events-list:not(.events-archived) li.event');
	await expect(await event.count()).toBeGreaterThanOrEqual(1);
});

// body > div > main > ul:nth-child(2) > li:nth-child(2) > a > div > div > div:nth-child(1) > img
// On vérifie si il y a une SRC, si il y a une balise img, et si l'url correspond à ce qui est attendu -> Response 200
test('all events have images', async ({ page }) => {
	await page.goto('http://localhost:5173/');

	// const imgFromEventList = page.locator('.events-list:not(.events-archived) .event');
	for (const eventLocator of await page
		.locator('.events-list:not(.events-archived) .event')
		.all()) {
		const img = eventLocator.locator('img.event-img');
		await expect(img).toBeVisible();
		await expect(img).toHaveAttribute('src');
		const src = await img.getAttribute('src');

		//@ts-expect-error laisse moi tranquille :)
		const response = await page.request.get(src);
		expect(response.status()).toBe(200);
	}
});

// Vérifie le parcours d'inscription à un évenment jusqu'à la confirmation
test('register to an event', async ({ page }) => {
	await page.goto('http://localhost:5173/');

	// Cliquer sur la carte de l'événement infine
	const event = await page.getByText('Playwright inscription infinie');
	await event.click();
	await expect(page).toHaveURL('http://localhost:5173/events/playwright-inscription-infinie');

	// Cliquer sur le bouton "S'inscrire"
	const registerBtn = await page.getByText("S'inscrire");
	await registerBtn.click();
	await expect(page).toHaveURL(
		'http://localhost:5173/events/playwright-inscription-infinie/register'
	);

	// Remplir le formulaire (email, rôle et niveau) et cliquer sur "Poursuivre l'inscription"
	await page
		.getByLabel('Email')
		.fill('normatest-' + Math.random().toString(36).slice(2) + '@mail.test');
	await page.getByLabel('Votre rôle :').selectOption({ label: 'Leader' });
	await page.getByLabel('Votre niveau :').selectOption({ label: 'Expert' });
	const confirmBtn = await page.getByText("Poursuivre l'inscription");
	await confirmBtn.click();
	await expect(page).toHaveURL(
		'http://localhost:5173/events/playwright-inscription-infinie/commande'
	);

	// Remplir le formulaire helloasso et vérifier que l'utilsitaeur arrive bien sur la page de confirmation
});
