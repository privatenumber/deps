#!/usr/bin/env node

const minimist = require('minimist');
const { showHelp, showVersion } = require('../lib/utils');
const deps = require('../lib');

(async () => {
	const argv = minimist(process.argv.slice(2), {
		boolean: [
			'verbose',
			'help',
		],
		alias: {
			verbose: 'v',
			output: 'o',
			help: 'h',
		},
	});

	if (argv.help) {
		return showHelp();
	}

	if (argv.version) {
		return showVersion();
	}

	const cmd = argv._.join(' ');
	return deps(cmd, argv);
})().catch((err) => {
	console.log('Error:', err.message);
});
