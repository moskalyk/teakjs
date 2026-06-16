
const {open, writeFile} = require('node:fs/promises');

(async () => {
	
	// default index
	const file = await open('./templates/index.jsx')

	const fh1 = await file.stat([])
	const buf1 = Buffer.alloc(fh1.size);
	const buffer1 = await file.read(buf1, 0, fh1.size, 0)
	const homepageContents = buffer1.buffer.toString()

	const contents = (await file.read()).buffer.toString()
	const index = await open('./index.js');

	const fh = await index.stat([])
	const buf = Buffer.alloc(fh.size);
	const buffer = await index.read(buf, 0, fh.size, 0)
	const indexContents = buffer.buffer.toString()
	let writtenFile = indexContents.replace('#', homepageContents.toString()).replace('module.exports = IndexPage', '').replace('<>','\\`').replace('</>','\\`')
	
	let re = /(.+)\(\)\s{([^}]*)\}/g
	let matchesFuncs = [];
	let matches = [];
	let match;

	while ((match = re.exec(writtenFile)) !== null) {
		matchesFuncs.push(match[1]);
		matches.push(match[2]);
	}
	
	matchesFuncs = matchesFuncs.map((matches) => matches.replace('async ','').replace('\t', ''))

	matchesFuncs.slice(1,matchesFuncs.length-1).map((matchesFunc, i) => {
		let stringArray = writtenFile.indexOf('onclick="this.')
		let stringArrayEnd = writtenFile.indexOf(matchesFunc.trim() + '">')
		const functionString = `(async () => {${matches[i+1]}})()`
		writtenFile = writtenFile.replace(writtenFile.slice(stringArray+9, stringArrayEnd+matchesFunc.length), functionString)
	})
	

	writtenFile = writtenFile.replace("const Newsletter = require('./Newsletter')", '')
	
	let nl = await open('./templates/Newsletter.jsx')

	const fh2 = await nl.stat([])
	const buf2 = Buffer.alloc(fh2.size);
	const buffer2 = await nl.read(buf2, 0, fh2.size, 0)
	let nlContents = buffer2.buffer.toString()

	let rey = /(.+)\(.+\)\s{([^}]*)\}/g
	let matchesFuncsHandlers = [];
	let matchesHandlers = [];
	
	while ((match = rey.exec(nlContents)) !== null) {
		matchesFuncsHandlers.push(match[1]);
		matchesHandlers.push(match[2]);
	}
	
	matchesFuncsHandlers.map((matchesFunc, i) => {
		const reg = /onchange="(.+)"/
		const reg1 = /onchange=".+\((.+)\)"/
		const thisValChange = nlContents.match(reg)
		const thisValChangeValue = nlContents.match(reg1)
		const functionString = `(async (val, self) => {email = val;db.put('name', email);${matchesHandlers[i]}})(${thisValChangeValue[1]}, indexPage)`
		nlContents = nlContents.replace(thisValChange[1], functionString)
	})
	
	nl = nlContents.replace('module.exports = Newsletter', '').replace('<>','\\`').replace('</>','\\`')

	// TODO: confirm that it is required in destination file
	// TODO: prevent cyclical imports
	
	const dynamicsDecorators = /.*@dynamics\('(.+)'\).*/
	
	const dynamicsVar = nl.toString().match(dynamicsDecorators)
	console.log(dynamicsVar[1])
	
	const clickHandlers = `
		indexPage.addEventListener('something', (e) => {
		  document.getElementById('role').innerHTML = 'Master Chief, Versus Energy Innovations'
		});
		
		nl.addEventListener('dynamics', async (e) => {
			const secondContents = await nl.view(false)

			const main = contents.replaceAll('<Newsletter/>', secondContents)
			element.setHTMLUnsafe(main)
		})
	`

	// click handlers appends
	console.log(clickHandlers)
	writtenFile = writtenFile.replace('&)', clickHandlers)
	
	nl = nl.replace("@dynamics('email')", '')
	
	nl = nl.replaceAll('async view()', 'async view(onload)')
	nl = nl.replaceAll("await db.get('email')", "await db.get('email', onload)")
	nl = nl.replaceAll("{await db.get('email', onload)}", "\\{\\$\\{await db.get('name', onload)\\}\\}")
	writtenFile = writtenFile.replace('!=', nl.toString())

	const vfaasCode = `
	const vf = new VFAASNet({protocol: 'ws', host: '127.0.0.1', port: 8080})

	db = {
		get: async (key, onload) => {
			const update = (datum) => {
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
	};
	`
	
	writtenFile = writtenFile.replace('^&', vfaasCode.toString())
	await writeFile('./prod.js', writtenFile)
})()
