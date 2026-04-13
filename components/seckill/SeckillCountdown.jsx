'use client'

import useCountdown from '@/hooks/useCountdown'

const SeckillCountdown = ({ endTime, size = 'md', label = '距结束' }) => {
  const { hours, minutes, seconds, isExpired } = useCountdown(endTime)

  if (isExpired) return null

  const sizeClasses = {
    sm: { block: 'px-1 py-0.5 text-xs', separator: 'text-xs' },
    md: { block: 'px-2 py-1 text-lg', separator: 'text-sm' },
    lg: { block: 'px-2.5 py-1 text-2xl', separator: 'text-lg' },
  }

  const cls = sizeClasses[size] || sizeClasses.md

  return (
    <div className="flex items-center gap-1">
      {label && <span className="text-xs opacity-70 mr-1">{label}</span>}
      <span className={`bg-black/30 rounded font-bold font-mono text-white ${cls.block}`}>
        {hours}
      </span>
      <span className={`font-bold text-white ${cls.separator}`}>:</span>
      <span className={`bg-black/30 rounded font-bold font-mono text-white ${cls.block}`}>
        {minutes}
      </span>
      <span className={`font-bold text-white ${cls.separator}`}>:</span>
      <span className={`bg-black/30 rounded font-bold font-mono text-white ${cls.block}`}>
        {seconds}
      </span>
    </div>
  )
}

export default SeckillCountdown
