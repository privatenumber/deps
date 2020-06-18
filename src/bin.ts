import minimist from 'minimist';
import chalk from 'chalk';
import {showHelp} from './utils';
import deps from '.';

export default (async () => {
	const {help, version, verbose, output, _} = minimist(process.argv.slice(2), {
		boolean: [
			'version',
			'verbose',
			'help',
		],
		alias: {
			verbose: 'v',
			output: 'o',
			help: 'h',
		},
	});

	if (_.length > 0) {
		const cmd = process.argv.slice(2).join(' ');
		return deps(cmd, {verbose, output});
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
