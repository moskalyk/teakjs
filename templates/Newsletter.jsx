class Newsletter {
	constructor(){}
	
	valChange(val) {
		alert(val)
	}

	async view() {
		return <>
			<div>
                <input value='' onchange="this.valChange(this.value)" placeholder='email'></input>
			</div>
		</>
	} 
}

module.exports = Newsletter
