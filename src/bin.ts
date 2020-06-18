import minimist from 'minimist';
import chalk from 'chalk';
import showHelp from './show-help';
import outputResult from './output-result';
import deps from '.';
import * as path from 'path';

export default (async () => {
	const {help, version, verbose, output, file, _} = minimist(process.argv.slice(2), {
		boolean: [
			'version',
			'help',
		],
		alias: {
			file: 'f',
			output: 'o',
			help: 'h',
		},
	});

	if (_.length > 0) {
		const cmd = _.join(' ');
		return deps(cmd, {verbose, output});
	}

	if (file) {
		const pkg = require(path.resolve(file)); // eslint-disable-line @typescript-eslint/no-var-requires
		await outputResult(pkg);
		return 0;
	}

	if (!help && !version) {
		console.log(chalk.red.bold('\n[deps error]'), 'No command passed in');
		showHelp();
		return 1;
	}

	showHelp();
	return 0;
})().catch(error => {
	console.log(chalk.red.bold('\n[deps error]'), error.message);
});
