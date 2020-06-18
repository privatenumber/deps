# 📦 deps <a href="https://npm.im/deps"><img src="https://badgen.net/npm/v/deps"></a> <a href="https://npm.im/deps"><img src="https://badgen.net/npm/dm/deps"></a> <a href="https://packagephobia.now.sh/result?p=deps"><img src="https://packagephobia.now.sh/badge?p=deps"></a>

Node dependency usage checker using V8 Coverage. Try it out!

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
  -  Save data to file: `deps analyze -o output.json`

4. When you're done, stop recording
  ```sh
  $ . deps-stop
  ```

## 🤔 How does it work?
`deps` sets an environment variable to tap into [V8's code coverage](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir) feature. By analyzing the genereated coverage reports, `deps` is able to determine exactly which dependency files were used when running a script.

## 💼 License
MIT
