import {Config} from 'remotion';

Config.Output.setCodec('h264');
Config.Output.setImageSequence(false);
Config.Rendering.setImageFormat('jpeg');

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T;
export function truthy<T>(value: T): value is Truthy<T> {
	return Boolean(value);
}

Config.Bundling.overrideWebpackConfig((config) => {
	const [
		toLast,
		secondToLast,
		...otherPlugins
	] = (config.entry as string[]).slice().reverse();
	const rules = config.module?.rules?.map((r) => {
		if (r === '...') {
			return r;
		}
		if (r.loader?.includes('babel-loader')) {
			const origOptions = r.options;
			const options =
				typeof origOptions === 'string'
					? origOptions
					: typeof origOptions === 'undefined'
					? undefined
					: {
							...origOptions,
							plugins: [
								...origOptions.plugins,
								'react-native-reanimated/plugin',
							],
					  };
			return {
				...r,
				options,
			};
		}
		return r;
	});
	return {
		...config,
		entry: [
			...otherPlugins.reverse(),
			'./src/polyfills.ts',
			secondToLast,
			toLast,
		],
		resolve: {
			...config.resolve,
			extensions: [
				'*',
				'.web.js',
				'.web.ts',
				'.web.tsx',
				'.js',
				'.json',
				'.css',
				'.ts',
				'.tsx',
				'.png',
			],
		},
		module: {
			rules,
		},
	};
});
