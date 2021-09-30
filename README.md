# ads.fandow.com 广告营销系统

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build-env
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

# Ads-project 项目 前端技术栈及规范

### 技术栈

- ES6 + HTML/HTML5 + CSS/CSS3 + Less

- Vue 全家桶 + AntDesignVue+ Nuxt.js + Axios

  | 技术              | 说明                 | Link                                       |
  | :---------------- | :------------------- | :----------------------------------------- |
  | Vue 2.x           | 前端 JavaScript 框架 | https://cn.vuejs.org/                      |
  | VueRouter         | 前端路由框架         | https://router.vuejs.org/zh/               |
  | VueCLI 3.x        | 项目脚手架           | https://cli.vuejs.org/zh/                  |
  | Vuex              | 全局状态管理工具     | https://vuex.vuejs.org/zh/                 |
  | AntDesginVue 1.7x | 前端 UI 组件库       | https://2x.antdv.com/components/select-cn/ |
  | Nuxt.js           | 服务器渲染框架       | https://www.nuxtjs.cn/                     |
  | Webpack 4.x       | 项目打包工具         | https://www.webpackjs.com/                 |
  | Axios             | 前端通信框架         | https://github.com/axios/axios/            |
  | Day.js            | 前端时间格式工具     | https://day.js.org/docs/zh-CN/parse/parse  |
  | AntV              | 数据可视化工具       | https://antv.vision/zh                     |
  | xgplayer          | 西瓜播放器           | https://v2.h5player.bytedance.com/zh       |

### 组件说明

- 固定气泡提示框组件引用路径：components/fixed-component/fixed-tips.vue

- 头像组件：components/avatar.vue

- 颜色选择器：components/color-picker.vue

- 全局加载样式：components/loading.vue

### 项目难点

- 数据图标等数据可视化功能的实现是基于蚂蚁金服的可视化工具 AntV 的 **G2** 及[ **G2Plot**](https://g2plot.antv.vision/zh)，不熟悉则需要去了解，里面有很多 API
- 创建广告组以及广告计划使用的布局模板是`layouts`文件夹下的`create.vue`文件而不是默认的布局文件`default.vue`
- 推广模块的`所有筛选`模块的状态都是再`nuxt`的内置的`vuex`，关于 nuxt 的`vuex`不知道怎么用，不熟悉的去`nuxt`官方查看文献, 触发机制： **筛选表单 -> vuex -> 广告组/计划/创意的 watch -> 调用后端的接口**
- 关于商品、推广位、员工的模糊搜索有对应的全局组件， 按自己的需求来引用
- 涉及到模糊搜索的接口调用都需要加上的函数防抖`debounce`, 该方法再`utils`文件夹下的`utils.js`文件
- 关于 AntDesignVue 的`table`组件的表头自定义颜色以及斑马纹的样式已经有实现， 样式为`table.less`,斑马纹样式需要加上 table 组件的属性`row-class-name`来设计对应的样式
- 关于`table`的表头的列的可拖动功能实现需要自己动手实现， 并不能添加一个属性就可以解决， 具体如何实现的既可以参照官网， 也可以参照推广下的广告组的 table 文件`promotion-tabs-ad.vue`，需要看得懂`utils`下的函数`resizeableTitle`
- 全局的`自定义列`组件，共功能逻辑只完成了`90%`，而且字段是前端写死的，并不会根据表格对应的字段来显示字段名， 逻辑复杂，个人建议，看不懂自己重写一个

- 创建广告组的**时间表格选择组件**，选了但并还没有返回选中的值, 逻辑复杂， 个人建议，看不懂自己重写一个【当前正在原有基础上进行逻辑更替 - hjh】

### 文件及组件命名规范

- 自定义组件用大驼峰命名例：`UserLogin`；（必须遵守）

- 文件和目录命名采用中横线 `-` 连接；（必须遵守）

- 文件和目录都是以**小写**英文单词，不以中文、小驼峰、大驼峰和下划线等命名；（必须遵守）

- 特性文件以类型结尾命名，`-特性英文单词`链接，例：xxx-router.js、xxx-xxx-api.js；（必须遵守）

- api 文件夹下只保留`env.js`文件、`fetch.js`文件、`config.js`文件, 文件夹除外；（必须遵守）

- 其他的接口应要新建文件夹按功能模块命名文件；（必须遵守）

- 若一个`.vue`单文件的行数远超于`1000`行，应进一步细分改页面的组件,尽量控制文件的行数不超过 1500 行；（建议）

- 目录以模块功能命名，且该模块的子模块的文件都应放在该目录下，该模块下的局部公共组件放在该目录下的 components 文件夹里面；（必须遵守）

### 系统统一用法

- 删除提示，均用弹框提示

- loading均用table组件的loading处理

  ```shell
  .
  ├── pages  路由页面
  │   ├── home
  │   	├── home.vue
  │   	├── components
  │   		├── home-header.vue
  │   		├── home-main.vue
  │   		├── home-footer.vue
  ```

- 图片以`模块+功能`类型进行命名，例：购物车-空白图，public/images/mve/carts/cart-blank.png；（建议）

- 多张切图用序号区分，例：activity-content-01.jpg、activity-content-02.jpg；（建议）

### Vue 单文件

- #### :sunny: Script 标签内部结构顺序

  components -> props -> data -> computed -> watch -> filter -> 钩子函数 -> methods

- #### :zap: 代码格式化

  Eslint + prettier: 如果没有安装对应的 vscode 插件, 为了项目的统一校验以及相同的代码格式，请将下面文件（没有则新建）`settings.json`文件放在`.vscode`文件夹下

  ```json
  // settings.json
  {
    "git.ignoreLimitWarning": true,
    "files.eol": "\n",
    "workbench.iconTheme": "vscode-icons",
    // vscode默认启用了根据文件类型自动设置tabsize的选项
    "editor.detectIndentation": false,
    // 重新设定tabsize
    "editor.tabSize": 2,
    // #每次保存的时候自动格式化
    "editor.formatOnSave": true,
    // 添加 vue 支持
    "eslint.validate": ["javascript", "javascriptreact"],
    //  #让prettier使用eslint的代码格式进行校验
    "prettier.eslintIntegration": true,
    //  #去掉代码结尾的分号
    "prettier.semi": false,
    //  #使用带引号替代双引号
    "prettier.singleQuote": true,
    //  #让函数(名)和后面的括号之间加个空格
    "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
    // #这个按用户自身习惯选择
    "vetur.format.defaultFormatter.html": "js-beautify-html",
    // #让vue中的js按编辑器自带的ts格式进行格式化
    "vetur.format.defaultFormatter.js": "vscode-typescript",
    "vetur.format.defaultFormatterOptions": {
      "js-beautify-html": {
        "wrap_attributes": "force-aligned"
        // #vue组件中html代码格式化样式
      }
    },
    "files.associations": {
      "*.cjson": "jsonc",
      "*.wxss": "css",
      "*.wxs": "javascript"
    },
    "emmet.includeLanguages": {
      "wxml": "html"
    },
    "vetur.validation.template": false, //关闭vetur标签闭合检查（用于解决iview标签报错）
    "[vue]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    // "workbench.colorTheme": "Monokai",
    "javascript.updateImportsOnFileMove.enabled": "always",
    "explorer.confirmDragAndDrop": false
  }
  ```

- ### :cloud: 代码风格

  自行阅读：[Airbnb JavaScript Style Guide](https://github.com/yuche/javascript) Airbnb 的 js 代码规范 **(严格遵守)**

### Git Commit 提交规范

- git commit -m `feat: xxxx` : 新功能开发（feature）

- git commit -m `fixed: xxxx` : bug 修复

- git commit -m `docs: xxxx` : 文档编写

- git commit -m `refactor: xxxx` : 代码重构（即不是新增功能，也不是修改 bug 的代码变动）

- git commit -m `chore: xxxx` : 构建过程或辅助工具的变动

- git commit -m `test: xxxx` : 增加单元、端到端等测试代码

### 文件结构

```shell
.
├── .nuxt  经过Nuxt打包编译后生成的整个项目文件
├── api  项目接口配置
├── assets  资源
│   └── images  图片文件
├── components  全局公共组件
├── layouts  页面布局
├── middleware  中间件
├── pages  路由页面
│   ├── xxx  xxx模块页面
│   ├── yyy  yyy模块页面
│   ├── zzz  zzz模块页面
├── plugins  插件
│   ├── axios
│   ├── router（菜单路由）
│   ├── other-router（非菜单路由）
│   ├── iview
├── server 服务端启动文件
├── static  静态文件
├── store vuex工具文件
├── test单元测试文件
└── utils 全局公用方法
```

### 最终目标：敏捷开发，即使开创新的模块新的界面，都能按照一个模板去构造，做到不用多余的注释，易懂，维护成本低的形式
