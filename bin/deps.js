#!/usr/bin/env node

const execa = require('execa');
const tempy = require('tempy');
const readPkg = require('read-pkg');
const del = require('del');
const assert = require('assert');
const { showHelp, showVersion, outputResult } = require('../lib/utils');
const { getReports, getUsedDeps } = require('../lib/reports');

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

async function analyzeCoverageDir(coverageDir, { verbose }) {
	const usedDependencies = getUsedDeps(await getReports(coverageDir));

	const result = {
		usedDependencies: verbose ? usedDependencies : Object.keys(usedDependencies),
	};

	result.unusedDependencies = getUnusedDeps(
		usedDependencies,
		await readPkg(),
	);

	return result;
}

(async () => {
	const argv = require('minimist')(process.argv.slice(2), {
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
	assert(cmd, 'A command must be passed in');

	if (cmd === 'analyze') {
		const { NODE_V8_COVERAGE: coverageDir } = process.env;
		assert(coverageDir, 'Recording not started. Start by running `. deps-record`');

		const reports = await getReports(coverageDir);
		assert(reports.length, 'No usage found');

		const result = await analyzeCoverageDir(coverageDir, argv);
		return outputResult(result, argv);
	}

	const coverageDir = tempy.directory();
	await execa.command(cmd, {
		stdio: 'inherit',
		env: {
			NODE_V8_COVERAGE: coverageDir,
		},
	});

	const result = await analyzeCoverageDir(coverageDir, argv);
	const deletingDir = del([coverageDir], { force: true });

	await outputResult(result, argv);

	return deletingDir;
})();
