<template>
  <div class="my-table">
    <el-table
      border
      :style="tableStyle"
      :cell-class-name="cellNameFilter"
      :header-cell-class-name="headerNameFilter"
      :data="data"
      :height="height"
      :row-key="rowKey"
      :span-method="mergeRow"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="columnList.filter(column => column.type === 'expand').length > 0"
        type="expand"
        :width="columnList.filter(column => column.type === 'expand')[0].width || 55"
      >
        <template slot-scope="scope">
          <slot name="expand" :row="scope.row" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="columnList.filter(column => column.type === 'checkbox').length > 0"
        type="selection"
        :reserve-selection="reserveSelection"
        :width="columnList.filter(column => column.type === 'checkbox')[0].width || 55"
      />
      <el-table-column
        v-if="columnList.filter(column => column.type === 'index').length > 0"
        type="index"
        :width="columnList.filter(column => column.type === 'index')[0].width || 55"
      />
      <el-table-column
        v-for="column in columnList.filter(column => !['checkbox', 'expand', 'index'].includes(column.type))"
        :key="column.prop || null"
        :prop="column.prop || null"
        :label="column.label || null"
        :width="column.width"
        :header-align="column.headerAlign || 'center'"
        :align="column.align || 'center'"
      >
        <template slot-scope="scope">
          <slot name="cell" :row="scope.row" :prop="column.prop">
            <el-radio
              v-if="column.type === 'radio'"
              v-model="selectedRadio"
              :label="JSON.stringify(scope.row)"
              @change="updateSelectedRadio(scope.row)"
            >
              {{ '' }}
            </el-radio>
            <el-tooltip
              effect="light"
              :open-delay="poperDelay"
              popper-class="common-cus-popper"
              :disabled="disableToolTip"
              :content="column.render ? column.render(scope.row) : ( column.filter ? $parent.$options.filters[column.filter](scope.row, column.filterParams) : scope.row[column.prop] + '')"
            >
              <span
                v-if="!column.type || column.type==='normal'"
                :ref="column.prop + scope.$index"
                :class="{ 'common-table-span': showPoper}"
                @mouseenter="checkSpanWidth(column, column.prop, scope.$index)"
                @click="clickTableCell(column, scope.row)"
                v-html="column.render ? column.render(scope.row) : ( column.filter ? $parent.$options.filters[column.filter](scope.row, column.filterParams) : scope.row[column.prop] + '')"
              >
                {{ column.render ? column.render(scope.row) : (column.filter ? $parent.$options.filters[column.filter](scope.row, column.filterParams) : scope.row[column.prop] + '') }}
              </span>
              <span v-else-if="column.type === 'dict'">
                {{ getDictNameByCode(scope.row[column.prop]) }}
              </span>
              <span v-else-if="column.type === 'money'">
                {{ formatMoney(scope.row[column.prop]) }}
              </span>
            </el-tooltip>
            <!-- 操作按钮列的单元格渲染 -->
            <span
              v-if="column.type === 'operation' || (column.operations && column.operations.length > 0)"
            >
              <span v-for="(operation, index) in column.operations" :key="index" class="table-button">
                <el-button
                  v-if="operation.type !== 'more' && checkShowButton(operation, scope.row)"
                  type="text"
                  :class="operation.type ? 'text-button-' + operation.type : 'text-button-primary'"
                  size="mini"
                  :icon="operation.buttonIcon"
                  @click="handleButton(operation.key, scope.row)"
                >
                  {{ operation.label }}
                </el-button>
                <el-dropdown
                  v-else-if="operation.type === 'more' && checkShowButton(operation, scope.row)"
                  :trigger="operation.trigger || 'hover'"
                  @command="handleMoreButton"
                >
                  <span class="el-dropdown-link">
                    {{ operation.label }}<i class="el-icon-more el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <span v-for="childOperation in operation.childOperations" :key="childOperation.key">
                      <el-dropdown-item
                        v-if="childOperation.type !== 'more' && checkShowButton(childOperation, scope.row)"
                        :icon="childOperation.buttonIcon"
                        :class="childOperation.type ? 'text-button-' + childOperation.type : 'text-button-primary'"
                        :command="{ key: childOperation.key, row: scope.row, type: childOperation.type }"
                      >
                        {{ childOperation.label }}
                      </el-dropdown-item>
                    </span>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <!-- 允许用户直接自定义完整的table，不使用组件渲染的组件 -->
    <slot name="tableSlot" />
    <!-- 分页 -->
    <el-pagination
      v-if="pageable !== null"
      background
      small
      :current-page="pageable.page || 1"
      :page-sizes="pageSizes"
      :page-size="pageable.size || 20"
      :total="pageable.total || 0"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="changePageSize"
      @current-change="changeCurrentPage"
    />
  </div>
</template>
<script>
import { filterDictNameByCode, formatMoneyStr } from '@/commonJs/common.js'
export default {
  name: 'MyTable',
  props: {
    // 表格当前页面展示的数据
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    rowKey: {
      type: [Function, String],
      default: null
    },
    // 表格列属性
    columnList: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 分页信息
    pageable: {
      type: Object,
      default: () => {
        return null
      }
    },
    // 表格的高度
    height: {
      type: [String, Number],
      default: null
    },
    // 当内容超出单元格长度时是否自动截取并展示提示框
    showPoper: {
      type: Boolean,
      default: true
    },
    // 分页是否保留勾选
    reserveSelection: {
      type: Boolean,
      default: true
    },
    // 提示信息展示延迟时间ms
    poperDelay: {
      type: Number,
      default: 1000
    },
    // 自定义单元格类
    cellClassName: {
      type: [String, Function],
      default: ''
    },
    // 自定义表头单元格类
    headerCellClassName: {
      type: [String, Function],
      default: ''
    },
    // 字典列表
    dictList: {
      type: Array,
      default: () => { return [] }
    },
    // 表格样式
    tableStyle: {
      type: String,
      default: null
    },
    // 要进行相同数据行合并的字段键值，如第一行和第二行的dict值一样想要进行合并，则可以将dict字段传入此字段['dict']
    mergeRowKeys: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 要进行列合并的起始和结束列index，第一个元素为起始index，第二个元素为结束index，若不传第二个元素，则结束为最后一列
    mergeColIndex: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data: function() {
    return {
      pageSizes: [10, 20, 30, 40, 80],
      disableToolTip: true,
      selectedRadio: null,
      multiColumnCount: {}
    }
  },
  watch: {
    data: function(newVal) {
      this.initMergeRow()
    }
  },
  created: function() {
    if (this.pageable) {
      this.changeInitSize()
    }
    this.initMergeRow()
  },
  methods: {
    // 修改页容量数组，由于默认页容量可选下拉框中的值为10,20,30,40,80;若用户自定义页容量不在这几个值中，需要向下拉框中添加自定义页容量的值
    changeInitSize: function() {
      if (!this.pageSizes.includes(this.pageable.size)) {
        this.pageSizes.push(this.pageable.size)
        this.pageSizes.sort()
      }
    },
    // 修改页容量时，将页码从头开始，并调用查询函数
    changePageSize: function(val) {
      const pageTemp = JSON.parse(JSON.stringify(this.pageable))
      pageTemp.size = val
      this.$emit('update:pageable', pageTemp)
      this.$emit('change-page-size', val)
    },
    // 修改当前页码，执行搜索函数
    changeCurrentPage: function(val) {
      const pageTemp = JSON.parse(JSON.stringify(this.pageable))
      pageTemp.page = val
      if (!this.reserveSelection) {
        this.selectedRadio = null
        this.$emit('selection-change', [])
      }
      this.$emit('update:pageable', pageTemp)
      this.$emit('change-current-page', val)
    },
    handleMoreButton: function({ key, row, type }) {
      this.handleButton(key, row)
    },
    // 点击按钮时，触发事件，通知父组件调用哪个函数
    handleButton: function(key, row) {
      this.$emit('handle-button', { key, row })
    },
    // 校验内容是否查过单元格宽度
    checkSpanWidth: function(column, prop, index) {
      if (!this.showPoper) {
        return
      }
      if (this.$refs[prop + index][0]) {
        this.disableToolTip = this.$refs[prop + index][0].scrollWidth === this.$refs[prop + index][0].offsetWidth
      }
    },
    // 点击表格单元格时触发函数
    clickTableCell: function(col, row) {
      if (col.clickEvent) {
        col.clickEvent(row)
      }
    },
    handleSelectionChange: function(selections) {
      this.$emit('selection-change', selections)
    },
    updateSelectedRadio: function(value) {
      const selectedList = this.data.filter(row => JSON.stringify(row) === JSON.stringify(value))
      this.$emit('selection-change', selectedList)
    },
    // 单元格类拼接
    cellNameFilter: function({ row, column, rowIndex, columnIndex }) {
      const cellName = 'common-table-cell'
      if (this.cellClassName) {
        return cellName + typeof this.cellClassName === 'function' ? ('' + this.cellClassName({ row, column, rowIndex, columnIndex })) : ('' + this.cellClassName)
      }
      return cellName
    },
    // 表头单元格类拼接
    headerNameFilter: function({ row, column, rowIndex, columnIndex }) {
      const headerClass = 'common-table-cell common-header-cell'
      if (this.headerCellClassName) {
        return headerClass + typeof this.headerCellClassName === 'function' ? ('' + this.headerCellClassName({ row, column, rowIndex, columnIndex })) : ('' + this.headerCellClassName)
      }
      return headerClass
    },
    // 初始化需要合并的单元格
    initMergeRow: function() {
      if (this.mergeRowKeys.length === 0) {
        return
      }
      this.mergeRowKeys.forEach((key) => {
        const rowAndColumn = []
        let pos = 0
        for (var i = 0; i < this.data.length; i++) {
          if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
            rowAndColumn.push(1)
            pos = 0
          } else {
            if (this.data[i][key] === this.data[i - 1][key]) {
              // 如果属性值相等就累加，并且push 0
              rowAndColumn[pos] += 1
              rowAndColumn.push(0)
            } else {
              // 不相等push 1
              rowAndColumn.push(1)
              pos = i
            }
          }
        }
        this.multiColumnCount[key] = rowAndColumn
      })
    },
    // 合并单元格函数
    mergeRow: function({ row, column, rowIndex, columnIndex }) {
      // 行合并
      if (this.mergeRowKeys.includes(column.property)) {
        if (this.multiColumnCount[column.property][rowIndex]) {
          const rowNum = this.multiColumnCount[column.property][rowIndex]
          return {
            rowspan: rowNum,
            colspan: rowNum > 0 ? 1 : 0
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      // 列合并
      if (this.mergeColIndex && this.mergeColIndex.length > 0) {
        var num = 1
        // 当前列的index在columnList中对应的index值，如果表格还需要展示复选框，则需要将index 再 减去1
        const notOperationIndex = this.columnList[this.columnList.length - 1].operations && this.columnList[this.columnList.length - 1].operations.length > 0 ? this.columnList.length - 2 : this.columnList.length - 1
        const endIndex = this.mergeColIndex.length > 1 ? this.mergeColIndex[1] : notOperationIndex
        // 如果当前列不在columnList中或者当前列超出了需合并列的index，则不进行任何操作
        if (columnIndex < 0 || columnIndex > endIndex) {
          return [1, 1]
        }
        // 如果当前列与前一列值相同，则进行合并，将单元格隐藏
        if (columnIndex > 0 && row[this.columnList[columnIndex].prop] === row[this.columnList[columnIndex - 1].prop]) {
          return [0, 0]
        }
        for (let i = columnIndex + 1; i <= endIndex; i++) {
          // 若值与前一单元格值相等，则需合并单元格的值++
          if (row[this.columnList[i].prop] === row[this.columnList[i - 1].prop]) {
            num++
          } else {
            // 如果值不相等则返回合并单元格范围
            return [1, num]
          }
        }
        return [1, num]
      }
    },
    // 根据字典code获取字典名称
    getDictNameByCode: function(dictCode) {
      const dictList = this.dictList.length === 0
        ? (this.$store && this.$store.getters && this.$store.getters.dictList && this.$store.getters.dictList.length > 0 ? this.$store.getters.dictList : [])
        : this.dictList
      return filterDictNameByCode(dictCode, dictList)
    },
    // 格式化金额
    formatMoney: function(money) {
      return formatMoneyStr(money ? money + '' : '')
    },
    // 校验按钮是否展示
    checkShowButton: function(operation, row) {
      const notShowType = Object.prototype.toString.call(operation.notShow).split(' ')[1].split(']')[0]
      if (notShowType === 'Boolean') {
        return !operation.notShow
      }
      if (!operation.notShow) {
        return true
      }
      operation.notShow = notShowType === 'Object' ? [operation.notShow] : operation.notShow
      if (notShowType === 'Function') {
        return !operation.notShow()
      }
      let show = null
      if (operation.notShowJoinType && operation.notShowJoinType.toLowerCase() === 'or') {
        operation.notShow.forEach((filter) => {
          const filterType = Object.prototype.toString.call(filter).split(' ')[1].split(']')[0]
          if (filterType === 'Boolean') {
            show = show === null ? !filter : show || !filter
          } else if (filterType === 'Function') {
            show = show === null ? !filter() : show || !filter()
          } else {
            if (filter.value.includes(row[filter.prop])) {
              show = false
            }
          }
          if (!show) {
            return
          }
        })
      } else {
        operation.notShow.forEach((filter) => {
          const filterType = Object.prototype.toString.call(filter).split(' ')[1].split(']')[0]
          if (filterType === 'Boolean') {
            show = show === null ? !filter : show && !filter
          } else if (filterType === 'Function') {
            show = show === null ? !filter : show && !filter()
          } else {
            if (!filter.value.includes(row[filter.prop])) {
              show = true
            }
          }
          if (show) {
            return
          }
        })
      }
      return show
    }
  }
}
</script>
