const Newsletter = require('./Newsletter')

class IndexPage {
	constructor(){}
	
	async clck() {
		const wait = (ms) => new Promise((res) => setTimeout(res, ms))
		await wait(1000)
		alert('clicked')
	}
	
	clckVal() {
		alert('db call TODO')
	}

	async view() {
		return <>
			<div>
                <p>fe hell gone (^if -you *want)</p>
                <Newsletter/>
                <button onclick="this.clck">clck</button>
                <button onclick="this.clckVal">clck w/ val</button>
			</div>
		</>
	} 
}

module.exports = IndexPage
