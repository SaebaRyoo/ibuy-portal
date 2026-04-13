# 秒杀 UI 设计文档

C 端用户秒杀功能的前端实现方案。后端秒杀模块已完成（NestJS + Redis Lua + RabbitMQ），本文档聚焦前端 UI 和少量后端字段补充。

## 技术栈

- 前端：Next.js 14 / React 18 / Redux Toolkit (RTK Query) / Tailwind CSS / Headless UI / Swiper
- 后端（已有）：NestJS / Prisma / PostgreSQL / Redis / RabbitMQ
- 方案：纯轮询，无 WebSocket，零新依赖

## 页面结构与路由

```
app/(main)/(client-layout)/
├── page.jsx                          # 首页 — 新增 SeckillBanner 模块
└── seckill/
    ├── layout.jsx                    # 秒杀专区布局
    ├── page.jsx                      # 秒杀专区页
    └── item/
        └── page.jsx                  # 秒杀商品详情页

app/(main)/profile/
└── orders/
    └── page.jsx                      # 现有订单页 — 新增秒杀订单 Tab

components/
└── seckill/
    ├── SeckillBanner.jsx             # 首页秒杀入口模块
    ├── SeckillCountdown.jsx          # 倒计时组件
    ├── SeckillGoodsCard.jsx          # 秒杀商品卡片（含进度条）
    ├── SeckillGoodsList.jsx          # 秒杀商品横向列表
    └── SeckillOrderCard.jsx          # 秒杀订单卡片

store/services/
└── seckill.service.js                # 秒杀 RTK Query endpoints

hooks/
└── useCountdown.js                   # 倒计时 hook
```

## 1. 首页秒杀入口模块 — SeckillBanner

**样式**：横幅卡片型。红色渐变背景（`linear-gradient(135deg, #ff4757, #ff6348)`），左侧展示活动名称 + 倒计时，右侧预览 2-3 个秒杀商品缩略图（图片、秒杀价、原价划线），整体可点击跳转秒杀专区。右侧末尾 `›` 箭头。

**位置**：首页 `<BestSellsSlider />` 上方。

**行为逻辑**：
- 页面加载调用 `GET /v1/seckill/activity/active` 获取当前进行中的活动
- 无活动时整个模块不渲染（返回 null）
- 有活动时展示第一个活动的信息，并调用 `GET /v1/seckill/goods/activity/:activityId` 获取全量商品，前端截取前 3 个作为缩略预览
- 倒计时基于活动 `endTime`，本地 `setInterval` 每秒更新
- 倒计时归零后自动隐藏模块
- 点击跳转 `/seckill?activityId=xxx`

**倒计时显示格式**：`HH : MM : SS`，每个数字块黑色半透明背景 `rgba(0,0,0,0.3)`，白色粗体等宽字体。

## 2. 秒杀专区页 — /seckill

**布局**（桌面端横向）：
- **顶部**：全宽红色渐变横幅，左侧活动名称 + 简介 + 倒计时，一行式水平排布
- **下方**：灰色背景区域（`#f5f5f5`），商品卡片横向排列（flex row），超出时可横向滚动（使用 Swiper，项目已有依赖）

**数据获取**：
- URL 参数 `activityId` → `GET /v1/seckill/activity/active` 获取活动信息
- `GET /v1/seckill/goods/activity/:activityId` 获取该活动下所有秒杀商品
- 已售罄商品（`stockCount = 0`）自动排到列表末尾

**活动结束处理**：倒计时归零 → 展示"活动已结束"提示，商品卡片不可点击。

## 3. 秒杀商品卡片 — SeckillGoodsCard

**卡片元素（从上到下）**：
- 商品图片（左上角红色"秒杀"标签）
- 商品名称（最多 2 行，超出省略）
- 秒杀价（红色 `#ff4757` 大号粗体）+ 原价（灰色划线）
- 库存进度条

**库存进度条**：
- 高度 18px，圆角胶囊形
- 背景 `#ffe0e0`，前景渐变 `linear-gradient(90deg, #ff4757, #ff6348)`
- 进度文字居中白色粗体：`已抢 XX%`
- 计算公式：`(totalStock - stockCount) / totalStock * 100`

**卡片三种状态**：

| 状态 | 条件 | 表现 |
|------|------|------|
| 可抢购 | stockCount > 5 | 正常展示，hover 上浮 + 阴影加深，可点击 |
| 即将售罄 | 0 < stockCount ≤ 5 | 进度条闪烁动画，增加紧迫感 |
| 已售罄 | stockCount = 0 | 卡片半透明（opacity: 0.6），图片覆盖半透明遮罩 + "已售罄"文字，进度条变灰，不可点击 |

**点击行为**：跳转 `/seckill/item?id=xxx`（秒杀商品 id）。

## 4. 秒杀商品详情页 — /seckill/item

**布局**：复用现有商品详情页的左右两栏结构（`lg:grid lg:grid-cols-9`）。

**左侧**（5 列）：
- 商品大图 + 左上角"⚡ 秒杀"标签
- 底部缩略图行（复用现有 ImageGallery 组件，图片来源为 SKU 的 images 字段）

**右侧**（4 列，从上到下）：
1. **商品标题**
2. **秒杀价格区**（粉色背景卡片 `#fff5f5`，边框 `#ffd0d0`）：
   - 第一行：红色"秒杀价"标签 + 倒计时（内联小号）
   - 第二行：大号秒杀价 ¥XX + 灰色划线原价
   - 第三行：进度条 + 左侧"已抢 XX%"文字 + 右侧"仅剩 XX 件"文字
3. **收货地址选择器**：展示用户默认地址（调用现有 address API），右侧"切换 ›"打开地址选择弹窗（复用现有地址组件）
4. **限购提示**：`⚠ 每人限购 1 件 · 下单后 5 分钟内未支付将自动取消`
5. **秒杀按钮**：红色渐变全宽按钮

**秒杀按钮四种状态**：

| 状态 | 文字 | 样式 | 触发条件 |
|------|------|------|----------|
| 正常可抢 | 立即秒杀 | 红色渐变，可点击 | 默认 |
| 已售罄 | 已售罄 | 灰色，禁用 | stockCount = 0 |
| 已结束 | 活动已结束 | 灰色，禁用 | 倒计时归零 |
| 排队中 | 排队中... | 橙色，禁用 | 下单请求发出后 |

**下单流程**：
1. 用户点击"立即秒杀"→ 按钮变为"排队中..."
2. 前端校验：是否已登录（未登录跳登录页）、是否已选地址
3. 调用 `POST /v1/seckill/order`，body: `{ seckillGoodsId, activityId, receiverAddress }`
4. 成功（返回 `{ orderId, status: 'queued' }`）→ 跳转到订单页面
5. 失败（已售罄 / 限购 / 活动结束）→ Toast 提示错误信息，按钮恢复

## 5. 秒杀订单 Tab — 融入现有订单页

**改动方式**：在现有 `orders/page.jsx` 的 `<Tabs>` 中新增一个 TabPane：

```
<Tabs.TabPane activeKey="seckill" label="🔥秒杀订单"></Tabs.TabPane>
```

**行为**：
- 切换到"秒杀订单" Tab 时，调用 `POST /v1/seckill/order/list` 获取当前用户的秒杀订单
- 复用现有 `ShowWrapper`、`EmptyOrdersList`、`OrderSkeleton` 组件
- 使用新的 `SeckillOrderCard` 组件渲染每个秒杀订单

**SeckillOrderCard 展示内容**：
- 商品图片 + 商品名
- 秒杀价
- 订单状态标签：待支付（橙色）/ 已支付（绿色）/ 已关闭（灰色）
- 待支付订单：显示"去支付"按钮 + 剩余支付时间倒计时（基于 createTime + 5 分钟计算）
- "去支付"点击后跳转现有支付宝支付流程

## 6. useCountdown Hook

```typescript
function useCountdown(endTime: Date): { hours, minutes, seconds, isExpired }
```

- 接收活动结束时间，返回格式化的时分秒和是否过期标志
- 内部使用 `setInterval` 每秒更新
- 组件卸载时 `clearInterval`
- `isExpired = true` 时停止计时

被 SeckillBanner、秒杀专区页、秒杀详情页三处复用。

## 7. RTK Query Endpoints — seckill.service.js

```javascript
// 遵循现有 product.service.js 模式
const seckillApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getActiveActivity:   builder.query,    // GET  /v1/seckill/activity/active
    getSeckillGoods:     builder.query,    // GET  /v1/seckill/goods/activity/:activityId
    placeSeckillOrder:   builder.mutation, // POST /v1/seckill/order
    getSeckillOrder:     builder.query,    // GET  /v1/seckill/order/:id
    getSeckillOrders:    builder.mutation, // POST /v1/seckill/order/list
  }),
})
```

tagTypes 新增 `'Seckill'`（在 api.js 中注册）。

## 8. 后端变更

仅 1 处改动：`IbuySeckillGoods` 模型新增 `totalStock` 字段。

```prisma
model IbuySeckillGoods {
  ...
  stockCount   Int      @map("stock_count")
  totalStock   Int      @map("total_stock")    // 新增：初始总库存
  ...
}
```

**影响范围**：
- `prisma/schema.prisma`：新增字段
- `seckill-goods.service.ts` 的 `add()` 方法：`totalStock = stockCount`
- `seckill-goods.controller.ts` 的 `add()` body 类型：新增 `totalStock` 或自动赋值
- 数据库迁移：`pnpm db:generate` + `prisma migrate`

## 数据流总览

```
首页 SeckillBanner
  └─ getActiveActivity → 有活动? 渲染入口 : 隐藏
  └─ getSeckillGoods → 全量商品，前端截取前 3 个作缩略图预览
  └─ 点击 → /seckill?activityId=xxx

秒杀专区页
  └─ getActiveActivity → 活动信息 + 倒计时
  └─ getSeckillGoods → 商品卡片横向列表
  └─ 点击卡片 → /seckill/item?id=xxx

秒杀详情页
  └─ getSeckillGoods → 商品信息(从缓存或单独获取)
  └─ 用户地址(复用现有 address API)
  └─ 点击秒杀 → placeSeckillOrder → 成功跳转订单页 / 失败 Toast

订单页(秒杀 Tab)
  └─ getSeckillOrders → 秒杀订单列表
  └─ 去支付 → 复用现有支付宝支付流程
```
