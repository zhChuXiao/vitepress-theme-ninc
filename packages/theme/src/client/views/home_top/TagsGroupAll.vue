<template>
  <div v-if="creativityData" id="skills-tags-group-all">
    <div class="tags-group-wrapper">
      <template v-for="(group, groupIndex) in creativityData" :key="groupIndex">
        <!-- 两轮相同渲染，用于无缝滚动动画 -->
        <template v-for="round in 2" :key="round">
          <div
            v-for="(pair, index) in pairsOf(group.creativity_list)"
            :key="`${round}-${index}`"
            class="tags-group-icon-pair"
          >
            <!-- 偶数项图标（图片缺失时隐藏 img，保留底色块兜底，避免破碎图标志） -->
            <div
              class="tags-group-icon"
              :style="{ background: pair.even.color }"
            >
              <img
                class="no-lightbox"
                :title="pair.even.name"
                :src="pair.even.icon"
                :alt="pair.even.name"
                @error="$event.target.style.display = 'none'"
              />
            </div>
            <!-- 奇数项图标（同上） -->
            <div
              class="tags-group-icon"
              :style="{ background: pair.odd.color }"
            >
              <img
                class="no-lightbox"
                :title="pair.odd.name"
                :src="pair.odd.icon"
                :alt="pair.odd.name"
                @error="$event.target.style.display = 'none'"
              />
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagsGroupAll',
  props: {
    creativityData: {
      type: Array,
      required: true
    }
  },
  methods: {
    // 将列表按偶/奇索引两两配对：每组只计算一次
    // （原实现每次渲染对每个 item 重复调用 evenItems/oddItems，每次都在新建过滤数组）
    pairsOf(list) {
      const evens = list.filter((_, i) => i % 2 === 0)
      const odds = list.filter((_, i) => i % 2 === 1)
      const pairs = []
      for (let i = 0; i < evens.length; i++) {
        // 奇数长度时最后一个偶数项会落单，与自己配对（上下两格显示同一图标），避免尾项丢失
        pairs.push({ even: evens[i], odd: odds[i] ?? evens[i] })
      }
      return pairs
    }
  }
}
</script>
