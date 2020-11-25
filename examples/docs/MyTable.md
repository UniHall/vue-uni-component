## MyTable组件使用说明
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
          type: 'danger'
        }, {
          key: 'more',
          type: 'more',
          childOperations: [{
            key: 'update',
            label: '更新',
            type: 'stop'
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
            type: 'stop'
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
            type: 'stop'
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

