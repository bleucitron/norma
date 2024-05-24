import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

function delay(time = 2000) {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
}

dotenv.config({ path: path.resolve('.env.test') });
const supabase = createClient(
	process.env.PUBLIC_SUPABASE_URL,
	process.env.PUBLIC_SUPABASE_ANON_KEY
);

test.afterEach(async () => {
	await supabase.from('dancers').delete().eq('event', 'playwright-inscription-infinie');
});

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

	// Cliquer sur la carte de l'événement "STRICTLY"
	const event = await page.getByText('STRICTLY');
	await event.click();
	await expect(page).toHaveURL('http://localhost:5173/events/strictly');

	// Cliquer sur le bouton "S'inscrire"
	const registerBtn = await page.getByText("S'inscrire");
	await registerBtn.click();
	await expect(page).toHaveURL('http://localhost:5173/events/strictly/register');
});
