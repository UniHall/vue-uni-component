## MyTable 表格组件使用说明
### 普通表格
::: demo
```html
<template>
  <my-table :data="data" :column-list="columnList" :dict-list="dict" />
</template>
<script>
export default {
  data: function() {
    return {
      data: [{ id: 13434, name: '111', salary: 234444, gender: 'female' }, { id: 2444, name: '1222', gender: 'male' }],
      columnList: [{
        type: 'index'
      }, {
        prop: 'id',
        label: 'id'
      }, {
        prop: 'name',
        label: '姓名'
      }, {
        prop: 'salary',
        label: '薪资',
        type: 'money'
      }, {
        prop: 'gender',
        label: '性别',
        type: 'dict',
        width: '200'
      }],
      dict: [{
        code: 'female',
        label: '女'
      }, {
        code: 'male',
        label: '男'
      }]
    }
  }
}
</script>
```
:::

### 带操作列表格
::: demo
```html
<template>
  <my-table
    :data="data"
    :column-list="columnList"
    :dict-list="dict"
    @handle-button="handleButton"
  />
</template>
<script>
export default {
  data: function() {
    return {
      data: [{ id: 13434, name: '111', salary: 234444, gender: 'female' }, { id: 2444, name: '1222', gender: 'male' }],
      columnList: [{
        prop: 'id',
        label: 'id'
      }, {
        prop: 'name',
        label: '姓名'
      }, {
        prop: 'salary',
        label: '薪资',
        type: 'money'
      }, {
        prop: 'gender',
        label: '性别',
        type: 'dict',
        width: '200'
      }, {
        prop: 'operation',
        label: '操作',
        type: 'operation',
        operations: [{
          key: 'view',
          label: '查看'
        }, {
          key: 'delete',
          label: '删除',
          type: 'danger',
          notShow: [{value: ['female'], prop: 'gender'}, {value: ['111'], prop: 'name'}],
          notShowJoinType: 'or'
        }, {
          key: 'more',
          type: 'more',
          childOperations: [{
            key: 'update',
            label: '更新',
            type: 'warn'
          }]
        }]
      }],
      dict: [{
        code: 'female',
        label: '女'
      }, {
        code: 'male',
        label: '男'
      }]
    }
  },
  methods: {
    handleButton: function({ key, row }) {
      console.info('需要执行按钮操作', key, row)
      this.$message({
        type: 'warning',
        showClose: true,
        offset: 300,
        message: `您点击了按钮，key为：${key},该行数据为：${JSON.stringify(row)}`
      })
    }
  }
}
</script>
```
:::

### 分页表格
::: demo
```html
<template>
  <my-table
    :data="data"
    :column-list="columnList"
    :dict-list="dict"
    :pageable.sync="pageable"
    @change-page-size="changePageSize"
    @change-current-page="changeCurrentPage"
    @handle-button="handleButton"
  />
</template>
<script>
export default {
  data: function() {
    return {
      data: [],
      totalData: [{ id: 13434, name: '111', salary: 234444, gender: 'female' }, { id: 2444, name: '1222', gender: 'male' }],
      columnList: [{
        prop: 'id',
        label: 'id'
      }, {
        prop: 'name',
        label: '姓名'
      }, {
        prop: 'salary',
        label: '薪资',
        type: 'money'
      }, {
        prop: 'gender',
        label: '性别',
        type: 'dict',
        width: '200'
      }, {
        prop: 'operation',
        label: '操作',
        type: 'operation',
        operations: [{
          key: 'view',
          label: '查看'
        }, {
          key: 'delete',
          label: '删除',
          type: 'danger'
        }, {
          key: 'more',
          type: 'more',
          childOperations: [{
            key: 'update',
            label: '更新',
            type: 'warn'
          }]
        }]
      }],
      dict: [{
        code: 'female',
        label: '女'
      }, {
        code: 'male',
        label: '男'
      }],
      pageable: {
        page: 1,
        size: 1,
        total: 2
      }
    }
  },
  created: function() {
    this.searchTableData()
  },
  methods: {
    searchTableData: function() {
      this.data = this.totalData.slice((this.pageable.page - 1) * this.pageable.size, (this.pageable.page - 1) * this.pageable.size + this.pageable.size)
    },
    handleButton: function({ key, row }) {
      console.info('需要执行按钮操作', key, row)
    },
    changePageSize: function(val) {
      console.info('当前页容量为', this.pageable.size, '当前页码为', this.pageable.page)
      console.info('通过参数获取的页容量为', val)
      this.searchTableData()
    },
    changeCurrentPage: function(val) {
      console.info('当前页容量为', this.pageable.size, '当前页码为', this.pageable.page)
      console.info('通过参数获取的页码为', val)
      this.searchTableData()
    },
    changeSelection: function(selections) {
      console.info(selections, '选中的值为')
    }
  }
}
</script>
```
:::

### 合并行表格
::: demo
```html
<template>
  <my-table
    :data="data1"
    :column-list="columnList"
    :dict-list="dict"
    :row-key="getRowKey"
    :reserve-selection="false"
    :merge-row-keys="['name']"
    @handle-button="handleButton"
  />
</template>
<script>
export default {
  data: function() {
    return {
      data1: [{
        id: 13434,
        name: '111',
        salary: 234444,
        gender: 'female' 
      }, {
        id: 2444,
        name: '1222',
        salary: 234444,
        gender: 'male'
      }, {
        id: 243444,
        name: '1222',
        salary: 234444,
        gender: 'female'
      }],
      columnList: [{
        type: 'checkbox',
        width: '55'
      }, {
        prop: 'id',
        label: 'id'
      }, {
        prop: 'name',
        label: '姓名'
      }, {
        prop: 'salary',
        label: '薪资',
        type: 'money'
      }, {
        prop: 'gender',
        label: '性别',
        type: 'dict',
        width: '200'
      }, {
        prop: 'operation',
        label: '操作',
        type: 'operation',
        operations: [{
          key: 'view',
          label: '查看'
        }, {
          key: 'delete',
          label: '删除',
          type: 'danger'
        }, {
          key: 'more',
          // label: '',
          type: 'more',
          childOperations: [{
            key: 'update',
            label: '更新',
            type: 'warn'
          }]
        }]
      }],
      dict: [{
        code: 'female',
        label: '女'
      }, {
        code: 'male',
        label: '男'
      }]
    }
  },
  methods: {
    handleButton: function({ key, row }) {
      console.info('需要执行按钮操作', key, row)
    },
    getRowKey: function(row) {
      return row.id || row[this.columnList[0].prop]
    }
  }
}
</script>
```
:::

### 合并列表格
::: demo
```html
<template>
  <my-table
    :data="data2"
    :column-list="columnList"
    :row-key="getRowKey"
    :reserve-selection="false"
    :merge-col-index="[0, 4]"
    @handle-button="handleButton"
  />
</template>
<script>
export default {
  data: function() {
    return {
      data2: [{
        id: 13434,
        firstPercent: '10%',
        secondPercent: '10%',
        thirdPercent: '20%',
        fourthPercent: '20%',
        fifthPercent: '20%',
        sixthPercent: '30%',
        seventhPercent: '40%',
        eighthPercent: '50%',
        ninethPercent: '60%'
      }, {
        id: 2444,
        firstPercent: '30%',
        secondPercent: '40%',
        thirdPercent: '40%',
        fourthPercent: '40%',
        fifthPercent: '40%',
        sixthPercent: '30%',
        seventhPercent: '40%',
        eighthPercent: '50%',
        ninethPercent: '60%'
      }, {
        id: 243444,
        firstPercent: '60%',
        secondPercent: '60%',
        thirdPercent: '70%',
        fourthPercent: '70%',
        fifthPercent: '80%',
        sixthPercent: '30%',
        seventhPercent: '40%',
        eighthPercent: '50%',
        ninethPercent: '60%'
      }],
      columnList: [{
        type: 'checkbox'
      }, {
        prop: 'firstPercent',
        label: '1月完成度'
      }, {
        prop: 'secondPercent',
        label: '2月完成度'
      }, {
        prop: 'thirdPercent',
        label: '3月完成度'
      }, {
        prop: 'fourthPercent',
        label: '4月完成度'
      }, {
        prop: 'fifthPercent',
        label: '5月完成度'
      }, {
        prop: 'sixthPercent',
        label: '6月完成度'
      }, {
        prop: 'seventhPercent',
        label: '7月完成度'
      }, {
        prop: 'eighthPercent',
        label: '8月完成度'
      }, {
        prop: 'ninethPercent',
        label: '9月完成度'
      }]
    }
  },
  methods: {
    handleButton: function({ key, row }) {
      console.info('需要执行按钮操作', key, row)
    },
    getRowKey: function(row) {
      return row.id || row[this.columnList[0].prop]
    }
  }
}
</script>
```
:::

### 展开行
展开行的展开内容可通过作用域插槽expand进行定义
::: demo
```html
<template>
  <my-table :data="data" :column-list="columnList" :dict-list="dict">
    <template v-slot:expand="expandScope">{{ expandScope.row }}</template>
  </my-table>
</template>
<script>
export default {
  data: function() {
    return {
      data: [{ id: 13434, name: '111', salary: 234444, gender: 'female' }, { id: 2444, name: '1222', gender: 'male' }],
      columnList: [{
        type: 'expand'
      }, {
        type: 'index'
      }, {
        prop: 'id',
        label: 'id'
      }, {
        prop: 'name',
        label: '姓名'
      }, {
        prop: 'salary',
        label: '薪资',
        type: 'money'
      }, {
        prop: 'gender',
        label: '性别',
        type: 'dict',
        width: '200'
      }],
      dict: [{
        code: 'female',
        label: '女'
      }, {
        code: 'male',
        label: '男'
      }]
    }
  }
}
</script>
```
:::

### render函数/filter函数
::: demo
```html
<template>
  <my-table :data="data" :column-list="columnList" />
</template>
<script>
export default {
  filters: {
    getDictName: function(row, dictList) {
      const res = dictList.find(item => item.code === row.gender)
      return res ? res.label : row.gender
    }
  },
  data: function() {
    return {
      data: [{ id: 13434, name: '111', salary: 234444, gender: 'female' }, { id: 2444, name: '1222', gender: 'male' }],
      columnList: [{
        type: 'index'
      }, {
        prop: 'id',
        label: 'id'
      }, {
        prop: 'name',
        label: '姓名'
      }, {
        prop: 'salary',
        label: '薪资',
        render: function(row) {
          return row.salary ? row.salary + '元' : ''
        }
      }, {
        prop: 'gender',
        label: '性别',
        width: '200',
        filter: 'getDictName',
        filterParams: [{
          code: 'female',
          label: '女'
        }, {
          code: 'male',
          label: '男'
        }]
      }]
    }
  }
}
</script>
```
:::

### table属性
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| data | 表格当前展示的数据 | Array | —— | [] |
| rowKey | 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。 | Function(row)/String | —— | —— |
| columnList | 表格列属性。详细属性见下方columnList 属性详述 | Array | —— | [] |
| pageable | 分页信息，若不使用分页组件，可不传此值。具体参数详见下方pageable 属性详述 | Object | —— | null |
| height | 表格高度 | String/Number | —— | —— |
| showPoper | 当内容超出单元格长度时是否自动截取并展示提示框 | Boolean | —— | true |
| reserveSelection | 分页是否保留勾选，在存在单选或者多选列时可生效 | Boolean | —— | true |
| poperDelay | 提示信息展示延迟时间ms | Number | —— | 1000 |
| cellClassName | 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。 | String/Function({row, column, rowIndex, columnIndex}) | —— | —— |
| headerCellClassName| 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。 | String/Function({row, column, rowIndex, columnIndex}) | —— | —— |
| dictList | 若改行含有字典code转name的情况可以将字典列表（{code: "xxx", label: "YYY"}）传入此参数，并在columnList中标明type为dict，可自动进行转换；若此值不传且存在type为dict的列则会从store中获取dictList；若都不存在则直接展示code。 | Array | —— | [] |
| tableStyle | 表格样式，将其放在table的style上 | String | —— | null |
| mergeRowKeys | 要进行相同数据行合并的字段键值，如第一行和第二行的dict值一样想要进行合并，则可以将dict字段传入此字段['dict'] | Array | —— | [] |
| mergeColIndex | 要进行列合并的起始和结束列index，第一个元素为起始index，第二个元素为结束index，若不传第二个元素，则结束为最后一列 | Array | —— | [] |

### columnList 属性详述
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| prop | 该列对应的后端属性 | String | —— | —— |
| label | 该列的表头展示名称 | String | —— | —— |
| width | 该列所占宽度（如传'200' 则表示列宽200px），不传则按照内容分配宽度 | String | —— | —— |
| headerAlign | 该列表头对齐方式 | String | center/left/right | center |
| align | 该列内容对齐方式 | String | center/left/right | center |
| type | 该列的特殊类型，checkbox为复选框，radio为单选框，index为序号列，expand为展开行标识，money为金额列（会自动展示为千分符格式），dict为字典列（会自动根据code转化为label。字典从dictList中筛选，详情见上方table属性dictList参数），operation为操作列，normal为普通列，默认值 | String | checkbox/radio/index/expand/money/dict/operation/normal | normal |
| clickEvent | 点击单元格的回调函数，参数为行数据 | Function(row) | —— | —— |
| operaions | 操作列按钮，具体参数见下方operations 属性详述 | Array | —— | —— |
| render | 属性值的render渲染函数, 参数为行数据row, 返回需要展示的内容 | Function(row) | —— | —— |
| filter | 属性值的过滤器名称，即vue自带过滤器， 参数为行数据row，以及传入的过滤器参数filterParams | String | —— | —— |
| filterParams | 过滤器参数 | Object | —— | —— | 

### pageable 属性详述
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| page | 页码，从1开始 | Number | —— | 1 |
| size | 页容量 | Number | —— | 20 |
| total | 总条数 | Number | —— | 0 |

### operations 属性详述
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| type | 按钮类型，more更多类型，默认展示更多图标，鼠标悬停展示更多里面的按钮 | String | success/warn/danger/primary/more | primary |
| label | 按钮展示名称 | String | —— | —— |
| key | 按钮key值 | String | —— | —— |
| notShow | 按钮过滤条件，Object为一个条件：{value: ['XX', 'YY'], prop: 'ZZ'}，表示当满足条件该行中属性ZZ存在于value列表中时，不展示该按钮;&#10; Array为多个过滤条件，多条件连接方式为下一个属性`notShowJoinType`,如： ```[{value: ['XX', 'YY'], prop: 'ZZ'}, {value: ['AA'], prop: 'CC'}]``` 表示当满足条件该行中属性ZZ存在于value列表,并且/或者属性CC存在于['AA', 'BB']中时，不展示该按钮; &#10; 类型为Boolean时，按照此Boolean值进行判断; &#10; 类型为Function时，按照Function返回值进行判断，返回类型为Boolean | Object/Array/Boolean/Function | —— | —— |
| notShowJoinType | 按钮过滤条件连接方式 | String | or/and | and |
| buttonIcon | 按钮图标 | String | 参照element-UI的图标库 | —— |
| trigger | 更多按钮列表展示方式 | String | hover/click | hover |
| childOperations | 子按钮，更多按钮展开时展示的按钮列表Array[Object]，每个元素属性同operations | Array | —— | —— |

### 作用域插槽
| 名称 | 说明 |
| ---- | ---- |
| expand | 展开行作用域插槽，用于定义行展开之后的显示内容，使用示例见展开行表格示例, 提供参数为该行数据row |
| cell | 单元格的作用域插槽，用于定义单元格内容，提供参数为该行数据row, 该列属性prop |

### table 事件
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| change-page-size | 更新页容量触发事件， 参数为页容量 | size， Number类型 |
| change-current-page | 更新页码触发事件，参数为当前页码 | page, Number类型 |
| selection-change | 单选，多选选中值发生变化时触发事件，参数为全部已选中数据 | selections，Array类型 |
| handle-button | 点击按钮列时的触发函数， 参数为{key, row}，key为按钮的唯一标识，row为该行数据 | { key, row }, Object类型 |
