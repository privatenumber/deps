# 📦 deps

Node dependency usage checker using V8 Coverage

## :rocket: Install
#### Global install
```sh
npm i -g deps
```

#### npx
```sh
npx deps
```

## 🔬 Quick analysis
Prefix your Node script with `deps` and it will output the dependencies it used
```sh
$ deps ...
```
eg. `deps npm run build`

## 👩‍🔬 Analyzing dependency usage across commands
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

4. When you're done, stop recording
  ```sh
  $ . deps-stop
  ```


## 🤔 How does it work?
`deps` sets an environment variable to tap into [V8's code coverage](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir) feature. By analyzing the genereated coverage reports, `deps` is able to determine exactly which dependency files were used when running a script.
