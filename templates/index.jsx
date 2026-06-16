const Newsletter = require('./Newsletter')

class IndexPage extends EventTarget {
	constructor(){
		super()
	}
	
	clckVal() {
		document.getElementById('role').value = 'Master Chief'
		alert('db call TODO')
	}
	
	async clck() {

	}
	
	async view() {
		return <>
			<div>
                <p>fe hell gone (^if -you *want)</p>
                <Newsletter/>
                <br/>
                <p id='role'>MC</p>
                <button onclick="this.clckVal">clck w/ val</button>
                <button onclick="this.clckLstnr">clck w/ lstnr</button>
			</div>
		</>
	} 
}

module.exports = IndexPage
