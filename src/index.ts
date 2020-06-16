import execa from 'execa';
import tempy from 'tempy';
import readPkg from 'read-pkg';
import assert from 'assert';
import del from 'del';
import analyzeReports from './analyze-reports';
import { outputResult } from './utils';
import * as t from './types';
import { PackageJson } from 'type-fest';

const getPkgUnused = (
	usedDependencies: t.Dependencies,
	dependencyHash: PackageJson.Dependency = {},
): string[] => Object.keys(dependencyHash).filter((p) => !usedDependencies.hasOwnProperty(`node_modules/${p}`));


const getUnusedDeps = (
	usedDependencies: t.Dependencies,
	pkgJsn: readPkg.NormalizedPackageJson
): t.UnsedDependencies => ({
	dependencies: getPkgUnused(usedDependencies, pkgJsn.dependencies),
	devDependencies: getPkgUnused(usedDependencies, pkgJsn.devDependencies),
});


async function analyzeCoverageDir(coverageDir: string, { verbose }: t.Options): Promise<t.Result> {
	const usedDependencies = await analyzeReports(coverageDir);

	return {
		usedDependencies: verbose ? usedDependencies : Object.keys(usedDependencies),
		unusedDependencies: getUnusedDeps(
			usedDependencies,
			await readPkg(),
		),
	};
}


async function deps(cmd: string, opts: t.Options) {
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


export default deps;
