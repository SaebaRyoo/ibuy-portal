import { BuyType } from '@/utils/constants'
import _ from 'lodash'
import React, { FC, useState, useEffect } from 'react'

export type SpecItem = {
  select: boolean
  value: string
  disable?: boolean
}
type SkuItem = any
export type Spec = {
  [sk: string]: SpecItem[]
}
type PostBody = {
  id: string
  itemId: string
  num: number
}
interface Props {
  /** 商品数据 */
  data: SkuItem
  /** 直接购买 */
  onPressConfirm?: (p: PostBody) => void
  /** 加入购物车 */
  onAddToCart?: (p: PostBody) => void
  /** 所选规格变化触发 */
  optionsChange?: (s: Spec) => void
  /** modal关闭时触发 */
  onClose?: (s: Spec) => void
}

let TotalSkuStock = 0 // 总库存

const SkuSelect: FC<Props> = props => {
  const { data, optionsChange, onPressConfirm, onAddToCart } = props
  const [count, setCount] = useState<number>(1)
  const [spec, setSpec] = useState<Spec>({})
  const [canFlag, setCanFlag] = useState(false)
  const [prodPrice, setProdPrice] = useState<number>(0)
  const [skuStock, setSkuStock] = useState(0)
  const [maxPrice, setMaxPrice] = useState<number>(0)

  /**
   *
   * @param _spec 规格属性
   * @param sk 该sku下的 sk这个key的值
   *
   * 不传sk的话返回所有信息
   */
  const getSkuInfoByKey = (_spec: Spec, sk?: string) => {
    // 已选的规格：[{ name:规格名称, value:已选规格内容 }]
    const selectedSpec: { name: string; value: string }[] = []

    Object.keys(_spec).forEach(k => {
      const selectedValue = _spec[k].find(sv => sv.select)
      if (selectedValue) {
        // 这块部分也可以在选择的时候直接处理
        selectedSpec.push({
          name: k,
          value: selectedValue.value,
        })
      }
    })
    // 在规格没有全选的情况下 不执行查询操作
    if (selectedSpec.length !== Object.keys(_spec).length) {
      return
    }
    const { skus } = data
    const querySku = skus.find(sku => {
      // 对比两个数组找到 两个都不存在的sku 如果为0 则说明完全匹配就是该sku
      const diffSkus = _.xorWith(selectedSpec, sku.spec, _.isEqual)
      return !diffSkus.length
    })
    if (querySku && querySku[sk ?? '']) {
      return querySku[sk ?? '']
    } else if (querySku) {
      return querySku
    } else {
      return null
    }
  }

  /** 判断是否可以添加进购物车，比如属性是否有选，库存情况等 */
  const judgeCanAdd = (skus: any[] | undefined) => {
    const sks = Object.keys(spec)
    let s = sks.filter(sk => spec[sk].some(sv => sv.select)).length // 已经选择的规格个数
    let _cf = s === sks.length
    if (!skus || !skus.length) {
      _cf = false
    }
    if (skus?.length === 1 && !skus[0]?.spec?.length && skus[0].num <= 0) {
      _cf = false
    }
    if (_cf) {
      const num = getSkuInfoByKey(spec, 'num')
      if (count > num) {
        setCount(num)
      }
    }
    setCanFlag(_cf)
    return _cf
  }

  /** 用于规格都没选中的时候 设置 规格是否可以点击，该路径上如果跟该属性的组合没库存则该属性不能点击 */
  // 可合并在 skuCore中
  const setSpecDisable = (tags: any) => {
    const { skus } = data
    Object.keys(tags).forEach(sk => {
      tags[sk].forEach((sv: SpecItem) => {
        const currentSpec = `${sk}:${sv.value}`
        // 找到含有该规格的路径下 库存不为0的 sku
        const querySku = skus.find(sku => {
          const queryProperty = sku.spec.find(sp => `${sp.name}:${sp.value}` === currentSpec)
          return queryProperty && sku.num
        })
        // 如果找到 对应该属性的路径 sku有不为0 的则可选
        sv.disable = !querySku
      })
    })
    setSpec({ ...tags })
  }
  /**
   * 核心代码
   * @param selectedSpec 已选中的数组
   * @param currentSpecName 当前点击的规格的名称
   */
  const skuCore = (selectedSpec: string[], currentSpecName?: string) => {
    const { skus } = data
    Object.keys(spec).forEach((sk: string) => {
      if (sk !== currentSpecName) {
        // 找出该规格中选中的值
        const currentSpecSelectedValue = spec[Object.keys(spec).find(_sk => sk === _sk) || ''].find(
          sv => sv.select
        )
        spec[sk].forEach((sv: SpecItem) => {
          // 判断当前的规格的值是否是选中的，如果是选中的 就不要判断是否可以点击直接跳过循环
          if (!sv.select) {
            const _ssTemp = [...selectedSpec]
            // 如果当前规格有选中的值
            if (!!currentSpecSelectedValue) {
              const sIndex = _ssTemp.findIndex(
                _sv => _sv === `${sk}:${currentSpecSelectedValue.value}`
              )
              _ssTemp.splice(sIndex, 1)
            }
            _ssTemp.push(`${sk}:${sv.value}`)
            const _tmpPath: SkuItem[] = []
            // 找到包含该路径的全部sku
            skus.forEach((sku: SkuItem) => {
              // 找出skus里面包含目前所选中的规格的路径的数组的数量
              const querSkus = _ssTemp.filter((_sst: string) => {
                const querySpec = sku.spec.some(p => {
                  return `${p.name}:${p.value}` === _sst
                })
                return querySpec
              })
              const i = querSkus.length
              if (i === _ssTemp.length) {
                _tmpPath.push(sku) // 把包含该路径的sku全部放到一个数组里
              }
            })
            const hasStockPath = _tmpPath.find(p => p.num) // 判断里面是要有个sku不为0 则可点击
            let isNotEmpty = hasStockPath ? hasStockPath.num : 0
            sv.disable = !isNotEmpty
          }
        })
      }
    })
    judgeCanAdd(skus)
  }
  /** 规格选项点击事件 */
  const onPressSpecOption = (k: string, currentSpectValue: any) => {
    let isCancel = false
    setCount(1)
    // 找到在全部属性spec中对应的属性
    const currentSpects = spec[Object.keys(spec).find(sk => sk === k) || ''] || []
    // 上一个被选中的的属性
    const prevSelectedSpectValue: any = currentSpects.find(cspec => cspec.select) || {}
    // 设置前一个被选中的值为未选中
    prevSelectedSpectValue.select = false
    // 只有当当前点击的属性值不等于上一个点击的属性值时候设置为选中状态
    if (prevSelectedSpectValue === currentSpectValue) {
      isCancel = true
    } else {
      // 设置当前点击的状态为选中
      currentSpectValue.select = true
    }

    // 全部有选中的规格数组 ##可优化
    const selectedSpec = Object.keys(spec)
      .filter((sk: string) => spec[sk].find(sv => sv.select))
      .reduce((prev: string[], currentSpecKey) => {
        return [...prev, `${currentSpecKey}:${spec[currentSpecKey].find(__v => __v.select)?.value}`]
      }, [])
    if (isCancel) {
      // 如果是取消且全部没选中
      if (!selectedSpec.length) {
        // 初始化是否可点
        setSpecDisable(spec)
      }
    }
    // 如果规格中有选中的 则对整个规格就行 库存判断 是否可点
    if (selectedSpec.length) {
      skuCore(selectedSpec, k)
    }

    let price = null
    if (selectedSpec.length) {
      price = getSkuInfoByKey(spec, 'price')
    } else {
      price = data?.minPrice
    }
    const num = getSkuInfoByKey(spec, 'num') ?? TotalSkuStock
    setSpec({ ...spec })
    if (price) {
      setProdPrice(price)
    }
    setSkuStock(num)
    optionsChange && optionsChange(spec)
  }

  /**
   * 通过skus初始化 各个规格
   */
  const setDrawOptions = () => {
    const skus = data?.skus
    const _spec = data?.spec
    const dataExtraStock = data.skuStock
    let _tags: Spec = {}
    let _maxPrice = data?.minPrice ?? 0
    // 用于初始化默认选项
    if (_spec) {
      _tags = _spec
      setSkuStock(dataExtraStock as number)
    } else {
      const _tempTagsStrArray: any = {} // 临时字符串数组
      let _skuStock = 0 // 用于计算总库存
      skus?.forEach(s => {
        _skuStock += s.num
        s?.spec?.forEach(p => {
          if (!_tags[p.name]) {
            _tags[p.name] = []
            _tempTagsStrArray[p.name] = []
          }

          if (!_tempTagsStrArray[p.name].includes(p.value)) {
            _tempTagsStrArray[p.name].push(p.value)
            _tags[p.name].push({
              value: p.value,
              disable: false,
              select: false,
            })
          }
        })
        if (s.price > _maxPrice) {
          _maxPrice = s.price
        }
      })
      setSkuStock(_skuStock)
      TotalSkuStock = _skuStock
    }
    let _canFlag = !data.canFlag ? false : true
    /**  */
    if (skus?.length === 1 && !skus[0].spec?.length && skus[0].num <= 0) {
      _canFlag = false
    }
    setCanFlag(_canFlag)
    setProdPrice(data?.minPrice ?? 0)
    setMaxPrice(_maxPrice)
    setSpecDisable(_tags)
  }
  const openCurDrawer = () => {
    setDrawOptions()
    setCount(data?.count || 1)
  }

  const countChange = (sign: '-' | '+') => {
    let _count = count
    if (sign === '-' && _count > 1) {
      --_count
    } else if (sign === '+') {
      if (canFlag) {
        const num = getSkuInfoByKey(spec, 'num')
        if (_count < num) {
          ++_count
        } else {
          // TODO: 替换
          // message.warning('数量不能大于库存')
          _count = num
        }
      } else {
        ++_count
      }
    }
    setCount(_count)
  }
  const onPressConfirmButton = (buyType: string) => {
    if (!judgeCanAdd(data?.skus)) {
      return
    }
    const id = getSkuInfoByKey(spec, 'id')
    const postData: PostBody = {
      id,
      itemId: data?.itemId,
      num: count,
    }
    if (buyType === BuyType.cart) {
      onAddToCart?.(postData)
      // addCart({
    } else {
      onPressConfirm?.(postData)
    }
  }
  useEffect(openCurDrawer, [data])

  return (
    <div className="p-6">
      <div className="flex">
        <div className="pl-4 flex flex-col justify-between">
          <div className="text-lg text-gray-800">{data.title}</div>
          <div>
            <div className="flex items-center text-lg text-red-600">
              ¥{prodPrice}
              {!canFlag && maxPrice > prodPrice && <span> ~ ¥{maxPrice}</span>}
            </div>
            <div className="text-sm text-gray-500 mt-1">库存 {skuStock} 件</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {Object.keys(spec).map((k, index) => (
          <div key={index} className="mt-6">
            <div className="text-sm font-semibold text-gray-800">{k}</div>
            <div className="flex flex-wrap mt-2">
              {spec[k].map((o, oi) => (
                <div
                  key={oi}
                  onClick={() => !o.disable && onPressSpecOption(k, o)}
                  className={`cursor-pointer rounded-full px-4 py-1 text-sm border ${
                    o.select
                      ? 'border-cPink text-cPink bg-red-100'
                      : o.disable
                        ? 'text-gray-400 border-gray-300 bg-gray-100'
                        : 'border-gray-300 text-gray-700'
                  } m-1`}
                >
                  {o.value}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-800">数量</div>
          <div className="flex items-center">
            <button
              className="w-6 h-6 bg-gray-200 rounded text-center text-lg cursor-pointer"
              onClick={() => countChange('-')}
            >
              -
            </button>
            <div className="mx-2 text-sm">{count}</div>
            <button
              className="w-6 h-6 bg-gray-200 rounded text-center text-lg cursor-pointer"
              onClick={() => countChange('+')}
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-8 flex gap-6">
          <button
            className={`w-full py-3 rounded-full text-white ${
              canFlag ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={() => onPressConfirmButton(BuyType.cart)}
            disabled={!canFlag}
          >
            加入购物车
          </button>
          <button
            className={`w-full py-3 rounded-full text-white ${
              canFlag ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={() => onPressConfirmButton(BuyType.direct)}
            disabled={!canFlag}
          >
            立即购买
          </button>
        </div>
      </div>
    </div>
  )
}

export default SkuSelect
