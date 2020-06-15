export interface Options {
	verbose: boolean;
	output: string;
}

export interface Dependencies {
	[key: string]: string[];
}

export interface UnsedDependencies {
	dependencies: string[];
	devDependencies: string[];
}

export type UsedDependencies = Dependencies | string[];

export interface Result {
	usedDependencies: UsedDependencies;
	unusedDependencies: UnsedDependencies;
}
