import _ from 'lodash'
import { PayTypes } from './constants'

const findPayTypeName = value => {
  const payType = _.find(PayTypes, ['value', value])
  return payType ? payType.name : '未知支付方式'
}

export default findPayTypeName
