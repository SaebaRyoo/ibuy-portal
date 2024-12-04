import { useSelector } from 'react-redux'
import jwt from 'jsonwebtoken'

export default function useVerify() {
  const { token } = useSelector(state => state.user)
  // let status

  if (!token) return false

  return true
}
