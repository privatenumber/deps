import chalk from 'chalk';

function showHelp(): void {
	const version: string = require('../package').version; // eslint-disable-line @typescript-eslint/no-var-requires

	console.log(`
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

export default showHelp;
