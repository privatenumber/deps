import outdent from 'outdent'; // eslint-disable-line import/no-named-as-default
import chalk from 'chalk';
import util from 'util';
import * as fs from 'fs';
import * as t from './types';

const $writeFile = util.promisify(fs.writeFile);

export function showHelp(): void {
	const version: string = require('../package').version; // eslint-disable-line @typescript-eslint/no-var-requires

	console.log(outdent`

		${chalk.underline.bold(`deps ${version}`)}
		Analyze used/unused Node.js package dependencies

		⚡️ ${chalk.bold('Quick usage')}
		  ${chalk.green('$ deps <...command>')}    Record and analyze the dependency usage of a command

		  ${chalk.underline('Example:')}
		    ${chalk.green('$ deps "node file.js"')}

		🎥 ${chalk.bold('Recording session')}
		  ${chalk.green('$ . deps-start')}         Start dependency usage recording session
		  ${chalk.green('$ deps analyze')}         Analyze recorded data during an active session
		  ${chalk.green('$ . deps-stop')}          Stop dependency usage recording session

		  ${chalk.underline('Example:')}
		    1. Start recording: ${chalk.green('$ . deps-start')}     
		    2. Run some commands (eg. ${chalk.green('$ npm run build')})
		    3. Analyze dependency usage (eg. ${chalk.green('$ deps analyze')})
		    4. Stop recording (eg. ${chalk.green('$ . deps-stop')})

		⚙️ ${chalk.bold('Options')}
		  --help, -h             [boolean] show help
		  --version              [boolean] show version
		  --output, -o           [string] target destination for JSON
		  --verbose, -v          [boolean] verbose mode - Output as an object with specific files
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
