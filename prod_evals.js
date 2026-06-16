	let indexPage;
	let nl;
	let db;

function runner() {
	eval(`

// dynamics
const vf = new VFAASNet({protocol: 'ws', host: '127.0.0.1', port: 8080})

db = {
		get: async (key, onload) => {
			const update = (datum) => {
					console.log('recv')
					console.log(datum)
					nl.dispatchEvent(new Event('dynamics'))

					res(datum.msg.value)
			}
			vf.aPath(update)
			

			
			vf.aBoot(({boot}) => {
			   vf.webSocket.send('client', JSON.stringify({status: 204, msg: 'msg send'}))
			})

			const promise = (update) => {

				return new Promise((res, rej) => {
					const update = (datum) => {
							console.log('recv')
							console.log(datum)
							nl.dispatchEvent(new Event('dynamics'))
												nl.dispatchEvent(new Event('something'))

							res(datum.msg.value)
					}			
					
					vf.aPath(update)

				})
			}
		
			if(onload) {
				return 0
			}else {

				return await promise(update)
			}
		},
		put: async (key, value) => {
			vf.webSocket.send('update', JSON.stringify({status: 170, msg: {key: key, value: value}}))
		}
	}
class IndexPage extends EventTarget {
	constructor(){
	super()
		self = this
	}
	
	clckVal() {
		document.getElementById('role').value = 'Master Chief'
	}
	
	async clck() {

	}
	
	object() {
		return this
	}
	
	async view() {
		let self = this
		return \`
			<div>
                <p>fe hell gone (^if -you *want)</p>
                <Newsletter/>
                <p id='role'>MC</p>
                <button onclick="this.clckVal">clck w/ val</button>
                <button onclick="this.clckLstnr">clck w/ lstnr</button>
			</div>
		\`
	} 
}


// dynamics
let email = null

class Newsletter extends EventTarget {
	email
	constructor(){super()
	}
	
	valChange(val) {
		alert(val)
	}

	async view(onload) {
		return \`
			<div>
                <input id='email' value='' onchange="(async (val) => {
                email = val
	})(this.value)" placeholder='email'></input>
                <br/>
                <br/>
                <button onclick="(async (self) => {
                	db.put('name', email);				
                	self.dispatchEvent(new Event('something'));	
                })(indexPage)">clck</button>
                <!-- dynamics -->
			    \{\$\{await db.get('name', onload)\}\}
			</div>
		\`
	} 
}



	(async () => {
		indexPage = new IndexPage()
		nl = new Newsletter()
		const contents = await indexPage.view()
		const secondContents = await nl.view(true)
		const element = document.getElementById('anchor');
		const main = contents.replaceAll('<Newsletter/>', secondContents)
		element.setHTMLUnsafe(main)
		
		
		// dynamics
		indexPage.addEventListener('something', (e) => {
		  document.getElementById('role').innerHTML = 'Master Chief'
		});
		
		nl.addEventListener('dynamics', async (e) => {
			const secondContents = await nl.view(false)

			const main = contents.replaceAll('<Newsletter/>', secondContents)
			element.setHTMLUnsafe(main)
			document.getElementById('email').value = 'build@deep6.org'
			indexPage.dispatchEvent(new Event('something'))
		})
	
	})();
`)
};

(async () => {
  await runner();
  
  // setTimeout(()=> {
		// 				document.getElementById('role').innerHTML = 'Master Chief'
		// 		console.log(document.getElementById('role'))

			// }, 3000)
})()
