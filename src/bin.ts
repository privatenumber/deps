import {cac} from 'cac';
import deps from '.';

(async () => {
	const cli = cac();

	cli.help();

	const {version} = require('../package'); // eslint-disable-line @typescript-eslint/no-var-requires
	cli.version(version);

	cli
		.command('<...command>', 'Records and analyzes the dependency usage of a given command')
		.example('deps node file.js')
		.option('-v, --verbose', 'verbose mode - Output as an object with specific files')
		.option('--output <dest>', 'target destination for JSON')
		.action((command, {verbose, output}) => {
			void deps(command.join(' '), {verbose, output});
		});

	// Cli
	// 	.command('analyze <JSON file>');

	cli.parse();
})().catch(error => {
	console.log('Error:', error.message);
});
