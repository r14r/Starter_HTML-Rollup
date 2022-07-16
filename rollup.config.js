const path = require("path");
const indexHTML = require("rollup-plugin-index-html");

import { terser } from "rollup-plugin-terser";

import typescript from "@rollup/plugin-typescript";
import less from 'rollup-plugin-less';
import copy from "rollup-plugin-copy";
import clean from "rollup-plugin-clean";
import pug from 'rollup-plugin-pug';

export default {
  input: [ "src/index.ts" ],
  output: [
    {
      file: "out/bundle.js",
      format: "iife",
      plugins: [],
      globals: {
        d3: "d3",
        "d3-hierarchy": "d3",
      },
    },
    {
      file: "out/bundle.min.js",
      format: "iife",
      plugins: [terser()],
      globals: {
        d3: "d3",
        "d3-hierarchy": "d3",
      },
    },
  ],
  watch: {
    skipWrite: false,
    clearScreen: true,
    include: [ "src/**/*", "src/*.html", "src/*.css" ],
    exclude: "node_modules/**",
  },
  plugins: [
    clean(),
    copy({
      targets: [
        { src: "src/index.*", dest: "out" },
        { src: "src/data/*.json", dest: "out/data" },
        { src: "src/lib/*", dest: "out/lib" },
        { src: "src/assets/*", dest: "out/assets" },
        { src: "node_modules/d3/dist/d3.min.js", dest: "out/lib/d3" },
        {
          src: "node_modules/d3-hierarchy/dist/d3-hierarchy.min.js",
          dest: "out/lib/d3",
        },
      ],
    }),
    less(),
    typescript({
      typescript: require("typescript"),
      include: ["*.ts+(|x)", "**/*.ts+(|x)", "*.d.ts", "**/*.d.ts"],
    }),
  ],
  external: ["d3", "d3-hierarchy"],
};
