import outdent from 'outdent';
import util from 'util';
import * as fs from 'fs';
import * as t from './types';

const $writeFile = util.promisify(fs.writeFile);

export function showHelp(): void {
	const { version } = require('../package');

	console.log(outdent`
		deps ${version}

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

export async function outputResult(
	result: t.Result,
	{ output }: t.Options
): Promise<void> {
	if (output) {
		const resultStr = JSON.stringify(result, null, '  ');
		await $writeFile(output, resultStr);
		return;
	}

	return console.log(util.inspect(result, {
		colors: true,
		depth: null,
		maxArrayLength: null,
	}));
}
