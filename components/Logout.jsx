import { useRouter } from 'next/navigation'

import { useDispatch } from 'react-redux'
import { userLogout, showAlert } from 'store'
import { useLogoutMutation } from '@/store/services'

import { Icons } from 'components'

export default function Logout() {
  // Assets
  const dispatch = useDispatch()
  const router = useRouter()

  const [logout] = useLogoutMutation()

  // Handlers
  const handleLogout = async () => {
    const res = await logout()
    if (res?.data?.code === 200) {
      router.push('/')
      dispatch(userLogout())
      dispatch(
        showAlert({
          status: 'success',
          title: '退出登录成功',
        })
      )
    }
  }

  // Render
  return (
    <button
      type="button"
      className="flex justify-between items-center px-7 transition-colors hover:bg-gray-100 py-4 text-xs text-gray-700 w-full border-t border-gray-300 cursor-pointer gap-x-2 md:text-sm"
      onClick={handleLogout}
    >
      <span className="text-gray-700">退出</span>
      <Icons.Logout className="text-black icon w-4 h-4" />
    </button>
  )
}
