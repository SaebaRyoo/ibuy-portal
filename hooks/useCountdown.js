'use client'
import { useState, useEffect, useRef } from 'react'

function calcRemaining(endTime) {
  const diff = new Date(endTime).getTime() - Date.now()
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, isExpired: true }

  const totalSeconds = Math.floor(diff / 1000)
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isExpired: false,
  }
}

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function useCountdown(endTime) {
  const [remaining, setRemaining] = useState(() => calcRemaining(endTime))
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!endTime) return

    setRemaining(calcRemaining(endTime))

    intervalRef.current = setInterval(() => {
      const next = calcRemaining(endTime)
      setRemaining(next)
      if (next.isExpired) {
        clearInterval(intervalRef.current)
      }
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [endTime])

  return {
    hours: pad(remaining.hours),
    minutes: pad(remaining.minutes),
    seconds: pad(remaining.seconds),
    isExpired: remaining.isExpired,
  }
}
