<template>
  <div class="welcome-widget s-card">
    <!-- 公告 -->
    <div class="notice">
      <span v-if="theme.aside.welcome.text1" v-html="theme.aside.welcome.text1"></span>
      <span v-if="theme.aside.welcome.text2" v-html="theme.aside.welcome.text2"></span>
      <span v-if="theme.aside.welcome.text3" v-html="theme.aside.welcome.text3"></span>
      <span v-if="!isComments">❓ 如有问题欢迎<span class="main-link" @click="goToComment">留言板</span>交流！</span>
      <span>📧 如需联系我：<a class="main-link" :href="`mailto:${theme.aside.welcome.email}`">发送邮件</a>🚀</span>
    </div>
    <div class="welcome-info">
      <div>
        欢迎来自
        <span class="address bold">{{ address }}</span>
        的小友💖
      </div>
      <span class="posdesc bold">{{ posdesc }}</span>
      <div>当前位置距博主的直线距离约：</div>
      <div class="dist bold">{{ dist }} 公里！</div>
      <div>你的ip地址为：</div>
      <div class="ip bold">{{ ipLocation?.ip }}</div>
      <div>
        Tip: <span>{{ timeGreeting }}</span>
      </div>
      <div ref="mask" class="mask" :class="{ 'loading': isLoading }">
        <div v-if="isLoading" class="loading-content">
          <div class="loading-spinner"></div>
          <span class="loading-text">正在获取位置信息...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { mainStore } from '../../../store'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const store = mainStore()
const { theme } = useData()
const { isComments } = defineProps(['isComments'])
const { userLocation: ipLocation } = storeToRefs(store)

// 加载状态
const isLoading = ref(true)

// 地址
const address = computed(() => {
  let address = `${ipLocation.value?.country || ''} ${ipLocation.value?.province || '未知'} ${ipLocation.value?.city || ''}`
  return address || '未知'
})
// 距离
const dist = computed(() => {
  let res = getDistance(theme.value.aside.welcome.address, ipLocation.value?.longitude, ipLocation.value?.latitude)
  return isNaN(res) ? '未知' : res.toFixed(2)
})
// 时间问候
const timeGreeting = computed(() => {
  const date = new Date()
  const hours = date.getHours()
  if (hours >= 5 && hours < 11) return '早上好，一日之计在于晨 🌤️'
  if (hours >= 11 && hours < 13) return '中午好，记得午休喔~ ☀️'
  if (hours >= 13 && hours < 17) return '下午好，饮茶先啦！🕞'
  if (hours >= 17 && hours < 19) return '即将下班，记得按时吃饭~ 🚶‍♂️'
  if (hours >= 19 && hours < 24) return '晚上好，夜生活嗨起来！🌙'
  else return '夜深了，早点休息，少熬夜 ✨'
})

// 位置描述
const posdesc = computed(() => {
  if (ipLocation.value?.country === '中国') {
    const province = ipLocation.value?.province

    // 处理省份名称，去除特定后缀词
    const shortProvince = province ? province.replace(/(省|市|回族自治区|壮族自治区|维吾尔自治区|自治区|特别行政区)$/, '') : ''

    const city = ipLocation.value?.city
    // 处理市名称，去除特定后缀词
    const shortCity = city ? city.replace(/(市|区|县)$/, '') : ''

    if (typeof locationMessages.provinces[shortProvince] === 'object') {
      // 省份有城市细分
      return locationMessages.provinces[shortProvince][shortCity] || locationMessages.provinces[shortProvince].default
    } else {
      // 省份没有城市细分
      return locationMessages.provinces[shortProvince] || locationMessages.provinces.default
    }
  } else {
    // 国外
    return locationMessages.countries[ipLocation.value?.country] || locationMessages.countries.default
  }
})

// 国家和城市映射
const locationMessages = {
  countries: {
    日本: 'よろしく，一起去看樱花吗',
    韩国: '눈부신 시작, 당신과 함께라면.',
    美国: 'Let us live in peace!',
    英国: '想同你一起夜乘伦敦眼',
    俄罗斯: '干了这瓶伏特加！',
    法国: "C'est La Vie",
    德国: 'Die Zeit verging im Fluge.',
    澳大利亚: '一起去大堡礁吧！',
    加拿大: '拾起一片枫叶赠予你',
    巴西: '来感受桑巴的热情吧！💃',
    印度: 'Namaste! 一起探索多彩国度',
    意大利: 'Ciao! 来份意面和阳光吗？🍝',
    西班牙: '¡Hola! 一起加入弗拉门戈的节奏',
    墨西哥: '¡Viva México! 尝尝地道的塔可🌮',
    泰国: 'สวัสดี! 一起享受微笑之国',
    新西兰: '欢迎来到中土世界！🧙♂️',
    新加坡: '欢迎来到花园城市！🌸',
    荷兰: '一起骑单车赏郁金香吧！🚲',
    瑞士: '来阿尔卑斯山间喝杯热可可吗？🏔️',
    中国: null, // 中国有单独的省份处理
    default: '带我去你的国家逛逛吧'
  },
  provinces: {
    北京: '🇨🇳皇城根下·千年京韵🇨🇳',
    上海: '🌃魔都魅力·东方明珠不夜城🌉',
    天津: '🎭相声码头·九河下梢卫派韵🎡',
    重庆: '🌉山城雾都·火锅江湖热辣滚烫🌶️',
    广东: {
      广州: '🐏食在广州·花城粤韵飘香🍵',
      深圳: '💻创新之城·科技之光闪耀✨',
      default: '🌊岭南风情·粤来粤精彩🎭'
    },
    浙江: {
      杭州: '🏞️西湖潋滟·宋韵千年醉杭州🍃',
      宁波: '🌉海定波宁·书藏古今港通天下📚',
      default: '⛰️诗画浙江·青山绿水见江南🖼️'
    },
    四川: {
      成都: '🐼蓉城烟火·安逸巴适慢生活🍲',
      绵阳: '🚀科技之城·两弹一星耀九州💡',
      default: '🌶️天府之国·熊猫故乡辣味香🎋'
    },
    山东: {
      青岛: '🍺红瓦绿树·啤酒飘香碧海城🌊',
      济南: '⛲泉城风韵·一城山色半城湖🏯',
      default: '🏮好客山东·仁义之乡迎宾来🎎'
    },
    云南: {
      昆明: '🌺春城无处不飞花·四季如春🌸',
      大理: '🏯风花雪月·苍山洱海自在大理🌅',
      default: '☁️七彩云南·秘境之旅心向往🌈'
    },
    黑龙江: {
      哈尔滨: '❄️冰雪王国·东方莫斯科浪漫⛪',
      大庆: '🛢️石油之光·铁人精神永流传⚙️',
      default: '⛄北国风光·林海雪原黑土情🌾'
    },
    吉林: {
      长春: '🚗汽车之城·电影摇篮映北国🎥',
      吉林: '❄️雾凇奇观·松花江畔凇雪美🌫️',
      default: '🏔️长白圣山·关东情韵吉临天下🎑'
    },
    辽宁: {
      沈阳: '🏯盛京遗韵·共和国长子担当🏭',
      大连: '🌊浪漫之都·北方明珠耀渤海🚢',
      default: '⚓辽沈大地·重工业摇篮振兴🚂'
    },
    陕西: {
      西安: '🏮长安月下·秦风唐韵越千年🎎',
      延安: '🏞️革命圣地·黄土高坡信天游🎻',
      default: '🗿三秦大地·丝绸之路起雄关🐫'
    },
    山西: {
      太原: '⛩️晋商故里·千年醋都面食香🍜',
      大同: '🛕云冈佛光·塞外古都融胡汉🏯',
      default: '🏔️表里山河·地上文物看山西🗿'
    },
    甘肃: {
      兰州: '🍜黄河穿城·一碗面香飘丝路🏜️',
      敦煌: '🎨飞天壁画·大漠驼铃响千年🐫',
      default: '🏔️河西走廊·敦煌驼铃震边疆🌅'
    },
    青海: {
      西宁: '🏔️青藏门户·夏都凉爽聚多元🕌',
      default: '💧大美青海·天空之镜照圣湖🦌'
    },
    江西: {
      南昌: '🏯英雄之城·滕王阁序传千年📜',
      景德镇: '🍶瓷都千年·青白釉色动天下🎐',
      default: '⛰️赣鄱大地·庐山云雾映鄱阳🌊'
    },

    内蒙古: {
      呼和浩特: '🌾塞外青城·敕勒川阴山下🐎',
      呼伦贝尔: '🌿草原明珠·风吹草低见牛羊🐑',
      default: '🏹天骄圣地·马背民族守北疆🐫'
    },
    宁夏: {
      银川: '🏜️塞上江南·贺兰山下枸杞红🍒',
      default: '🏯西夏故地·大漠长河映红柳🌅'
    },
    广西: {
      桂林: '🏞️桂林山水甲天下·水墨漓江🖼️',
      南宁: '🌴绿城东盟·朱槿花开耀南疆🌺',
      default: '🎶壮乡歌海·刘三姐声绕梯田🌾'
    },
    西藏: '🏔️世界屋脊·圣洁天堂触云端🕉️',
    新疆: '🍇西域风情·瓜果之乡舞胡杨💃',

    香港: '🎬东方之珠·维港夜景耀全球🌃',
    澳门: '🎲莲花宝地·中西文化汇濠江🎰',

    台湾省: {
      台北: '🏮宝岛明珠·101云端瞰烟火🎆',
      高雄: '🌅港都浪漫·爱河夕阳伴货轮🚢',
      default: '🏞️美丽台湾·阿里山日月潭仙境🌸'
    },

    贵州省: {
      贵阳: '🌿爽爽林城·大数据谷藏深山💻',
      遵义: '⭐红色转折·娄山关险忆长征⚡',
      default: '⛰️多彩贵州·苗寨侗歌醉山水🎵'
    },
    海南省: {
      海口: '🌴椰城风情·自贸港扬帆起航⛵',
      三亚: '🏖️东方夏威夷·天涯海角浪漫🌊',
      default: '☀️阳光海南·热带天堂享自在🌺'
    },
    default: '🇨🇳大美中国·江山如此多娇🗺️'
  }
}

// 计算距离
function getDistance(address, e2, n2) {
  let [e1, n1] = address
  const R = 6371
  const { sin, cos, asin, PI, hypot } = Math
  let getPoint = (e, n) => {
    e *= PI / 180
    n *= PI / 180
    return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) }
  }

  let a = getPoint(e1, n1)
  let b = getPoint(e2, n2)
  let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z)
  let r = asin(c / 2) * 2 * R
  return r
}

function isHomePage() {
  return window.location.pathname === '/' || window.location.pathname === '/index.html'
}
const router = useRouter()
function goToComment() {
  router.go('/pages/comments')
}

watch(
  ipLocation,
  (newVal, oldVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      // 数据加载完成，隐藏loading
      isLoading.value = false
    } else {
      // 数据为空或正在加载，显示loading
      isLoading.value = true
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.address {
  font-weight: bold;
}
.bold {
  font-weight: bold;
  color: var(--main-color);
}
:deep(.notice strong) {
  color: var(--main-color-reverse) !important;
}
.welcome-widget {
  display: flex;
  flex-direction: column;
  gap: 15px;
  .notice {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .welcome-info {
    font-size: 0.9em;
    color: var(--main-font-second-color);
    display: flex;
    flex-direction: column;
    gap: 15px;
    border-radius: 10px;
    padding: 10px;
    background-color: var(--main-card-second-background);
    border: 1px solid var(--main-card-border);
    position: relative;
    & .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--main-card-second-background);
      border: 1px solid var(--main-card-border);
      border-radius: 10px;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      
      &.loading {
        opacity: 1;
        pointer-events: auto;
        background-color: rgba(var(--main-card-second-background-rgb), 0.9);
        backdrop-filter: blur(5px);
        
        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 15px;
          color: var(--main-font-color);
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--main-card-border);
            border-top: 3px solid var(--main-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          .loading-text {
            font-size: 14px;
            font-weight: 500;
            color: var(--main-font-second-color);
          }
        }
      }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .ip {
      filter: blur(5px);
      transition: filter 0.3s ease;
      &:hover {
        filter: blur(0px);
      }
    }
    .posdesc {
      font-size: 1em;
      color: var(--main-color-reverse);
    }
  }
}
</style>
