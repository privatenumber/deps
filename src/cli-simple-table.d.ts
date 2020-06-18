declare module 'cli-simple-table' {

	interface Options {
		columnPadding: number;
	}

	export default class SimpleTable {
		constructor(options?: Options);
		header(...args: string[]): void;
		row(...args: string[]): void;
		toString(): string;
	}
}
