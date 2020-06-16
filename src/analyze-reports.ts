import {promises as fs} from 'fs';
import path from 'path';
import sortKeys from 'sort-keys';
import * as t from './types';

interface FunctionRange {
	startOffset: number;
	endOffset: number;
	count: number;
}

interface EntryFunction {
	functionName: string;
	ranges: FunctionRange[];
	isBlockCoverage: boolean;
}

interface ReportEntry {
	scriptId: string;
	url: string;
	functions: EntryFunction[];

}

const getReports = async (coverageDir: string): Promise<ReportEntry[][]> => Promise.all(
	(await fs.readdir(coverageDir))
		.filter(f => f.endsWith('.json'))
		.map(async file => {
			const reportPath = path.resolve(coverageDir, file);
			const content = await fs.readFile(reportPath);
			return JSON.parse(content.toString()).result;
		}),
);

const depPtrn = /^.*node_modules\/(@[^/]+\/)?[^/]+/;

const cwd = `file://${process.cwd()}`;

const analyzeReports = async (coverageDir: string): Promise<t.Dependencies> => {
	const reports = await getReports(coverageDir);

	const usedDependencies: t.Dependencies = {};

	reports.forEach(reportFiles => {
		reportFiles.forEach(f => {
			if (!f.url.startsWith(cwd)) {
				return;
			}

			const relativePath = f.url.slice(cwd.length + 1);
			const isDep = depPtrn.exec(relativePath);

			if (!isDep) {
				return;
			}

			const [depName] = isDep;

			if (!usedDependencies[depName]) {
				usedDependencies[depName] = [];
			}

			usedDependencies[depName].push(relativePath);
		});
	});

	return sortKeys(usedDependencies);
};

export default analyzeReports;

