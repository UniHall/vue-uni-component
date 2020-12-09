## 组件库介绍
该组件库为基于vue2.X以及element-ui创建的组件库

如果您觉得该组件库对您的开发有所帮助，欢迎您进行试用

::: tip
您可以全局引入该组件库，亦可按需引入。具体使用方式请向下翻阅。
:::
### 安装
npm install vue-uni-component
### 全局引入
::: warning
因为我们使用了element-ui中的组件，使用时需要同时引入element-ui.
:::

```
import ElementUI from 'element-ui'
Vue.use(ElementUI)
import VueUniComponent from 'vue-uni-component'
Vue.use(VueUniComponent)
import 'vue-uni-component/lib/style/index.css'
```


### 按需引入

``` 
import ElementUI from 'element-ui'
Vue.use(ElementUI)
import { UniTable } from 'vue-uni-component'
Vue.use(UniTable)
import 'vue-uni-component/lib/style/index.css'
```
