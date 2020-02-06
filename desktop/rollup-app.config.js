import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import {terser} from "rollup-plugin-terser";
import json from '@rollup/plugin-json';

const NODE_GLOBALS = [
	"electron",
	"fs",
	"os",
	"util",
	"http",
	"https",
	"url",
	"path",
	"crypto",
	"net",
	"tls",
	"events",
	"tty",
	"child_process",
	"stream",
	"zlib"
];

const LODASH_METHODS_DECLARATION = [
	"forEach",
	"isEmpty",
	"isArray",
	"omit",
	"mean",
	"isUndefined",
	"isFinite",
	"last",
	"slice",
	"isNumber",
	"propertyOf",
	"sum",
	"max",
	"floor",
	"isNull",
	"isNaN",
	"clone",
	"sortBy",
	"first",
	"find",
	"set",
	"range"
];

const IS_ELECTRON_PROD = (process.env.ELECTRON_ENV && process.env.ELECTRON_ENV === "prod");

console.info("Building desktop bundle in \"" + (IS_ELECTRON_PROD ? "production" : "development") + "\" mode.");

module.exports = {
	input: "./src/main.ts",
	output: [
		{
			file: "./dist/desktop.bundle.js",
			format: "cjs"
		}
	],
	watch: {
		chokidar: false
	},
	external: NODE_GLOBALS,
	plugins: [
		typescript({
			include: [
				"./src/**/*.ts",
				"!./src/**/*.spec.ts",
				"./../appcore/modules/**/*.ts",
			]
		}),
		resolve(),
		commonjs({
			namedExports: {
				"./node_modules/lodash/lodash.js": LODASH_METHODS_DECLARATION,
				"../appcore/node_modules/lodash/lodash.js": LODASH_METHODS_DECLARATION,
				"../appcore/node_modules/pako/index.js": ["gzip", "inflate", "ungzip"],
				"./node_modules/https-proxy-agent/index.js": ["HttpsProxyAgent"],
				"./node_modules/get-proxy-settings/dist/index.js": ["getProxySettings"],
				"./node_modules/node-machine-id/dist/index.js": ["machineIdSync"],
				"./node_modules/electron-updater/out/main.js": ["autoUpdater"],
			},
			ignore: ["assert"],
			sourceMap: false
		}),
		json(),
		(IS_ELECTRON_PROD) ? terser() : null
	]
};
