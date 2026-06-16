let indexPage;
let nl;
let db;

function runner() {
	eval(`
	let email;

	#
	
	!=

	^&
	
	(async () => {
		indexPage = new IndexPage()
		nl = new Newsletter()
		const contents = await indexPage.view()
		const secondContents = await nl.view(true)
		const element = document.getElementById('anchor');
		const main = contents.replaceAll('<Newsletter/>', secondContents)
		element.setHTMLUnsafe(main)

		&)
	})();
`)
};

(async () => {
  await runner();
})()
