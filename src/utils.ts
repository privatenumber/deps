import outdent from 'outdent'; // eslint-disable-line import/no-named-as-default
import util from 'util';
import * as fs from 'fs';
import * as t from './types';

const $writeFile = util.promisify(fs.writeFile);

export function showHelp(): void {
	const {version} = require('../package'); // eslint-disable-line @typescript-eslint/no-var-requires

	console.log(outdent`
		deps ${version} - analyze used/unused package dependencies

		Quick usage:
		  $ deps <...command>    Record and analyze the dependency usage of a command

		  Example:
		    $ deps "node file.js"

		Recording session:
		  $ . deps-start         Start dependency usage recording session
		  $ deps analyze         Analyze recorded data during an active session
		  $ . deps-stop          Stop dependency usage recording session

		Options:
		  --help, -h            [boolean] show help
		  --version             [boolean] show version
		  --output, -o          [string] target destination for JSON
		  --verbose, -v         [boolean] verbose mode - Output as an object with specific files
	`);
}

export async function outputResult(
	result: t.Result,
	{output}: t.Options,
): Promise<void> {
	if (output) {
		const resultString = JSON.stringify(result, null, '  ');
		await $writeFile(output, resultString);
		return;
	}

	return console.log(util.inspect(result, {
		colors: true,
		depth: null,
		maxArrayLength: null,
	}));
}
