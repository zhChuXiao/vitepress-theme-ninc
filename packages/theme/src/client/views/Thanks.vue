<template>
  <div class="thanks">
    <Suspense>
      <Banner
        type="page"
        title="赞赏名单"
        desc="感谢每一位支持者"
        footer="赞赏金额将全部用于开源项目维护"
      >
        <template #footer-slot>
          <span v-if="list.length" class="total-badge s-card">
            <i class="iconfont icon-people" />
            {{ list.length }} 位支持者
          </span>
        </template>
      </Banner>
    </Suspense>

    <!-- 统计概览 -->
    <div v-if="list.length" class="summary s-card">
      <div class="summary-item">
        <span class="num">{{ list.length }}</span>
        <span class="label">赞赏人数</span>
      </div>
      <div class="summary-divider" />
      <div class="summary-item">
        <span class="num">¥{{ totalAmount }}</span>
        <span class="label">累计金额</span>
      </div>
      <div class="summary-divider" />
      <div class="summary-item">
        <span class="num">{{ wechatCount }}</span>
        <span class="label">微信</span>
      </div>
      <div class="summary-divider" />
      <div class="summary-item">
        <span class="num">{{ alipayCount }}</span>
        <span class="label">支付宝</span>
      </div>
    </div>

    <!-- 赞赏名单列表 -->
    <MacCard v-if="list.length">
      <template #title>
        <h3 class="card-title">
          <i class="iconfont icon-reward" />
          全部赞赏者
        </h3>
      </template>
      <div class="supporter-list">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="supporter-item"
        >
          <div class="avatar" :style="{ backgroundColor: avatarColor(item.name) }">
            {{ (item.name || '?').charAt(0).toUpperCase() }}
          </div>
          <div class="info">
            <div class="info-top">
              <span class="name">{{ item.name }}</span>
              <span v-if="item.method" class="method-badge" :class="item.method">
                <i :class="item.method === 'wechat' ? 'iconfont icon-wechat-pay' : 'iconfont icon-alipay'" />
                {{ item.method === 'wechat' ? '微信' : '支付宝' }}
              </span>
            </div>
            <div class="info-bottom">
              <span v-if="item.message" class="message">{{ item.message }}</span>
              <span v-if="item.date" class="date">{{ item.date }}</span>
            </div>
          </div>
          <div v-if="item.amount" class="amount">¥{{ item.amount }}</div>
        </div>
      </div>
    </MacCard>

    <!-- 空状态 -->
    <MacCard v-else>
      <template #title>
        <h3 class="card-title">
          <i class="iconfont icon-reward" />
          全部赞赏者
        </h3>
      </template>
      <div class="empty">
        <i class="iconfont icon-reward" />
        <p>还没有赞赏者，成为第一位支持者吧！</p>
      </div>
    </MacCard>

    <!-- 底部打赏入口 -->
    <RewardBtn v-if="rewardData.enable" :showJump="false" />
  </div>
</template>

<script setup>
const Banner = defineAsyncComponent(() => import('../components/Banner.vue'))
const RewardBtn = defineAsyncComponent(() => import('../components/RewardBtn.vue'))

const { theme } = useData()
const { rewardData } = theme.value

// 赞赏名单数据
const list = computed(() => rewardData?.list || [])

// 累计金额
const totalAmount = computed(() => {
  const total = list.value.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  return total.toFixed(2)
})

// 支付方式统计
const wechatCount = computed(() => list.value.filter(i => i.method === 'wechat').length)
const alipayCount = computed(() => list.value.filter(i => i.method === 'alipay').length)

// 根据昵称生成稳定的柔和背景色
const colorPool = [
  '#42b88322', '#357ef522', '#eb372a22', '#dfac4622',
  '#9b59b622', '#1abc9c22', '#e67e2222', '#3498db22'
]
function avatarColor(name) {
  if (!name) return colorPool[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colorPool[Math.abs(hash) % colorPool.length]
}
</script>

<style lang="scss" scoped>
.thanks {
  .total-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    font-size: 0.8rem;
    border-radius: 50px;
    .iconfont {
      font-size: 0.9rem;
    }
  }
}

// 统计概览
.summary {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1.2rem 1rem;
  margin-top: 1rem;
  .summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex: 1;
    .num {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--main-color);
      line-height: 1;
    }
    .label {
      font-size: 0.8rem;
      color: var(--main-font-second-color);
    }
  }
  .summary-divider {
    width: 1px;
    height: 36px;
    background: var(--main-card-border);
  }
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
    .summary-divider {
      display: none;
    }
    .summary-item {
      min-width: 40%;
    }
  }
}

// 名单卡片标题
.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--main-color);
  .iconfont {
    font-size: 1rem;
  }
}

// 赞赏者列表
.supporter-list {
  display: flex;
  flex-direction: column;
}
.supporter-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0.5rem;
  border-bottom: 1px dashed var(--main-card-border);
  transition: background-color 0.3s;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: var(--main-color-bg2);
  }
  .avatar {
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--main-font-color);
  }
  .info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    .info-top {
      display: flex;
      align-items: center;
      gap: 8px;
      .name {
        font-weight: 600;
        color: var(--main-font-color);
      }
      .method-badge {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-size: 0.7rem;
        padding: 2px 7px;
        border-radius: 50px;
        &.wechat {
          color: #07c160;
          background-color: #07c16022;
        }
        &.alipay {
          color: #1677ff;
          background-color: #1677ff22;
        }
        .iconfont {
          font-size: 0.85rem;
        }
      }
    }
    .info-bottom {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.8rem;
      .message {
        color: var(--main-font-second-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .date {
        color: var(--main-font-second-color);
        opacity: 0.7;
        flex-shrink: 0;
      }
    }
  }
  .amount {
    flex-shrink: 0;
    font-size: 1.05rem;
    font-weight: bold;
    color: var(--main-color-red);
  }
  @media (max-width: 768px) {
    .info {
      .info-bottom {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
      }
    }
    .amount {
      font-size: 0.95rem;
    }
  }
}

// 空状态
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 1rem;
  color: var(--main-font-second-color);
  .iconfont {
    font-size: 3rem;
    opacity: 0.4;
  }
  p {
    font-size: 0.9rem;
  }
}
</style>
