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

const depPtrn = /^(.*node_modules\/(@[^\/]+\/)?[^\/]+)/;

const getReports = (coverageDir) => {
	return fs.readdir(coverageDir).then((files) => Promise.all(
		files
			.filter(f => f.endsWith('.json'))
			.map(async (file) => {
				const content = await fs.readFile(path.resolve(coverageDir, file));
				return JSON.parse(content).result;
			})
	));
};

const getUsedDeps = (reports) => {
	const cwd = 'file://' + process.cwd();
	const usedDependencies = {};

	reports.forEach((reportFiles) => {
		reportFiles.forEach((f) => {
			if (!f.url.startsWith(cwd)) { return; }

			const relativePath = f.url.slice(cwd.length + 1);
			const isDep = relativePath.match(depPtrn);

			if (!isDep) { return; }

			const [depName] = isDep;

			if (!usedDependencies[depName]) {
				usedDependencies[depName] = [];
			}

			usedDependencies[depName].push(relativePath);
		});
	});

	return sortKeys(usedDependencies);
};

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
		return console.log(outdent`
			$ deps -o output.json "node file.js"

			-o, --output       Target destination for JSON
			-u, --unused       Include unused package.json dependencies
			-v, --verbose      Verbose - Output as an object with specific files
			-h, --help         Help
			--version          Version
		`);
	}

	if (argv.version) {
		return console.log(require('../package').version);
	}

	const cmd = argv._.join(' ');
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

	if (argv.unused) {
		result.unusedDependencies = getUnusedDeps(
			usedDependencies,
			await readPkg(),
		);
	}

	const resultStr = JSON.stringify(result, null, '  ');
	if (argv.output) {
		await fs.writeFile(argv.output, resultStr);
	} else {
		console.log(resultStr);
	}

	return deletingDir;
})();
