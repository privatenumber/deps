import chalk from 'chalk';
import util from 'util';
import * as fs from 'fs';
import * as t from './types';
import SimpleTable from 'cli-simple-table';
import readPkg from 'read-pkg';

const $writeFile = util.promisify(fs.writeFile);

async function outputResult(
	result: t.Dependencies,
	options?: t.Options,
): Promise<void> {
	if (options?.output) {
		await $writeFile(options.output, JSON.stringify(result, null, '  '));
		return;
	}

	const pkg = await readPkg();

	const table = new SimpleTable();
	table.header('Dependency', 'Type', 'Used (files)');

	['dependencies', 'devDependencies'].forEach(depType => {
		if (!(depType in pkg)) {
			return;
		}

		const deps = pkg[depType];
		Object.keys(deps)
			.sort(pkgName => (`node_modules/${pkgName}` in result) ? -1 : 1)
			.forEach(pkgName => {
				const key = `node_modules/${pkgName}`;
				const used = (key in result);

				if (used) {
					pkgName = chalk.greenBright(pkgName);
				}

				table.row(pkgName, depType, used ? `✅ (${result[key].length})` : '');
				if (used) {
					result[key] = [];
				}
			});
	});

	Object.keys(result).forEach(key => {
		if (result[key].length > 0) {
			table.row(key.replace(/^.*?node_modules\//, ''), 'nested', `✅ (${result[key].length})`);
		}
	});

	console.log('\n');
	console.log(table.toString());
}

export default outputResult;
