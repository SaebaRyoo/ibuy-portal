import React, { ReactNode } from 'react'

interface TabPaneProps {
  activeKey: string // 每个 TabPane 定义自己的 activeKey
  label: string
  children: ReactNode
}

const TabPane = ({ children }: TabPaneProps) => {
  return <div className="tab-content">{children}</div>
}

interface TabsProps {
  currentActiveKey: string // 当前激活的 Tab 的 activeKey
  onTabChange?: (key: string) => void // Tab 切换时的回调
  children: ReactNode
}

const Tabs = ({ currentActiveKey, onTabChange, children }: TabsProps) => {
  // 点击 Tab 的回调
  const handleTabClick = (key: string) => {
    if (onTabChange) {
      onTabChange(key) // 通知父组件
    }
  }

  return (
    <div className="tabs">
      <div className="tabs-header flex border-b-2 border-gray-300">
        {React.Children.map(children, (child: any) => (
          <div
            className={`tab-item py-2 px-4 cursor-pointer ${
              child.props.activeKey === currentActiveKey
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600'
            }`}
            onClick={() => handleTabClick(child.props.activeKey)} // 点击时传递 activeKey
          >
            {child.props.label}
          </div>
        ))}
      </div>
      <div className="tabs-content mt-4 transition-all duration-300">
        {/* 渲染当前激活的 TabPane */}
        {React.Children.map(children, (child: any) =>
          child.props.activeKey === currentActiveKey ? child : null
        )}
      </div>
    </div>
  )
}

Tabs.TabPane = TabPane

export default Tabs
