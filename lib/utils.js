const outdent = require('outdent');

function showHelp() {
	console.log(outdent`
		Quick usage: deps -o output.json "node file.js"

		--help, -h         [boolean] show help
		--version          [boolean] show version
		--output, -o       [string] target destination for JSON
		--unused, -u       [boolean] include unused package.json dependencies
		--verbose, -v      [boolean] verbose mode - Output as an object with specific files
	`)
}

function showVersion() {
	console.log(require('../package').version);
}

module.exports = {
	showHelp,
	showVersion,
};
