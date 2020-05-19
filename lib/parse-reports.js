const { promises: fs } = require('fs');
const path = require('path');
const sortKeys = require('sort-keys');

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

const depPtrn = /^(.*node_modules\/(@[^\/]+\/)?[^\/]+)/;

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

module.exports = {
	getReports,
	getUsedDeps,
};
