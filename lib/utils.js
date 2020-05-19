const outdent = require('outdent');
const util = require('util');
const { promises: fs } = require('fs');

function showHelp() {
	console.log(outdent`
		Quick usage: deps "node file.js"
		Records and analyzes the dependency usage of a given command

		Commands:
		\`. deps-start\`     Start recording dependency usage
		\`. deps-stop\`      Stop recording dependency usage
		\`deps analyze\`     Analyze recorded data

		Options:
		--help, -h         [boolean] show help
		--version          [boolean] show version
		--output, -o       [string] target destination for JSON
		--verbose, -v      [boolean] verbose mode - Output as an object with specific files
	`);
}

function showVersion() {
	console.log(require('../package').version);
}

function outputResult(result, { output }) {
	if (output) {
		const resultStr = JSON.stringify(result, null, '  ');
		return fs.writeFile(output, resultStr);
	}

	return console.log(util.inspect(result, {
		colors: true,
		depth: null,
		maxArrayLength: null,
	}));
}

module.exports = {
	showHelp,
	showVersion,
	outputResult,
};
