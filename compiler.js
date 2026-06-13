
const {open, writeFile} = require('node:fs/promises');

(async () => {

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
		const functionString = `(async (val) => {${matchesHandlers[i]}})(${thisValChangeValue[1]})`
		nlContents = nlContents.replace(thisValChange[1], functionString)
	})
	
	nl = nlContents.replace('module.exports = Newsletter', '').replace('<>','\\`').replace('</>','\\`')

	// TODO: confirm that it is required in destination file
	// TODO: prevent cyclical imports
	
	writtenFile = writtenFile.replace('!=', nl.toString())
	await writeFile('./prod.js', writtenFile)
})()
