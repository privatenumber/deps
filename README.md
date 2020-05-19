# 📦 deps

Node dependency usage checker using V8 Coverage


### Quick usage
Just prefix your Node script with `deps` and it will output the dependencies it used
```sh
$ deps ...
```

eg. `deps npm run build`

### Analyzing dependency usage across commands
1. Start recording dependecy usage
  ```sh
  $ . deps-start
  ```

2. Run a series of Node scripts

3. Analyze used dependencies
  ```sh
  $ deps analyze
  ```

4. When you're done, stop recording
  ```sh
  $ . deps-stop
  ```



### How does it work?
Using [V8's code coverage](https://nodejs.org/api/cli.html#cli_node_v8_coverage_dir) data, `deps` is able to analyze exactly which files were used when running a script.

