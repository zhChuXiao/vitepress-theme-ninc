<!-- 文章列表 -->
<template>
  <div
    class="post-lists"
    :class="{ 'layout-grid': layoutType === 'twoColumns' }"
    :style="gridStyle"
  >
    <div
      v-for="(item, index) in listData"
      :key="index"
      :class="[
        'post-item',
        's-card',
        'hover',
        {
          simple,
          cover: showCover(item),
          [`cover-${layoutType}`]: showCover(item),
        },
      ]"
      :style="{ animationDelay: `${0.4 + index / 10}s` }"
      @click="toPost(item.regularPath)"
    >
      <div v-if="!simple && showCover(item)" class="post-cover">
        <img v-if="getCover(item)" :src="getCover(item)" :alt="item.title" />
        <!-- 无封面时渲染有设计感的 HTML 占位 -->
        <div
          v-else
          class="cover-placeholder"
          :style="placeholderStyle(item)"
        >
          <div class="placeholder-dots" aria-hidden="true"></div>
          <div class="placeholder-letter">{{ firstChar(item.title) }}</div>
          <div class="placeholder-line"></div>
          <div class="placeholder-cat">{{ item?.categories?.[0] || '文章' }}</div>
        </div>
      </div>

      <div class="post-content">
        <div v-if="!simple && item?.categories" class="post-category">
          <span v-for="cat in item?.categories" :key="cat" class="cat-name">
            <i class="iconfont icon-folder" />
            {{ cat }}
          </span>
          <!-- 锁定 -->
          <span v-if="item?.crypto?.enable" class="crypto">
            <i class="iconfont icon-lock_fill" />
            加密文章
          </span>
          <!-- 转载 -->
          <span v-if="item?.reprint" class="original">
            <i class="iconfont icon-hashtag" />
            转载
          </span>
          <!-- 原创 -->
          <!-- <span v-if="!item?.reprint" class="original">
            <i class="iconfont icon-hashtag" />
            原创
          </span> -->
          <!-- 置顶 -->
          <span v-if="item?.top" class="top">
            <i class="iconfont icon-align-top" />
            置顶
            <!-- <i v-if="item.top" class="iconfont icon-fire" /> -->
          </span>
          <!-- 推荐 -->
          <span v-if="item?.recommend" class="recommend">
            <i class="iconfont icon-fire" />
            推荐
          </span>
          
        </div>
        <span class="post-title"
          >{{ item.title }}
          <i v-if="item?.crypto?.enable" class="iconfont icon-lock"
        /></span>
        <span v-if="item?.description" class="post-desc">
          {{ item.description }}
        </span>
        <div v-if="!simple" class="post-meta">
          <div v-if="item?.tags" class="post-tags">
            <span
              v-for="tags in item?.tags"
              :key="tags"
              class="tags-name"
              @click.stop="router.go(`/pages/tags/${tags}`)"
            >
              <i class="iconfont icon-hashtag" />
              {{ tags }}
            </span>
          </div>
          <span class="post-time">{{ formatTimestamp(item?.date) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { mainStore } from '../../store';
import { formatTimestamp } from '../../utils/helper';

const store = mainStore();
const router = useRouter();

const props = defineProps({
  // 列表数据
  listData: {
    type: [Array, String],
    default: () => [],
  },
  // 简洁模式
  simple: {
    type: Boolean,
    default: false,
  },
});

const { theme: themeConfig } = useData();

// 计算布局类型
const layoutType = computed(() =>
  themeConfig.value?.cover?.twoColumns
    ? "twoColumns"
    : themeConfig.value?.cover?.showCover?.coverLayout ?? "left"
);

// 计算网格样式
const gridStyle = computed(() =>
  layoutType.value === "twoColumns"
    ? {
        "--grid-columns": 2,
        "--grid-gap": "1rem",
      }
    : {}
);

// 判断是否显示封面
const showCover = () => themeConfig.value?.cover?.showCover?.enable;

// 获取封面图片 按优先级获取：cover > defaultCover > false
const getCover = ({ cover: itemCover }) => {
  const { cover } = themeConfig.value ?? {};

  if (!cover?.showCover?.enable) return false;
  if (itemCover) return itemCover;

  return Array.isArray(cover.showCover.defaultCover)
    ? cover.showCover.defaultCover[
        Math.floor(Math.random() * cover.showCover.defaultCover.length)
      ]
    : false;
};

// 取标题首字（中文取第一个汉字，英文取首字母大写）
const firstChar = (title) => {
  if (!title) return '文';
  const trimmed = String(title).trim();
  if (!trimmed) return '文';
  const first = trimmed[0];
  // 英文字母大写，其他字符原样
  return /[a-zA-Z]/.test(first) ? first.toUpperCase() : first;
};

// 基于分类名生成柔和的低饱和度渐变色（避免 AI 味的鲜艳色彩）
const placeholderStyle = (item) => {
  const category = item?.categories?.[0] || item?.title || '文章';
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  // 低饱和度、高亮度的柔和渐变（符合用户偏好的清新色调）
  const from = `hsl(${hue}, 45%, 92%)`;
  const to = `hsl(${(hue + 35) % 360}, 50%, 88%)`;
  const accent = `hsl(${hue}, 55%, 65%)`;
  return {
    background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
    '--placeholder-accent': accent,
  };
};

// 前往文章
const toPost = (path) => {
  // 记录滚动位置
  if (typeof window !== "undefined") {
    const scrollY = window.scrollY;
    store.lastScrollY = scrollY;
  }
  // 跳转文章
  router.go(path);
};
</script>

<style lang="scss" scoped>
.post-lists {
  .post-item {
    padding: 0 !important;
    display: flex;
    margin-bottom: 1rem;
    animation: fade-up 0.6s 0.4s backwards;
    cursor: var(--main-pointer-cursor);
    overflow: hidden;
    height: 200px;

    .post-cover {
      flex: 0 0 35%;
      overflow: hidden;
      transform: translateZ(0);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform-origin: center center;
        will-change: transform, filter;
        transition: transform 0.5s ease-out, filter 0.5s ease-out;
        backface-visibility: hidden;
      }

      // 无封面时的设计感占位
      .cover-placeholder {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: transform 0.5s ease-out, filter 0.5s ease-out;

        // 主首字：超大号、半透明、用主题色着色，外包白色圆角方块
        .placeholder-letter {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 96px;
          height: 96px;
          font-size: 3.2rem;
          font-weight: 700;
          color: var(--placeholder-accent);
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          line-height: 1;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          box-shadow:
            0 4px 16px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transition: transform 0.5s ease-out, opacity 0.3s, box-shadow 0.3s;
          z-index: 2;
        }

        // 首字下方装饰细线
        .placeholder-line {
          width: 32px;
          height: 2px;
          background: var(--placeholder-accent);
          opacity: 0.5;
          margin-top: 0.8rem;
          border-radius: 1px;
          transition: width 0.4s ease-out;
          z-index: 2;
        }

        // 底部分类标签胶囊
        .placeholder-cat {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          font-weight: 500;
          color: var(--placeholder-accent);
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(8px);
          padding: 3px 10px;
          border-radius: 999px;
          letter-spacing: 0.04em;
          white-space: nowrap;
          z-index: 2;
        }

        // 右上角装饰点阵（极淡）
        .placeholder-dots {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          background-image: radial-gradient(
            var(--placeholder-accent) 1.2px,
            transparent 1.2px
          );
          background-size: 8px 8px;
          opacity: 0.35;
          z-index: 1;
          transition: opacity 0.4s;
        }
      }
    }

    .post-content {
      flex: 1;
      padding: 1.6rem 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .post-category {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        color: var(--main-font-second-color);
        font-size: 14px;
        .cat-name {
          display: flex;
          flex-direction: row;
          align-items: center;
          .iconfont {
            opacity: 0.8;
            margin-right: 6px;
            color: var(--main-font-second-color);
          }
        }
        .top {
          margin-left: 12px;
          border-radius: 999px;
          padding: 2px 8px;
          color: var(--main-color);
          border: 1px solid var(--main-color-bg2);
          // background-color: var(--main-color-bg);
          text-align: center;
          font-weight: bold;
          color: var(--main-color);
          .iconfont {
            opacity: 0.8;
            color: var(--main-color);
          }
        }
        .recommend {
          margin-left: 12px;
          border-radius: 999px;
          padding: 2px 8px;
          color: var(--main-color-reverse);
          border: 1px solid var(--main-color-reverse-bg2);
          // background-color: var(--main-color-reverse-bg);
          text-align: center;
          font-weight: bold;
          color: var(--main-color-reverse);
          .iconfont {
            opacity: 0.8;
            color: var(--main-color-reverse);
          }
        }
        .crypto {
          margin-left: 12px;
          border-radius: 999px;
          padding: 2px 8px;

          color: var(--main-color-error);
          border: 1px solid var(--main-color-error-bg2);
          // background-color: var(--main-color-error-bg);
          text-align: center;
          font-weight: bold;
          color: var(--main-color-error);
          .iconfont {
            opacity: 0.8;
            color: var(--main-color-error);
          }
        }
        .reprint {
          margin-left: 12px;
          border-radius: 999px;
          padding: 2px 8px;

          color: var(--main-color-error);
          border: 1px solid var(--main-color-error-bg2);
          // background-color: var(--main-color-error-bg);
          text-align: center;
          font-weight: bold;
          color: var(--main-color-error);
          .iconfont {
            opacity: 0.8;
            color: var(--main-color-error);
          }
        }
        .original {
          margin-left: 12px;
          border-radius: 999px;
          padding: 2px 8px;
          color: var(--main-color-success);
          border: 1px solid var(--main-color-success-bg2);
          // background-color: var(--main-color-success-bg);
          text-align: center;
          font-weight: bold;
          color: var(--main-color-success);
          .iconfont {
            opacity: 0.8;
            color: var(--main-color-success);
          }
        }
      }
      .post-title {
        font-size: 20px;
        line-height: 30px;
        font-weight: bold;
        margin: 0.6rem 0;
        transition: color 0.3s;
        display: -webkit-box;
        overflow: hidden;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        .iconfont {
          opacity: 0.8;
          font-size: 20px;
          color: var(--main-color);
        }
      }
      .post-desc {
        margin-top: -0.4rem;
        margin-bottom: 0.8rem;
        opacity: 0.8;
        line-height: 25px;
        font-size: 14px;
        display: -webkit-box;
        overflow: hidden;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .post-meta {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        color: var(--main-font-second-color);
        .post-tags {
          display: flex;
          flex-wrap: wrap;
          opacity: 0.8;
          margin-right: 20px;
          overflow: hidden;
          mask: linear-gradient(
            90deg,
            #fff 0,
            #fff 90%,
            hsla(0, 0%, 100%, 0.6) 95%,
            hsla(0, 0%, 100%, 0) 100%
          );
          .tags-name {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-right: 12px;
            white-space: nowrap;
            transition: color 0.3s;
            .iconfont {
              font-weight: normal;
              opacity: 0.6;
              margin-right: 4px;
              transition: color 0.3s;
            }
            &:hover {
              color: var(--main-color);
              .iconfont {
                color: var(--main-color);
              }
            }
          }
          @media (max-width: 768px) {
            flex-wrap: nowrap;
          }
        }
        .post-time {
          opacity: 0.6;
          font-size: 13px;
          white-space: nowrap;
        }
      }
    }
    &.simple {
      animation: none;
      padding: 0.5rem 1.4rem;
      background-color: var(--main-card-second-background);
      height: auto;
    }
    &:last-child {
      margin-bottom: 0;
    }
    &:hover {
      .post-cover img {
        filter: brightness(0.8);
        transform: scale(1.05);
      }
      .post-cover .cover-placeholder {
        .placeholder-letter {
          transform: scale(1.06);
          opacity: 1;
          box-shadow:
            0 6px 24px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }
        .placeholder-line {
          width: 48px;
        }
        .placeholder-dots {
          opacity: 0.55;
        }
      }
      .post-content {
        .post-title {
          color: var(--main-color);
        }
      }
    }
    &:active {
      transform: scale(0.98);
    }
    @media (max-width: 768px) {
      flex-direction: column;
      height: auto;

      .post-cover {
        flex: none;
        width: 100%;
        height: 200px;
      }
    }

    // 封面靠左
    &.cover-left {
      flex-direction: row;
    }

    // 封面靠右
    &.cover-right {
      flex-direction: row-reverse;
    }

    // 交替布局
    &.cover-both {
      &:nth-child(odd) {
        flex-direction: row;
      }
      &:nth-child(even) {
        flex-direction: row-reverse;
      }
    }

    // 移动端垂直布局
    @media (max-width: 768px) {
      &.cover-left,
      &.cover-right,
      &.cover-both {
        flex-direction: column !important;
      }
    }
  }

  // 网格布局
  &.layout-grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-columns, 2), 1fr);
    gap: var(--grid-gap, 1rem);

    .post-item {
      margin: 0;
      flex-direction: column;
      height: auto;

      .post-cover {
        flex: none;
        width: 100%;
        height: 225px;
      }

      .post-content {
        flex: 1;
      }
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}

// Dark 模式下占位封面适度压暗，保持柔和但不过暗
.dark .post-lists .post-item .post-cover .cover-placeholder {
  filter: brightness(0.82);

  .placeholder-letter {
    background: rgba(255, 255, 255, 0.18);
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }
  .placeholder-cat {
    background: rgba(0, 0, 0, 0.35);
  }
}
</style>
