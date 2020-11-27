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
