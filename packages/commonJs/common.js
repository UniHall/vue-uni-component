export function filterDictNameByCode(dictCode, dictList, codeProp = 'code', labelProp = 'label') {
  const res = dictList.find(item => item[codeProp] === dictCode)
  return res ? res[labelProp] : dictCode
}
/**
 * 将字符串格式化为千分符格式的字符串
 * @param {String} s 格式化的金额字符串
 * @param {Number} n 小数位数
 */
export function formatMoneyStr(s, n) {
  if (s === undefined || s === '' || s === null) {
    return '-'
  }
  n = n >= 0 && n <= 20 ? n : 2
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
  var l = s.split('.')[0].split('').reverse()
  var r = s.split('.')[1]
  var i
  var t = ''
  for (i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length && l[i + 1] !== '-' ? ',' : '')
  }
  return t.split('').reverse().join('') + (r ? '.' + r : '')
}

/**
 * 将list[Object]类型数据转化为list[{children:[]}]格式
 * @param {Array} normalList list[Object]类型的原list
 * @param {String} parentIdName list[object]中Object标记父节点关联关系的字段名，如'parentId','parentCode'等
 * @param {Array<String>} rootCodeList 若想仅过滤出parentId为某些值的list则需要传此值
 */
export function parseTreeData(normalList, parentIdName, rootCodeList) {
  var treeData = []
  if (normalList.length > 0) {
    for (let index = 0; index < normalList.length; index++) {
      const n = normalList[index]
      if (!n[parentIdName] || (rootCodeList && rootCodeList.includes(n.code))) {
        treeData.push(n)
      }
    }
    parseChildTree(normalList, treeData, parentIdName)
  }
  return treeData
}

export function parseChildTree(normalList, parentList, parentIdName) {
  if (normalList.length !== 0 && parentList.length !== 0) {
    for (let index = 0; index < parentList.length; index++) {
      const parentElement = parentList[index]
      for (let childIndex = 0; childIndex < normalList.length; childIndex++) {
        const childElement = normalList[childIndex]
        if (parentElement.id === childElement[parentIdName]) {
          parentElement.children = parentElement.children || []
          parentElement.children.push(childElement)
        }
      }
      if (normalList.length > 0 && parentElement.children && parentElement.children.length > 0) {
        parseChildTree(normalList, parentElement.children, parentIdName)
      }
    }
  }
}
