self.addEventListener('fetch', (event) => {
	event.respondWith(
		fetch(event.request).then((response) => {
			console.log(event.request, response);
			return response;
		})
	);
});
// console.log(event);
// event.respondWith(false);
// console.log('test');
