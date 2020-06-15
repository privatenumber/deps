import minimist from 'minimist';
import {showHelp} from './utils';
import deps from '.';

(async () => {
	const {help, version, verbose, output, _} = minimist(process.argv.slice(2), {
		boolean: [
			'version',
			'verbose',
			'help'
		],
		alias: {
			verbose: 'v',
			output: 'o',
			help: 'h'
		}
	});

	if (help || version) {
		return showHelp();
	}

	const cmd = _.join(' ');

	return deps(cmd, {verbose, output});
})().catch(error => {
	console.log('Error:', error.message);
});
