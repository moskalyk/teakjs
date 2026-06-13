function runner() {
	eval(`#
	
	!=
	(async () => {
		const indexPage = new IndexPage()
		const nl = new Newsletter()
		const contents = await indexPage.view()
		const secondContents = await nl.view()
		const element = document.getElementById('anchor');
		const main = contents.replaceAll('<Newsletter/>', secondContents)
		element.setHTMLUnsafe(main)
	})();
`)
};

(async () => {
  await runner();
})()
