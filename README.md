
## Description

Account opening system base on [nest](https://github.com/nestjs/nest) framework

## Installation

```bash
$ npm install
```

## TSLint configuration
```bash
# install tslint
$ sudo npm i -g tslint

# vscode install plugin
Extensions > tslint > Install

# vscode setting.json 
"tslint.autoFixOnSave": true,
"editor.tabSize": 2,
"editor.renderWhitespace": "all",
```

## Running the app

```bash
# start mongodb
$ npm run mongodb

# development
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod

```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## License

  Nest is [MIT licensed](LICENSE).

# code explain
412  id not exist
413  '注册超时，请重新登录'

#生产mysqlmodel
npx typeorm-model-generator -h 168.63.141.20 -d mt5to4report_demo -u rootsys -x BTisDBA -e mysql -o src/models -s mt5to4

# 生成文档
apidoc -i src/ apidocs/