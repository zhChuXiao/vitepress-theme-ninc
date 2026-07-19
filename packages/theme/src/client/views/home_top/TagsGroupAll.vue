<template>
  <div v-if="creativityData" id="skills-tags-group-all">
    <div class="tags-group-wrapper">
      <template v-for="(group, groupIndex) in creativityData" :key="groupIndex">
        <!-- 第一次循环 - 用于无缝动画 -->
        <template v-for="(item, index) in group.creativity_list" :key="`first-${index}`">
          <div 
            class="tags-group-icon-pair"
            v-if="index+1 <= evenItems(group.creativity_list).length && index+1 <= oddItems(group.creativity_list).length"
          >
            <!-- 偶数项图标 -->
            <div 
              class="tags-group-icon" 
              :style="{ background: evenItems(group.creativity_list)[index].color }"
            >
              <img 
                class="no-lightbox"
                :title="evenItems(group.creativity_list)[index].name"
                :src="evenItems(group.creativity_list)[index].icon"
                :alt="evenItems(group.creativity_list)[index].name"
              />
            </div>
            <!-- 奇数项图标 -->
            <div 
              class="tags-group-icon" 
              :style="{ background: oddItems(group.creativity_list)[index].color }"
            >
              <img 
                class="no-lightbox"
                :title="oddItems(group.creativity_list)[index].name"
                :src="oddItems(group.creativity_list)[index].icon"
                :alt="oddItems(group.creativity_list)[index].name"
              />
            </div>
          </div>
        </template>
        
        <!-- 第二次循环 - 与第一次完全相同，用于无缝动画 -->
        <template v-for="(item, index) in group.creativity_list" :key="`second-${index}`">
          <div 
            class="tags-group-icon-pair"
            v-if="index+1 <= evenItems(group.creativity_list).length && index+1 <= oddItems(group.creativity_list).length"
          >
            <!-- 偶数项图标 -->
            <div 
              class="tags-group-icon" 
              :style="{ background: evenItems(group.creativity_list)[index].color }"
            >
              <img 
                class="no-lightbox"
                :title="evenItems(group.creativity_list)[index].name"
                :src="evenItems(group.creativity_list)[index].icon"
                :alt="evenItems(group.creativity_list)[index].name"
              />
            </div>
            <!-- 奇数项图标 -->
            <div 
              class="tags-group-icon" 
              :style="{ background: oddItems(group.creativity_list)[index].color }"
            >
              <img 
                class="no-lightbox"
                :title="oddItems(group.creativity_list)[index].name"
                :src="oddItems(group.creativity_list)[index].icon"
                :alt="oddItems(group.creativity_list)[index].name"
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
    // 获取偶数索引项
    evenItems(list) {
      return list.filter((_, index) => index % 2 === 0);
    },
    // 获取奇数索引项
    oddItems(list) {
      return list.filter((_, index) => index % 2 === 1);
    }
  }
}
</script>
