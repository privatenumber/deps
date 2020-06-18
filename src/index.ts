import execa from 'execa';
import tempy from 'tempy';
import assert from 'assert';
import del from 'del';
import analyzeReports from './analyze-reports';
import outputResult from './output-result';
import * as t from './types';

async function deps(cmd: string, options: t.Options) {
	assert(cmd, 'A command must be passed in');

	let coverageDir;
	let useExitcode = 0;
	if (cmd === 'analyze') {
		coverageDir = process.env.NODE_V8_COVERAGE;
		assert(coverageDir, 'Recording not started. Start by running `. deps-record`');
	} else {
		coverageDir = tempy.directory();
		const result = await execa.command(cmd, {
			reject: false,
			stdio: 'inherit',
			env: {
				NODE_V8_COVERAGE: coverageDir,
			},
		});
		useExitcode = result.exitCode;
	}

	const usedDependencies = await analyzeReports(coverageDir);

	await outputResult(usedDependencies, options);

	if (cmd !== 'analyze') {
		await del([coverageDir], {force: true});
	}

	return useExitcode;
}

export default deps;
