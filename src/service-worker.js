self.addEventListener('fetch', (event) => {
	console.log(event);
	event.respondWith(false);
	console.log('test');
});
