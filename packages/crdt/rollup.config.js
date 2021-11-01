import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-polyfill-node";

export default {
  input: "lib/crdt.js",
  external: ["socket.io-client"],
  output: {
    file: "dist/bundle.js",
    format: "iife",
    name: "crdt",
    globals: {
      "socket.io-client": "io",
    },
  },
  plugins: [
    // nodePolyfills(),
    resolve({
      moduleDirectories: ["node_modules", "../../node_modules"],
      extensions: [".mjs", ".js", ".cjs"],
      preferBuiltins: true,
    }),
    commonjs({
      extensions: [".mjs", ".js", ".cjs"],
      include: ["node_modules/**", "../../node_modules/**"],
    }),
    babel({ babelHelpers: "bundled" }),
  ],
};
