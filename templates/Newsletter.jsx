class Newsletter extends EventTarget {
	constructor(){
		super()
	}
	
	valChange(val) {
		alert(val)
		
	}

	@dynamics('email')
	async view() {
		return <>
			<div>
                <input value='' onchange="this.valChange(this.value)" placeholder='email'></input>
                <button onclick="this.clck">clck</button>
                {await db.get('email')}
			</div>
		</>
	} 
}

module.exports = Newsletter
