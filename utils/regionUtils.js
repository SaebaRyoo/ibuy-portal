const { province, city, area } = require('province-city-china/data')

const { toString } = Object.prototype

// 添加直辖市数据
const municipalities = [
  {
    code: '110100',
    name: '市辖区',
    province: '11',
    city: '01',
  },
  {
    code: '120100',
    name: '市辖区',
    province: '12',
    city: '01',
  },
  {
    code: '310100',
    name: '市辖区',
    province: '31',
    city: '01',
  },
  {
    code: '500100',
    name: '市辖区',
    province: '50',
    city: '01',
  },
]

function partial(fn, ...args) {
  return function inner(...newArgs) {
    return fn.apply(this, args.concat(newArgs))
  }
}

function compose(...fns) {
  return function inner(...args) {
    return fns.reduce((prev, fn) => {
      return fn.apply(this, [].concat(prev))
    }, args)
  }
}

function isEqual(x, y) {
  return x === y
}

const equalString = partial(isEqual, '[object String]')
const equalObject = partial(isEqual, '[object Object]')

const _toString = function (param) {
  return toString.call(param)
}

const isString = compose(_toString, equalString)
const isObject = compose(_toString, equalObject)

// 新数据源
const map = {
  provinces: province,
  citys: city.concat(municipalities),
  areas: area,
}

// 获取列表的通用方法
function _getListByCodeOrName(type, param) {
  const filterItem = function (attr, item) {
    return item[attr] === param
  }

  const filterItemByCode = partial(filterItem, 'code')
  const filterItemByName = partial(filterItem, 'name')

  const list = map[type]
  let result = list.filter(filterItemByCode)
  if (!result.length) {
    result = list.filter(filterItemByName)
  }
  return result
}

function _getListByCodeAndName(type, params) {
  let result = map[type].filter(item => {
    return item.code === params.code && item.name === params.name
  })
  if (!result.length) {
    result = _getListByCodeOrName(type, params.code || params.name)
  }
  return result
}

function _getList(type, opt) {
  let result = null
  if (isString(opt)) {
    // 如果传入的是字符串，则先按code查找，如果有则直接返回，如果没有则再按name查找，最后都没有返回[]
    result = _getListByCodeOrName(type, opt)
  } else if (isObject(opt)) {
    // 如果传入的是对象，则先按code及name双重查找，如果有则直接返回，如果没有则再按code or name查找，最后都没有返回[]
    result = _getListByCodeAndName(type, opt)
  } else {
    // 传入为空，返回所有
    result = map[type]
  }
  return result
}

const _getProvinces = partial(_getList, 'provinces')
const _getCitys = partial(_getList, 'citys')
const _getAreas = partial(_getList, 'areas')

const isProvinceCode = partial(isEqual, 'province')

const _getListByProvincesOrCity = function (type, opt) {
  const code = isString(opt) ? opt : opt[type]
  const citys = isProvinceCode(type) ? _getCitys() : _getAreas()
  return citys.filter(item => {
    return item[type] === code
  })
}

function hasValidSearchParams(type, searchParams) {
  return !searchParams || (isObject(searchParams) && !searchParams[type])
}

const hasValidProviceCodeParam = partial(hasValidSearchParams, 'province')
const hasValidCityCodeParam = partial(hasValidSearchParams, 'city')

// 根据 province 和 city 字段获取区域数据
function _getAreasByProvinceAndCity(provinceCode, cityCode) {
  return map.areas.filter(item => item.province === provinceCode && item.city === cityCode)
}

// 根据 code 获取省对象
function _getProvinceByCode(province) {
  return map.provinces.find(item => item.province === province) || null
}

// 根据 code 获取市对象
function _getCityByCode(province, city) {
  return map.citys.find(item => item.province === province && item.city === city) || null
}

// 根据 code 获取区对象
function _getAreaByCode(province, city, area) {
  return (
    map.areas.find(item => item.province === province && item.city === city && item.area) || null
  )
}

export default {
  getProvinces(searchParams) {
    return _getProvinces(searchParams)
  },
  getCitys(searchParams) {
    return _getCitys(searchParams)
  },
  getAreas(searchParams) {
    return _getAreas(searchParams)
  },
  getCitysByProvince(searchParams) {
    return hasValidProviceCodeParam(searchParams)
      ? _getCitys(searchParams)
      : _getListByProvincesOrCity('province', searchParams)
  },
  // 修改后的方法：根据 province 和 city 获取区域数据
  getAreasByProvinceAndCity(provinceCode, cityCode) {
    return _getAreasByProvinceAndCity(provinceCode, cityCode)
  },
  getAreasByCity(searchParams) {
    return hasValidCityCodeParam(searchParams)
      ? _getAreas(searchParams)
      : _getListByProvincesOrCity('city', searchParams)
  },
  // 新增方法
  getProvinceByCode(province) {
    return _getProvinceByCode(province)
  },
  getCityByCode(province, city) {
    return _getCityByCode(province, city)
  },
  getAreaByCode(province, city, area) {
    return _getAreaByCode(province, city, area)
  },
}
