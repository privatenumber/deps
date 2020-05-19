const execa = require('execa');
const tempy = require('tempy');
const readPkg = require('read-pkg');
const assert = require('assert');
const del = require('del');
const { getReports, getUsedDeps } = require('./reports');
const { outputResult } = require('./utils');

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

async function deps(cmd, opts) {
	assert(cmd, 'A command must be passed in');

	let coverageDir;

	if (cmd === 'analyze') {
		coverageDir = process.env.NODE_V8_COVERAGE;
		assert(coverageDir, 'Recording not started. Start by running `. deps-record`');
	} else {
		coverageDir = tempy.directory();
		await execa.command(cmd, {
			stdio: 'inherit',
			env: {
				NODE_V8_COVERAGE: coverageDir,
			},
		});
	}

	const result = await analyzeCoverageDir(coverageDir, opts);
	await outputResult(result, opts);

	if (cmd !== 'analyze') {
		await del([coverageDir], { force: true });
	}
}

module.exports = deps;
