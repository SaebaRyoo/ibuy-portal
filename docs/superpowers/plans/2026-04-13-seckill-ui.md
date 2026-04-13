# 秒杀 UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the C-end seckill (flash sale) UI for iBuy, including homepage banner, seckill zone page, product detail page, and order tab integration.

**Architecture:** Pure REST polling approach — no WebSocket. All API calls via RTK Query (`injectEndpoints`). Countdown logic in a shared `useCountdown` hook. Seckill pages live under `/seckill` route, components under `components/seckill/`. One backend change: add `totalStock` field to `IbuySeckillGoods`.

**Tech Stack:** Next.js 14 / React 18 / Redux Toolkit (RTK Query) / Tailwind CSS / Swiper / Headless UI

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `../ibuy-portal-backend/prisma/schema.prisma` | Modify | Add `totalStock` field to `IbuySeckillGoods` |
| `../ibuy-portal-backend/src/mall-service/mall-service-seckill/seckill-goods/seckill-goods.service.ts` | Modify | Set `totalStock = stockCount` in `add()` |
| `../ibuy-portal-backend/src/mall-service/mall-service-seckill/seckill-goods/seckill-goods.controller.ts` | Modify | Accept `totalStock` in body type |
| `hooks/useCountdown.js` | Create | Shared countdown hook used by 3 pages |
| `store/services/seckill.service.js` | Create | RTK Query endpoints for seckill APIs |
| `store/services/api.js` | Modify | Add `'Seckill'` to `tagTypes` |
| `store/services/index.js` | Modify | Export seckill service |
| `hooks/index.js` | Modify | Export useCountdown |
| `components/seckill/SeckillCountdown.jsx` | Create | Countdown display component |
| `components/seckill/SeckillGoodsCard.jsx` | Create | Product card with progress bar |
| `components/seckill/SeckillGoodsList.jsx` | Create | Horizontal scrollable product list |
| `components/seckill/SeckillBanner.jsx` | Create | Homepage entry banner |
| `components/seckill/SeckillOrderCard.jsx` | Create | Seckill order card for orders page |
| `components/index.js` | Modify | Export seckill components |
| `app/(main)/(client-layout)/page.jsx` | Modify | Add SeckillBanner above BestSellsSlider |
| `app/(main)/(client-layout)/seckill/layout.jsx` | Create | Seckill zone layout |
| `app/(main)/(client-layout)/seckill/page.jsx` | Create | Seckill zone page |
| `app/(main)/(client-layout)/seckill/item/page.jsx` | Create | Seckill product detail page |
| `app/(main)/profile/orders/page.jsx` | Modify | Add seckill order Tab |

---

### Task 1: Backend — Add `totalStock` field

**Files:**
- Modify: `../ibuy-portal-backend/prisma/schema.prisma:239-253`
- Modify: `../ibuy-portal-backend/src/mall-service/mall-service-seckill/seckill-goods/seckill-goods.service.ts:15-59`
- Modify: `../ibuy-portal-backend/src/mall-service/mall-service-seckill/seckill-goods/seckill-goods.controller.ts:17-31`

- [ ] **Step 1: Add `totalStock` to Prisma schema**

In `../ibuy-portal-backend/prisma/schema.prisma`, add `totalStock` field after `stockCount`:

```prisma
model IbuySeckillGoods {
  id           String   @id
  activityId   String   @map("activity_id")
  skuId        String   @map("sku_id")
  skuName      String   @map("sku_name")
  skuImage     String?  @map("sku_image")
  skuPrice     Int      @map("sku_price")     // 原价（分）
  seckillPrice Int      @map("seckill_price") // 秒杀价（分）
  stockCount   Int      @map("stock_count")   // 秒杀库存
  totalStock   Int      @map("total_stock")   // 初始总库存（新增）
  createTime   DateTime @default(now()) @map("create_time")

  @@unique([activityId, skuId])
  @@map("ibuy_seckill_goods")
}
```

- [ ] **Step 2: Update `seckill-goods.service.ts` — auto-set `totalStock` in `add()`**

In `../ibuy-portal-backend/src/mall-service/mall-service-seckill/seckill-goods/seckill-goods.service.ts`, update the `add()` method data parameter and create call:

```typescript
async add(data: {
  activityId: string;
  skuId: string;
  skuName: string;
  skuImage?: string;
  skuPrice: number;
  seckillPrice: number;
  stockCount: number;
}): Promise<any> {
```

Change the `prisma.ibuySeckillGoods.create` call to include `totalStock`:

```typescript
    const goods = await this.prisma.ibuySeckillGoods.create({
      data: {
        id,
        ...data,
        totalStock: data.stockCount,
      },
    });
```

- [ ] **Step 3: Generate Prisma client and run migration**

```bash
cd ../ibuy-portal-backend
pnpm db:generate
```

Then create and apply migration:

```bash
npx prisma migrate dev --name add-seckill-total-stock
```

- [ ] **Step 4: Verify backend starts**

```bash
cd ../ibuy-portal-backend
pnpm start:dev
```

Expected: Server starts without errors.

- [ ] **Step 5: Commit**

```bash
cd ../ibuy-portal-backend
git add prisma/schema.prisma src/mall-service/mall-service-seckill/seckill-goods/seckill-goods.service.ts
git commit -m "feat(seckill): add totalStock field to IbuySeckillGoods model"
```

---

### Task 2: `useCountdown` Hook

**Files:**
- Create: `hooks/useCountdown.js`
- Modify: `hooks/index.js`

- [ ] **Step 1: Create `hooks/useCountdown.js`**

```javascript
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
```

- [ ] **Step 2: Export from `hooks/index.js`**

Add this line to `hooks/index.js`:

```javascript
export { default as useCountdown } from './useCountdown'
```

- [ ] **Step 3: Commit**

```bash
git add hooks/useCountdown.js hooks/index.js
git commit -m "feat(seckill): add useCountdown hook"
```

---

### Task 3: RTK Query Seckill Service

**Files:**
- Create: `store/services/seckill.service.js`
- Modify: `store/services/api.js`
- Modify: `store/services/index.js`

- [ ] **Step 1: Add `'Seckill'` to tagTypes in `store/services/api.js`**

Change line 134:

```javascript
  tagTypes: ['User', 'Review', 'Details', 'Order', 'Product', 'Category', 'Slider', 'Banner', 'Seckill'],
```

- [ ] **Step 2: Create `store/services/seckill.service.js`**

```javascript
import apiSlice from './api'

export const seckillApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // 获取当前进行中的秒杀活动
    getActiveActivity: builder.query({
      query: () => ({
        url: '/v1/seckill/activity/active',
        method: 'GET',
      }),
      providesTags: ['Seckill'],
    }),

    // 获取活动下的秒杀商品列表
    getSeckillGoods: builder.query({
      query: ({ activityId }) => ({
        url: `/v1/seckill/goods/activity/${activityId}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Seckill', id: arg.activityId }],
    }),

    // 秒杀下单
    placeSeckillOrder: builder.mutation({
      query: ({ seckillGoodsId, activityId, receiverAddress }) => ({
        url: '/v1/seckill/order',
        method: 'POST',
        body: { seckillGoodsId, activityId, receiverAddress },
      }),
      invalidatesTags: ['Seckill'],
    }),

    // 查询秒杀订单详情
    getSeckillOrder: builder.query({
      query: ({ id }) => ({
        url: `/v1/seckill/order/${id}`,
        method: 'GET',
      }),
    }),

    // 查询用户秒杀订单列表
    getSeckillOrders: builder.mutation({
      query: ({ current = 1, pageSize = 10 }) => ({
        url: '/v1/seckill/order/list',
        method: 'POST',
        body: { pageParam: { current, pageSize } },
      }),
    }),
  }),
})

export const {
  useGetActiveActivityQuery,
  useGetSeckillGoodsQuery,
  usePlaceSeckillOrderMutation,
  useGetSeckillOrderQuery,
  useGetSeckillOrdersMutation,
} = seckillApiSlice
```

- [ ] **Step 3: Export from `store/services/index.js`**

Add this line to `store/services/index.js`:

```javascript
export * from './seckill.service'
```

- [ ] **Step 4: Verify frontend compiles**

```bash
npm run dev
```

Expected: No compilation errors, dev server starts.

- [ ] **Step 5: Commit**

```bash
git add store/services/seckill.service.js store/services/api.js store/services/index.js
git commit -m "feat(seckill): add RTK Query seckill service endpoints"
```

---

### Task 4: SeckillCountdown Component

**Files:**
- Create: `components/seckill/SeckillCountdown.jsx`

- [ ] **Step 1: Create `components/seckill/SeckillCountdown.jsx`**

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/seckill/SeckillCountdown.jsx
git commit -m "feat(seckill): add SeckillCountdown component"
```

---

### Task 5: SeckillGoodsCard Component

**Files:**
- Create: `components/seckill/SeckillGoodsCard.jsx`

- [ ] **Step 1: Create `components/seckill/SeckillGoodsCard.jsx`**

```jsx
'use client'

import Link from 'next/link'
import { ResponsiveImage } from 'components'
import { formatNumber } from 'utils'

const SeckillGoodsCard = ({ goods, disabled = false }) => {
  const { id, skuName, skuImage, skuPrice, seckillPrice, stockCount, totalStock } = goods

  const soldOut = stockCount === 0
  const almostGone = stockCount > 0 && stockCount <= 5
  const soldPercent = totalStock > 0 ? Math.round(((totalStock - stockCount) / totalStock) * 100) : 0

  const cardContent = (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-sm min-w-[200px] max-w-[240px] flex-shrink-0 flex-1 transition-all duration-200 ${
        soldOut || disabled ? 'opacity-60 cursor-default' : 'cursor-pointer hover:-translate-y-1 hover:shadow-md'
      }`}
    >
      {/* 商品图片 */}
      <div className="relative h-[180px] bg-gray-100">
        {skuImage ? (
          <ResponsiveImage dimensions="w-full h-full" src={skuImage} alt={skuName} className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">商品图片</div>
        )}
        {!soldOut && (
          <span className="absolute top-2 left-2 bg-[#ff4757] text-white text-[10px] font-bold px-2 py-0.5 rounded">
            秒杀
          </span>
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-base font-bold border-2 border-white px-4 py-1 rounded">已售罄</span>
          </div>
        )}
      </div>

      {/* 商品信息 */}
      <div className="p-3">
        <div className="text-sm text-gray-800 mb-2 line-clamp-2 h-10 leading-5">{skuName}</div>
        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className={`text-xl font-bold ${soldOut ? 'text-gray-400' : 'text-[#ff4757]'}`}>
            ¥{formatNumber(seckillPrice)}
          </span>
          <span className="text-xs text-gray-400 line-through">¥{formatNumber(skuPrice)}</span>
        </div>

        {/* 进度条 */}
        <div className="relative h-[18px] rounded-full overflow-hidden" style={{ background: soldOut ? '#eee' : '#ffe0e0' }}>
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${almostGone ? 'animate-pulse' : ''}`}
            style={{
              width: `${soldPercent}%`,
              background: soldOut ? '#999' : 'linear-gradient(90deg, #ff4757, #ff6348)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold">
            {soldOut ? '已售罄' : `已抢 ${soldPercent}%`}
          </div>
        </div>
      </div>
    </div>
  )

  if (soldOut || disabled) return cardContent

  return <Link href={`/seckill/item?id=${id}`}>{cardContent}</Link>
}

export default SeckillGoodsCard
```

- [ ] **Step 2: Commit**

```bash
git add components/seckill/SeckillGoodsCard.jsx
git commit -m "feat(seckill): add SeckillGoodsCard component with progress bar"
```

---

### Task 6: SeckillGoodsList Component

**Files:**
- Create: `components/seckill/SeckillGoodsList.jsx`

- [ ] **Step 1: Create `components/seckill/SeckillGoodsList.jsx`**

```jsx
'use client'

import SeckillGoodsCard from './SeckillGoodsCard'

const SeckillGoodsList = ({ goods = [], disabled = false }) => {
  // 已售罄的排到末尾
  const sorted = [...goods].sort((a, b) => {
    if (a.stockCount === 0 && b.stockCount !== 0) return 1
    if (a.stockCount !== 0 && b.stockCount === 0) return -1
    return 0
  })

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
      {sorted.map(item => (
        <SeckillGoodsCard key={item.id} goods={item} disabled={disabled} />
      ))}
    </div>
  )
}

export default SeckillGoodsList
```

- [ ] **Step 2: Commit**

```bash
git add components/seckill/SeckillGoodsList.jsx
git commit -m "feat(seckill): add SeckillGoodsList horizontal scrollable list"
```

---

### Task 7: SeckillBanner — Homepage Entry Module

**Files:**
- Create: `components/seckill/SeckillBanner.jsx`
- Modify: `components/index.js`
- Modify: `app/(main)/(client-layout)/page.jsx`

- [ ] **Step 1: Create `components/seckill/SeckillBanner.jsx`**

```jsx
'use client'

import Link from 'next/link'
import { ResponsiveImage } from 'components'
import SeckillCountdown from './SeckillCountdown'
import { useGetActiveActivityQuery, useGetSeckillGoodsQuery } from '@/store/services'
import { formatNumber } from 'utils'

const SeckillBanner = () => {
  const { data: activities, isSuccess } = useGetActiveActivityQuery()

  const activity = isSuccess && activities?.length > 0 ? activities[0] : null

  const { data: goods } = useGetSeckillGoodsQuery(
    { activityId: activity?.id },
    { skip: !activity }
  )

  if (!activity) return null

  const previewGoods = (goods || []).slice(0, 3)

  return (
    <Link href={`/seckill?activityId=${activity.id}`}>
      <div className="rounded-xl p-5 flex items-center gap-6 cursor-pointer transition-shadow hover:shadow-lg"
        style={{ background: 'linear-gradient(135deg, #ff4757, #ff6348)' }}
      >
        {/* 左侧：活动信息 + 倒计时 */}
        <div className="flex-1 text-white">
          <div className="text-xl font-bold mb-1">⚡ 限时秒杀</div>
          <div className="text-sm opacity-90 mb-3">
            {activity.name}{activity.intro ? ` · ${activity.intro}` : ''}
          </div>
          <SeckillCountdown endTime={activity.endTime} size="md" />
        </div>

        {/* 右侧：商品预览 */}
        <div className="hidden md:flex gap-2">
          {previewGoods.map(item => (
            <div
              key={item.id}
              className="bg-white/20 rounded-lg p-2 text-center w-[80px]"
            >
              <div className="w-[56px] h-[56px] mx-auto mb-1 bg-white/30 rounded overflow-hidden">
                {item.skuImage && (
                  <ResponsiveImage
                    dimensions="w-full h-full"
                    src={item.skuImage}
                    alt={item.skuName}
                  />
                )}
              </div>
              <div className="text-xs font-bold text-white">
                ¥{formatNumber(item.seckillPrice)}
              </div>
              <div className="text-[10px] text-white/70 line-through">
                ¥{formatNumber(item.skuPrice)}
              </div>
            </div>
          ))}
        </div>

        {/* 箭头 */}
        <div className="text-2xl text-white/60">›</div>
      </div>
    </Link>
  )
}

export default SeckillBanner
```

- [ ] **Step 2: Add seckill exports to `components/index.js`**

Add these lines at the bottom of `components/index.js`:

```javascript
//* SECKILL COMPONENTS
export { default as SeckillBanner } from './seckill/SeckillBanner'
export { default as SeckillCountdown } from './seckill/SeckillCountdown'
export { default as SeckillGoodsCard } from './seckill/SeckillGoodsCard'
export { default as SeckillGoodsList } from './seckill/SeckillGoodsList'
export { default as SeckillOrderCard } from './seckill/SeckillOrderCard'
```

Note: `SeckillOrderCard` doesn't exist yet — it will be created in Task 10. This forward-export is safe because it's only imported when used.

- [ ] **Step 3: Add SeckillBanner to homepage**

In `app/(main)/(client-layout)/page.jsx`, change the content to:

```jsx
import { BestSellsSlider, SeckillBanner } from '@/components'
import { enSiteTitle, siteTitle } from '@/utils'

export const metadata = {
  title: `${siteTitle} | ${enSiteTitle}`,
}

export default async function Home({ searchParams }) {
  return (
    <main className="min-h-screen container space-y-24">
      <div className="py-4 mx-auto space-y-24 xl:mt-36">
        <SeckillBanner />
        <BestSellsSlider />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify homepage renders**

```bash
npm run dev
```

Visit `http://localhost:3000` — SeckillBanner should render if there's an active activity, or be invisible if not.

- [ ] **Step 5: Commit**

```bash
git add components/seckill/SeckillBanner.jsx components/index.js "app/(main)/(client-layout)/page.jsx"
git commit -m "feat(seckill): add SeckillBanner homepage entry module"
```

---

### Task 8: Seckill Zone Page

**Files:**
- Create: `app/(main)/(client-layout)/seckill/layout.jsx`
- Create: `app/(main)/(client-layout)/seckill/page.jsx`

- [ ] **Step 1: Create `app/(main)/(client-layout)/seckill/layout.jsx`**

```jsx
export const metadata = {
  title: '限时秒杀 | IBuy',
}

export default function SeckillLayout({ children }) {
  return <>{children}</>
}
```

- [ ] **Step 2: Create `app/(main)/(client-layout)/seckill/page.jsx`**

```jsx
'use client'

import { useUrlQuery } from '@/hooks'
import useCountdown from '@/hooks/useCountdown'
import { useGetActiveActivityQuery, useGetSeckillGoodsQuery } from '@/store/services'
import { SeckillCountdown, SeckillGoodsList } from 'components'

const SeckillPage = () => {
  const query = useUrlQuery()
  const activityIdFromUrl = query?.activityId?.toString()

  // 获取活动
  const { data: activities, isSuccess: activityLoaded } = useGetActiveActivityQuery()
  const activity = activityLoaded
    ? activityIdFromUrl
      ? activities?.find(a => a.id === activityIdFromUrl) || activities?.[0]
      : activities?.[0]
    : null

  // 获取商品
  const { data: goods, isLoading: goodsLoading } = useGetSeckillGoodsQuery(
    { activityId: activity?.id },
    { skip: !activity }
  )

  // 倒计时
  const { isExpired } = useCountdown(activity?.endTime)

  if (!activityLoaded) {
    return (
      <main className="min-h-screen container mx-auto py-8">
        <div className="text-center text-gray-500">加载中...</div>
      </main>
    )
  }

  if (!activity) {
    return (
      <main className="min-h-screen container mx-auto py-8">
        <div className="text-center text-gray-500 text-lg">暂无进行中的秒杀活动</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      {/* 顶部活动横幅 */}
      <div
        className="py-5 px-8 flex items-center gap-6"
        style={{ background: 'linear-gradient(135deg, #ff4757, #ff6348)' }}
      >
        <div className="text-white">
          <div className="text-2xl font-bold">⚡ 限时秒杀</div>
          <div className="text-sm opacity-85 mt-1">
            {activity.name}{activity.intro ? ` · ${activity.intro}` : ''}
          </div>
        </div>
        {isExpired ? (
          <span className="text-white/80 text-sm font-bold">活动已结束</span>
        ) : (
          <SeckillCountdown endTime={activity.endTime} size="lg" />
        )}
      </div>

      {/* 商品区域 */}
      <div className="bg-gray-100 py-6 px-8">
        {goodsLoading ? (
          <div className="text-center text-gray-400 py-12">加载商品中...</div>
        ) : goods?.length > 0 ? (
          <SeckillGoodsList goods={goods} disabled={isExpired} />
        ) : (
          <div className="text-center text-gray-400 py-12">暂无秒杀商品</div>
        )}
      </div>
    </main>
  )
}

export default SeckillPage
```

- [ ] **Step 3: Verify seckill zone page renders**

```bash
npm run dev
```

Visit `http://localhost:3000/seckill` — should show activity banner + goods list if there's active data, or "暂无进行中的秒杀活动" if not.

- [ ] **Step 4: Commit**

```bash
git add "app/(main)/(client-layout)/seckill/layout.jsx" "app/(main)/(client-layout)/seckill/page.jsx"
git commit -m "feat(seckill): add seckill zone page with countdown and goods list"
```

---

### Task 9: Seckill Product Detail Page

**Files:**
- Create: `app/(main)/(client-layout)/seckill/item/page.jsx`

- [ ] **Step 1: Create `app/(main)/(client-layout)/seckill/item/page.jsx`**

```jsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ImageGallery, AddressSelector } from 'components'
import SeckillCountdown from '@/components/seckill/SeckillCountdown'
import useCountdown from '@/hooks/useCountdown'
import { useUrlQuery, useUserInfo } from '@/hooks'
import { useGetActiveActivityQuery, useGetSeckillGoodsQuery, usePlaceSeckillOrderMutation } from '@/store/services'
import { useAppSelector } from '@/hooks'
import { formatNumber } from 'utils'

const SeckillItemPage = () => {
  const router = useRouter()
  const query = useUrlQuery()
  const goodsId = query?.id?.toString() ?? ''
  const userInfo = useUserInfo()
  const selectedAddress = useAppSelector(state => state.address.currentSelectedAddress)

  // 获取活动和商品
  const { data: activities } = useGetActiveActivityQuery()
  const activity = activities?.[0]
  const { data: goodsList } = useGetSeckillGoodsQuery(
    { activityId: activity?.id },
    { skip: !activity }
  )
  const goods = goodsList?.find(g => g.id === goodsId)

  // 倒计时
  const { hours, minutes, seconds, isExpired } = useCountdown(activity?.endTime)

  // 下单
  const [placeSeckillOrder, { isLoading: isOrdering }] = usePlaceSeckillOrderMutation()
  const [orderPlaced, setOrderPlaced] = useState(false)

  const soldOut = goods?.stockCount === 0
  const soldPercent = goods && goods.totalStock > 0
    ? Math.round(((goods.totalStock - goods.stockCount) / goods.totalStock) * 100)
    : 0

  const handleSeckill = async () => {
    if (!userInfo) {
      router.push(`/login?redirectTo=/seckill/item?id=${goodsId}`)
      return
    }
    if (!selectedAddress) {
      toast.error('请先选择收货地址')
      return
    }

    try {
      setOrderPlaced(true)
      const result = await placeSeckillOrder({
        seckillGoodsId: goodsId,
        activityId: activity.id,
        receiverAddress: `${selectedAddress.address} ${selectedAddress.contact} ${selectedAddress.phone}`,
      }).unwrap()

      toast.success('秒杀成功！正在跳转订单页...')
      router.push(`/profile/orders?activeKey=seckill`)
    } catch (err) {
      toast.error(err?.message || '秒杀失败，请重试')
      setOrderPlaced(false)
    }
  }

  // 按钮状态
  const getButtonState = () => {
    if (orderPlaced || isOrdering) return { text: '排队中...', disabled: true, className: 'bg-amber-500 cursor-not-allowed' }
    if (isExpired) return { text: '活动已结束', disabled: true, className: 'bg-gray-400 cursor-not-allowed' }
    if (soldOut) return { text: '已售罄', disabled: true, className: 'bg-gray-400 cursor-not-allowed' }
    return { text: '立即秒杀', disabled: false, className: 'cursor-pointer' }
  }

  const btn = getButtonState()

  if (!goods) {
    return (
      <main className="container mx-auto py-8">
        <div className="text-center text-gray-500">加载中...</div>
      </main>
    )
  }

  return (
    <main className="container mx-auto py-4 space-y-8">
      <div className="lg:grid lg:grid-cols-9 lg:gap-x-6 lg:px-6 lg:py-6">
        {/* 左侧：商品图片 */}
        <div className="lg:col-span-5">
          <ImageGallery
            images={goods.skuImage ? [goods.skuImage] : []}
            discount={0}
            inStock={goods.stockCount}
            productName={goods.skuName}
          />
        </div>

        {/* 右侧：商品信息 + 秒杀操作 */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* 商品标题 */}
          <h1 className="text-2xl font-semibold text-gray-800 leading-snug">{goods.skuName}</h1>

          {/* 秒杀价格区 */}
          <div className="bg-[#fff5f5] border border-[#ffd0d0] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#ff4757] text-white text-xs font-bold px-2 py-0.5 rounded">秒杀价</span>
              {!isExpired && (
                <div className="flex items-center gap-1 text-xs text-[#ff4757]">
                  <span>距结束</span>
                  <span className="bg-[#ff4757] text-white px-1.5 py-0.5 rounded font-mono font-bold">{hours}</span>:
                  <span className="bg-[#ff4757] text-white px-1.5 py-0.5 rounded font-mono font-bold">{minutes}</span>:
                  <span className="bg-[#ff4757] text-white px-1.5 py-0.5 rounded font-mono font-bold">{seconds}</span>
                </div>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#ff4757]">¥{formatNumber(goods.seckillPrice)}</span>
              <span className="text-sm text-gray-400 line-through">原价 ¥{formatNumber(goods.skuPrice)}</span>
            </div>
            {/* 进度条 */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>已抢 {soldPercent}%</span>
                <span>仅剩 {goods.stockCount} 件</span>
              </div>
              <div className="relative h-3 bg-[#ffd0d0] rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${soldPercent}%`,
                    background: 'linear-gradient(90deg, #ff4757, #ff6348)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 收货地址选择器 */}
          <AddressSelector />

          {/* 限购提示 */}
          <div className="text-xs text-gray-400 flex items-center gap-1.5">
            <span className="text-amber-500">⚠</span>
            每人限购 1 件 · 下单后 5 分钟内未支付将自动取消
          </div>

          {/* 秒杀按钮 */}
          <button
            onClick={handleSeckill}
            disabled={btn.disabled}
            className={`w-full py-3.5 rounded-lg text-lg font-bold text-white tracking-wider ${btn.className}`}
            style={!btn.disabled ? { background: 'linear-gradient(135deg, #ff4757, #ff6348)' } : undefined}
          >
            {btn.text}
          </button>
        </div>
      </div>
    </main>
  )
}

export default SeckillItemPage
```

- [ ] **Step 2: Create directory**

```bash
mkdir -p "app/(main)/(client-layout)/seckill/item"
```

- [ ] **Step 3: Verify page renders**

```bash
npm run dev
```

Visit `http://localhost:3000/seckill/item?id=xxx` (with a valid seckill goods ID). Should display product detail with countdown, price area, address selector, and seckill button.

- [ ] **Step 4: Commit**

```bash
git add "app/(main)/(client-layout)/seckill/item/page.jsx"
git commit -m "feat(seckill): add seckill product detail page with order flow"
```

---

### Task 10: SeckillOrderCard + Orders Page Tab Integration

**Files:**
- Create: `components/seckill/SeckillOrderCard.jsx`
- Modify: `app/(main)/profile/orders/page.jsx`

- [ ] **Step 1: Create `components/seckill/SeckillOrderCard.jsx`**

```jsx
'use client'

import { ResponsiveImage } from 'components'
import useCountdown from '@/hooks/useCountdown'
import { useGetAlipayUrlMutation } from '@/store/services'
import { formatNumber } from 'utils'
import moment from 'moment-jalaali'

const OrderStatusMap = {
  '0': { label: '待支付', color: 'bg-amber-500' },
  '1': { label: '已支付', color: 'bg-green-500' },
  '2': { label: '已关闭', color: 'bg-gray-400' },
}

const PayCountdown = ({ createTime }) => {
  // 5 分钟超时
  const payDeadline = new Date(new Date(createTime).getTime() + 5 * 60 * 1000)
  const { minutes, seconds, isExpired } = useCountdown(payDeadline)

  if (isExpired) return <span className="text-xs text-gray-400">已超时</span>

  return (
    <span className="text-xs text-amber-600 font-mono">
      剩余 {minutes}:{seconds}
    </span>
  )
}

const SeckillOrderCard = ({ order }) => {
  const status = OrderStatusMap[order.orderStatus] || OrderStatusMap['2']

  const [getAlipayUrl, { isLoading: paying }] = useGetAlipayUrlMutation()

  const handlePay = async () => {
    try {
      const result = await getAlipayUrl({
        orderId: order.id,
        queueName: 'SEC_KILL_ORDER_PAY',
      }).unwrap()

      if (result?.url) {
        window.location.href = result.url
      }
    } catch (err) {
      console.error('支付失败', err)
    }
  }

  return (
    <div className="py-4 space-y-3 border-b border-gray-200 lg:border lg:rounded-lg">
      {/* 顶部：状态 + 时间 */}
      <div className="flex items-center justify-between lg:px-3">
        <div className="flex items-center gap-x-2">
          <span className={`w-2 h-2 rounded-full ${status.color}`} />
          <span className="text-sm text-black">{status.label}</span>
          {order.orderStatus === '0' && <PayCountdown createTime={order.createTime} />}
        </div>
        <span className="text-sm text-gray-400">
          {moment(order.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </div>

      {/* 订单号 + 金额 */}
      <div className="flex flex-wrap justify-between lg:px-3">
        <div>
          <span className="text-gray-500">订单号:</span>
          <span className="ml-2 text-sm text-black">{order.id}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="text-xl font-bold text-red-600">
            ¥{formatNumber(order.money)}
          </span>
          {order.orderStatus === '0' && (
            <button
              onClick={handlePay}
              disabled={paying}
              className="px-4 py-1.5 bg-[#ff4757] text-white text-sm font-bold rounded hover:bg-[#ff6348] disabled:opacity-50"
            >
              {paying ? '跳转中...' : '去支付'}
            </button>
          )}
        </div>
      </div>

      {/* 收货地址 */}
      {order.receiverAddress && (
        <div className="text-sm text-gray-500 lg:px-3">
          收货地址: {order.receiverAddress}
        </div>
      )}
    </div>
  )
}

export default SeckillOrderCard
```

- [ ] **Step 2: Update `app/(main)/profile/orders/page.jsx` — add seckill tab**

Replace the full file content with:

```jsx
'use client'
import { useChangeRoute } from 'hooks'

import {
  OrderCard,
  Pagination,
  ShowWrapper,
  EmptyOrdersList,
  PageContainer,
  OrderSkeleton,
  Tabs,
  SeckillOrderCard,
} from 'components'

import { useGetOrdersQuery, useGetSeckillOrdersMutation } from '@/store/services'

import { useTitle, useUrlQuery } from '@/hooks'
import { useState, useEffect } from 'react'

const Orders = () => {
  useTitle('订单管理')
  const query = useUrlQuery()
  const changeRoute = useChangeRoute()

  const [activeTab, setActiveTab] = useState(query.activeKey || 'all')

  const isSeckillTab = activeTab === 'seckill'

  // 普通订单
  const { data, isSuccess, isFetching, error, isError, refetch } = useGetOrdersQuery(
    {
      pageSize: 5,
      current: query.page ? +query.page : 1,
      orderStatus: activeTab === 'all' ? undefined : activeTab,
    },
    { skip: isSeckillTab }
  )

  const orders = data?.items || []
  const total = data?.total || 0

  // 秒杀订单
  const [fetchSeckillOrders, {
    data: seckillData,
    isSuccess: seckillSuccess,
    isLoading: seckillLoading,
    error: seckillError,
    isError: seckillIsError,
  }] = useGetSeckillOrdersMutation()

  useEffect(() => {
    if (isSeckillTab) {
      fetchSeckillOrders({ current: query.page ? +query.page : 1, pageSize: 5 })
    }
  }, [isSeckillTab, query.page])

  const seckillOrders = seckillData?.items || []
  const seckillTotal = seckillData?.total || 0

  const handleTabChange = index => {
    changeRoute({ activeKey: index })
    setActiveTab(index)
  }

  return (
    <main id="profileOrders">
      <Tabs currentActiveKey={activeTab} onTabChange={handleTabChange}>
        <Tabs.TabPane activeKey="all" label="所有订单"></Tabs.TabPane>
        <Tabs.TabPane activeKey="0" label="待付款"></Tabs.TabPane>
        <Tabs.TabPane activeKey="1" label="待发货"></Tabs.TabPane>
        <Tabs.TabPane activeKey="2" label="待收货"></Tabs.TabPane>
        <Tabs.TabPane activeKey="3" label="待评价"></Tabs.TabPane>
        <Tabs.TabPane activeKey="4" label="退款/售后"></Tabs.TabPane>
        <Tabs.TabPane activeKey="seckill" label="🔥秒杀订单"></Tabs.TabPane>
      </Tabs>

      {isSeckillTab ? (
        <ShowWrapper
          error={seckillError}
          isError={seckillIsError}
          refetch={() => fetchSeckillOrders({ current: 1, pageSize: 5 })}
          isFetching={seckillLoading}
          isSuccess={seckillSuccess}
          dataLength={seckillTotal}
          emptyComponent={<EmptyOrdersList />}
          loadingComponent={<OrderSkeleton />}
        >
          <div className="px-4 py-3 space-y-3">
            {seckillOrders.map(item => (
              <SeckillOrderCard key={item.id} order={item} />
            ))}
          </div>
        </ShowWrapper>
      ) : (
        <ShowWrapper
          error={error}
          isError={isError}
          refetch={refetch}
          isFetching={isFetching}
          isSuccess={isSuccess}
          dataLength={total}
          emptyComponent={<EmptyOrdersList />}
          loadingComponent={<OrderSkeleton />}
        >
          <div className="px-4 py-3 space-y-3">
            {orders.map(item => (
              <OrderCard key={item.id} order={item} />
            ))}
          </div>
        </ShowWrapper>
      )}
    </main>
  )
}
export default Orders
```

- [ ] **Step 3: Verify orders page renders with seckill tab**

```bash
npm run dev
```

Visit `http://localhost:3000/profile/orders?activeKey=seckill` — should show the seckill order tab.

- [ ] **Step 4: Commit**

```bash
git add components/seckill/SeckillOrderCard.jsx "app/(main)/profile/orders/page.jsx"
git commit -m "feat(seckill): add SeckillOrderCard and integrate seckill tab into orders page"
```

---

### Task 11: Final Integration Verification

- [ ] **Step 1: Verify full flow — homepage banner**

Visit `http://localhost:3000`. If there's an active seckill activity in the database, the SeckillBanner should appear above BestSellsSlider. If no activity, banner should be invisible.

- [ ] **Step 2: Verify full flow — seckill zone page**

Click the banner or visit `http://localhost:3000/seckill`. Should show activity header with countdown + horizontal goods list.

- [ ] **Step 3: Verify full flow — seckill detail page**

Click a goods card. Should navigate to `/seckill/item?id=xxx` showing product image, seckill price area with countdown, address selector, and seckill button.

- [ ] **Step 4: Verify full flow — seckill order**

Click "立即秒杀" with an address selected. On success, should redirect to orders page with seckill tab active.

- [ ] **Step 5: Verify full flow — orders tab**

Visit `http://localhost:3000/profile/orders?activeKey=seckill`. Should show seckill orders with status labels and "去支付" button for pending orders.

- [ ] **Step 6: Final commit (if any remaining changes)**

```bash
git status
# If any unstaged changes, stage and commit
```
