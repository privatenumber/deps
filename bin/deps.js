#!/usr/bin/env node

const execa = require('execa');
const tempy = require('tempy');
const outdent = require('outdent');
const sortKeys = require('sort-keys');
const readPkg = require('read-pkg');
const del = require('del');
const path = require('path');
const assert = require('assert');
const { promises: fs } = require('fs');
const util = require('util');
const { showHelp, showVersion } = require('../lib/utils');
const { getReports, getUsedDeps } = require('../lib/parse-reports');

const getUnusedDeps = (usedDependencies, pkgJsn) => {
	const unusedDependencies = {};

	['dependencies', 'devDependencies'].forEach((depType) => {
		unusedDependencies[depType] = [];

		const packages = Object.keys(pkgJsn[depType]);
		packages.forEach((p) => {
			const isUsed = usedDependencies[`node_modules/${p}`];
			if (!isUsed) {
				unusedDependencies[depType].push(p);
			}
		});
	});

	return unusedDependencies;
};

(async () => {
	const argv = require('minimist')(process.argv.slice(2), {
		boolean: [
			'unused',
			'verbose',
			'help',
		],
		alias: {
			unused: 'u',
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
	assert(cmd, 'A command must be passed in');
	const coverageDir = tempy.directory();
	const res = await execa.command(cmd, {
		stdio: 'inherit',
		env: {
			NODE_V8_COVERAGE: coverageDir,
		},
	});

	const usedDependencies = getUsedDeps(await getReports(coverageDir));
	const deletingDir = del([coverageDir], { force: true });

	const result = {
		usedDependencies: argv.verbose ? usedDependencies : Object.keys(usedDependencies),
	};

	// if (argv.unused) {
	result.unusedDependencies = getUnusedDeps(
			usedDependencies,
			await readPkg(),
		);
	// }

	if (argv.output) {
		const resultStr = JSON.stringify(result, null, '  ');
		await fs.writeFile(argv.output, resultStr);
	} else {
		console.log(util.inspect(result, {
			colors: true,
			depth: null,
			maxArrayLength: null,
		}));
	}

	return deletingDir;
})();
