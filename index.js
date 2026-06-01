function runner() {
	eval(`#
	(async () => {
		const indexPage = new IndexPage()
		const contents = await indexPage.view()
		const element = document.getElementById('anchor');
		const main = contents
		element.setHTMLUnsafe(main)
	})();
`)
};

(async () => {
  await runner();
})()
