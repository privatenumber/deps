# 📦 deps <a href="https://npm.im/deps"><img src="https://badgen.net/npm/v/deps"></a> <a href="https://npm.im/deps"><img src="https://badgen.net/npm/dm/deps"></a> <a href="https://packagephobia.now.sh/result?p=deps"><img src="https://packagephobia.now.sh/badge?p=deps"></a>

<p align="center">
  <img src="/.github/screenshot.png" width="70%">
  <br>
  Accurately detect which Node dependencies are in-use with V8 Coverage 🔥
</p>

#### Try it out!
```sh
$ npx deps [...command]
```
_eg. `npx deps npm run build`_

## :rocket: Install
Install globally if you don't want to use it via [npx](https://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner).
```sh
npm i -g deps
```

## Usage
### 🔬 Quick analysis
Prefix your Node command with `deps` and it will analyze and output the dependencies it used
```sh
$ deps ...
```
eg. `deps npm run build`

### 👩‍🔬 Analyzing dependency usage across commands
_Prerequisite: install `deps` globally_
1. Start recording dependecy usage (note the [dot-space](https://superuser.com/questions/1136409/what-is-the-dot-space-filename-command-doing-in-bash) at the beginning)
  ```sh
  $ . deps-start
  ```

2. Run a series of Node scripts eg.
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
  - etc.

3. Analyze used dependencies
  ```sh
  $ deps analyze
  ```
  - Save data to file:
    ```sh
    deps analyze -o output.json
    ```
  - Read later with:
    ```sh
    deps -f output.json
    ```

4. When you're done, stop recording
  ```sh
  $ . deps-stop
  ```

## 💁‍♂️ FAQ

#### How does it work?
`deps` detects which modules are loaded by using [V8's code coverage](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir) feature, so it's very accurate. However, it doesn't detect file-system reads, as they are simply read as text rather than actually being parsed and executed. That means it can't detect what files are statically analyzed by bundlers (eg. Webpack, Rollup, etc.). I am considering supporting FS reads in the future.

#### How does it compare to `depcheck`?
[`depcheck`](https://github.com/depcheck/depcheck) statically analyzes your project to see which dependencies are imported, avoiding the need to execute code. In contrast, `deps` executes code to analyze which dependencies were loaded during run-time. They work in completely different ways, but a major drawback for me is that `depcheck` requires a ["special"](https://github.com/depcheck/depcheck#special) for supporting whether a module was loaded via dev-tools.

## 💼 License
MIT
