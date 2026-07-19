<template>
  <div class="equipment-container">
    <div class="author-content author-content-item fcirclePage single"
      :style="`background: url(${equipmentData.top_background}) left 37% / cover no-repeat !important;`">
      <div class="card-content">
        <div class="author-content-item-tips">{{ equipmentData.class_name }}</div>
        <span class="author-content-item-title">{{ equipmentData.description }}</span>
        <span class="author-content-item-title">{{ equipmentData.subDescription }}</span>
        <div class="content-bottom">
          <div class="tips">{{ equipmentData.tip }}</div>
        </div>
      </div>
    </div>

    <div v-for="(goodThing, goodThingIndex) in equipmentData.good_things" :key="goodThingIndex" class="goodthings-item">
      <div class="goodthings">
        <div class="goodthings-title">{{ goodThing.title }}</div>
        <div class="goodthings-description">{{ goodThing.description }}</div>
      </div>
      <div class="equipment-item">
        <div class="equipment-item-content">
          <div v-for="(equipment, equipmentIndex) in goodThing.equipment_list" :key="equipmentIndex"
            class="equipment-item-content-item" :class="{ large: equipment.large, largeHeight: equipment.largeHeight }">
            <div class="equipment-item-content-item-cover">
              <a class="img-fancybox equipment-item-content-item-a" :href="equipment.image" data-fancybox="gallery"
                :data-caption="equipment.name" :class="{ full: equipment.full }">
                <img class="equipment-item-content-item-image" :class="{ full: equipment.full }" :src="equipment.image"
                  :alt="equipment.name" loading="lazy" />
              </a>
              <!-- <img class="equipment-item-content-item-image" :src="equipment.image" :alt="equipment.name" /> -->
            </div>
            <div class="equipment-item-content-item-info">
              <el-tooltip content="点击复制名称" placement="right" :show-after="500" :enterable="false">
                <div class="equipment-item-content-item-name" @click="copyText(equipment.name)" :title="equipment.name">
                  {{ equipment.name }}
                </div>
              </el-tooltip>
              <div class="equipment-item-content-item-specification" v-if="equipment.specification.includes('|')">
                {{ equipment.specification.split('|')[0] }}&nbsp;-&nbsp;{{ equipment.specification.split('|')[1] }}
              </div>
              <div class="equipment-item-content-item-specification" v-else>
                {{ equipment.specification }}
              </div>
              <div class="equipment-item-content-item-description">{{ equipment.description }}</div>
              <div class="equipment-item-content-item-toolbar">
                <template v-if="isExternalLink(equipment.link)">
                  <a class="equipment-item-content-item-link" :href="equipment.link" target="_blank"> 详情 </a>
                  <el-tooltip content="快速评论" placement="right" :show-after="500" :enterable="false">
                    <div class="bber-reply"
                      @click="comment(equipment.name, equipment.specification, equipment.description)">
                      <i class="iconfont icon-chat"></i>
                    </div>
                  </el-tooltip>
                </template>
                <template v-else>
                  <a class="equipment-item-content-item-link" v-if="equipment.link" :href="equipment.link"
                    target="_blank">
                    查看文章
                  </a>
                  <div v-else></div>
                  <el-tooltip content="快速评论" placement="right" :show-after="500" :enterable="false">
                    <div class="bber-reply"
                      @click="comment(equipment.name, equipment.specification, equipment.description)">
                      <i class="iconfont icon-chat"></i>
                    </div>
                  </el-tooltip>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import initFancybox from '../utils/initFancybox'
import { commentText } from '../utils/helper'
const { theme } = useData()
import { ElTooltip } from 'element-plus'
// 默认装备数据（用户可通过 themeConfig.equipment 覆盖）
const defaultEquipmentData = {
  class_name: '我的装备',
  description: '这里是我平时使用的',
  subDescription: '实用好物推荐',
  tip: '以下设备体验基于个人使用场景，描述纯个人主观碎碎念，你的体验可能会不一样~',
  // top_background: 'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  top_background: 'https://images.pexels.com/photos/544295/pexels-photo-544295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  good_things: [
    {
      title: '生产力主力设备',
      description: '高便携性和跨场景使用的生产力工具',
      equipment_list: [
        {
          name: 'Mac mini M4',
          image: '/images/MacMini-M4.png',
          specification: 'M4 | 24GB / 256GB',
          description:
            '有史以来最超值的Mac，国补叠加教育优惠，性价比拉满，买的最小存储，挂硬盘盒用，搭配4K便携屏，小身材释放大能量，太香了。',
          link: 'https://support.apple.com/zh-cn/121555'
        },
        {
          name: 'MacBook Pro 2023 14 英寸',
          image: '/images/MacBook-2023-14-inch.png',
          specification: 'M2 Pro | 32G / 512GB',
          description: '精准色彩，强悍性能，专业级生产力工具，续航表现优秀，M2 Pro轻松应对开发、设计等高要求任务。',
          link: 'https://support.apple.com/zh-cn/111340'
        },
        {
          name: 'MacBook Pro 2019 16 英寸',
          image: '/images/MacBook-2019-16-inch.png',
          specification: 'Intel Core i9 | 32GB / 1TB',
          description:
            '最后一代英特尔处理器的Mac，也是最后一代X86架构。闲置了一直没舍得卖，用来装虚拟机，就怕哪天用什么冷门小软件不兼容ARM。',
          link: 'https://support.apple.com/zh-cn/111932'
        },
        {
          name: 'iPad Pro 2022 11寸',
          image: '/images/ipad-pro-2022-11-inth.png',
          specification: 'M2 | 8GB / 512GB',
          description:
            '买前生产力，买后爱奇艺，性能堪比笔记本，系统却让你只能爱奇艺，再强的性能，没有macOS还是差点意思，最终用途：追剧+电子相册+盖泡面。',
          link: 'https://support.apple.com/zh-cn/111842'
        },
        {
          name: 'iPhone 15 Pro',
          image: '/images/iphone15pro.png',
          specification: '白色钛金属 | 256GB',
          description: `"钛金属，坚固轻盈，Pro 得真材实料"。颜值手感都在线，A17 Pro芯片够用好几年了，不玩游戏对手机性能没什么太大追求，未来三年的主力机。`,
          link: 'https://support.apple.com/zh-cn/111829'
        },
        {
          name: 'Magic TrackPad 3代（妙控板）',
          image: '/images/magic-trackpad.png',
          specification: '白色 | 力度触控 / 多点触控',
          description: '妙控板3代，Mac用户必备，用过才知道有多香，操作丝滑得飞起，鼠标直接吃灰，指哪打哪，用过就再也回不去了。',
          link: 'https://support.apple.com/zh-cn/121932'
        },
        {
          name: 'Magic Keyboard（妙控键盘）',
          image: '/images/magic-keyboard.png',
          specification: '白色 | Touch ID / 无数字小键盘',
          description:
            '妙控键盘，白色颜值在线，不过手感嘛...就那样，键程短反馈软，不指望它能跟机械键盘比敲击感。价格小贵，买它是为了在 Mac mini 使用 Touch ID，以及桌面颜值搭配。',
          link: 'https://support.apple.com/zh-cn/121954'
        },
        {
          name: 'Magic Keyboard iPad（iPad键盘）',
          image: '/images/magic-keyboard-ipad.png',
          specification: '白色 | 11英寸',
          description:
            '颜值没的说，打字体验确实比虚拟键盘强，iPadOS的指针交互和Mac相差还是很大的，原来让iPad变难用的秘诀，就是给它配个又重又贵的键盘，最常用的功能就是当iPad支架。',
          link: 'https://support.apple.com/zh-cn/120125'
        },
        {
          name: 'Magic Mouse（妙控鼠标）',
          image: '/images/magic-mouse.png',
          specification: '白色 | 多点触控',
          description:
            '这个更是重量级，美丽的小废物，反人体工学的扁平造型，用半小时就手酸得想摔鼠标，表面触控板容易误触，精准操作全靠缘分，用了两天就搁置了，买的最后悔的一款电子产品',
          link: 'https://support.apple.com/zh-cn/111885'
        },
        {
          name: '三星 T7 Touch 移动固态硬盘',
          image: '/images/sansung-t7-touch.png',
          specification: '黑色 | 2TB / 指纹加密',
          description:
            '三星T系列的颜值在我看来一直是市面上移动固态硬盘的标杆，卡片设计、体积小。全盘实时AES-256硬件加密，独立的加密芯片和存储颗粒物理隔离，暴力拆解自动清空密钥，存重要文件放心的很。',
          link: 'https://www.samsung.com.cn/memory-storage/portable-ssd/t7-touch-2tb-black-external-storage-nvme-1050-mbs-mu-pc2t0k-ww/'
        },
        {
          name: '海备思U100 Ultra硬盘盒扩展坞',
          image: '/images/kuozhanwu.png',
          specification: '15合1 / M.2硬盘盒',
          description:
            '桌面扩展坞的终极形态！15个接口直接拉满，还能内置M.2硬盘扩容，一坞搞定所有外设，USB 3.1 Gen2接口跑满10Gbps，颜值与实用性并存。',
          link: 'https://item.jd.com/10101260263668.html'
        },
        {
          name: 'OPPO A5（民用C4）',
          image: '/images/oppo-a5.png',
          specification: '骁龙450 | 3GB / 64GB',
          description:
            '如果你有2块，闭眼入OPPO A5，如果你有2000块，闭眼入1000台OPPO A5，坐公交忘带零钱可以直接丢进去，夏天能垫桌脚，冬天秒变暖手宝，过年拆电池还能当二踢脚，iPhone 16性能狂，OPPO A5炸弹王。',
          link: 'https://www.bilibili.com/video/BV1Me12YKERu/'
        }
      ]
    },
    {
      title: '生活娱乐全场景设备',
      description: '我的其他数码产品',
      equipment_list: [
        {
          name: '绿联 DXT4800 NAS私有云',
          image: '/images/dxt4800.png',
          specification: '4盘位RAID5 | 4×18TB硬盘组',
          description:
            '终于告别了DIY NAS的折腾日子！再也不用对着黑群晖的教程熬夜到凌晨，也不用忍受机箱外露的硬盘线和丑陋外观，成品NAS虽然性价比低，但好在省心，4个18T硬盘组RAID5，54T可用空间美滋滋。',
          link: 'https://www.ugnas.com/products-detail/id-40.html'
        },
        {
          name: 'Apple TV 4K',
          image: '/images/apple-tv-4k.png',
          specification: 'WiFi + 千兆网口 | 128GB',
          description:
            '电视盒子里的天花板，但国内用起来需要折腾，tvOS流畅得让安卓机顶盒望尘莫及，不过想解锁完全体得准备外区Apple ID和科学上网，配合Infuse播放NAS里的4K原盘，那画质简直了',
          link: 'https://support.apple.com/en-us/111839'
        },
        {
          name: '坚果 N1S Pro',
          image: '/images/jmgo-n1s-pro.png',
          specification: '4K 三色激光 / 2500 CVIA流明 / 110% BT.2020色域',
          description:
            '4K三色激光投影仪的性价比首选，2500流明的亮度，白天也能清晰观影。革命性云台设计解放安装束缚，想投哪就投哪。',
          link: 'https://www.jmgo.com/goods?id=827'
        },
        {
          name: '红米 G Pro 27U 双模显示器',
          image: '/images/redmi-g-pro-27u.png',
          specification: 'MiniLED | 双高刷 4K 160Hz / 1080P 320Hz',
          description:
            '性价比毋庸置疑，小米堆料王中王，双模式切换，日常用切4K享受视网膜屏，160Hz高刷丝滑细腻，打游戏秒变1080P 320Hz电竞怪兽，买它就是为了这块MiniLED屏，HDR效果惊艳到连MacBook Pro看了都沉默。',
          link: 'https://www.mi.com/redmi-monitors/g-pro-27u'
        },

        {
          name: 'Apple Watch Series 8',
          image: '/images/apple-watch-series-8.png',
          specification: '午夜色 | 45 毫米 / GPS + 蜂窝网络',
          description:
            '运动必备，支持蜂窝网络，出门跑步不用带手机，连耳机听歌接电话回微信都方便。各类传感器始终为我的健康放哨，缺点依旧是续航。',
          link: 'https://support.apple.com/zh-cn/111848'
        },
        {
          name: 'AirPods Pro 2',
          image: '/images/airpods-pro-2nd.png',
          specification: 'USB-C',
          description:
            '苹果生态的无线耳机最优解，无缝切换所有苹果设备，降噪效果够用但不指望能跟Bose比，空间音频玩个新鲜，最实用的还是通透模式，地铁上听报站，走路时听身后电动车喇叭，保命神器。',
          link: 'https://support.apple.com/zh-cn/111851'
        },
        {
          name: 'Xiaomi路由器 BE7000',
          image: '/images/be-7000.png',
          specification: 'WiFi 7三频 | Qualcomm四核1.5GHz / 7×外置天线',
          description:
            '家庭网络终于迎来WiFi 7时代！四核处理器强劲驱动，七根外置天线全屋无死角，三频并发让信号穿墙入室毫无压力。配备4个2.5G网口随便玩跨千兆，下载速度快到飞起，小米路由器里的旗舰体验。',
          link: 'https://www.mi.com/xiaomi-routers/be-7000'
        },
        {
          name: 'CREATIVE Pebble X Plus 桌面音响',
          image: '/images/pebble-x-plus.png',
          specification: '2.1声道电脑音响 | 紧凑型低音炮 / 蓝牙 5.3',
          description:
            '2.1声道桌面音响系统，独特双分频设计搭配独立低音炮，可提供30W RMS强劲功率，低音炮的表现完全超出预期，看电影时的爆炸声效震撼有力。',
          link: 'https://hk.creative.com/p/speakers/creative-pebble-x-plus'
        },
        {
          name: '哈曼卡顿 琉璃3代',
          image: '/images/harmankardon-studio3.png',
          specification: '居家艺术音响',
          description:
            '买它一半为了音质，一半为了颜值。哈曼卡顿的低音表现通常被用户高度评价，130mm下沉式低音单元，低频轰起来整个房间的空气都在震动。唯一缺点就是不能直流供电，带到户外没法用。',
          link: 'https://www.harmankardon.com/home-audio/AURA+STUDIO+3.html'
        },
        {
          name: 'JBL Flip 7 便携音响',
          image: '/images/jbl-flip7.png',
          specification: '户外便携音响',
          description:
            '户外小钢炮，登山必备，续航12小时够嗨一整天，最绝的是摔了N次依旧坚挺，防水防尘还能防摔，JBL祖传的抗造属性拉满。',
          link: 'https://news.jbl.com/en-CEU/247222-jbl-unleashes-next-generation-flip-7-and-charge-6-with-bigger-sound-and-deeper-bass'
        },

        {
          name: '迈从 K87 客制化机械键盘',
          image: '/images/machose-k87.png',
          specification: '87键 | 风信紫轴',
          description: '风信紫轴手感顺滑，87键紧凑布局节省桌面空间，PBT键帽耐磨不打油，支持热插拔换轴可玩性极高。',
          link: 'https://www.maicong.cn/detail?link_product=0b16ed0e38f603e3ea9cb948ba143e69'
        },
        {
          name: '罗技 G304',
          image: '/images/g304.webp',
          specification: '最高12000 DPI / 400 IPS / 1000Hz回报率',
          description:
            '性价比超高的无线游戏鼠标，Hero传感器精准稳定。轻量化设计长时间使用不累手，虽然外观比较朴素，但性能完全不输更贵的鼠标，特别适合追求实用性的用户。',
          link: 'https://www.logitechg.com/zh-cn/products/gaming-mice/g304-lightspeed-wireless-gaming-mouse.910-005286.html'
        },
        // tp-link-ipc48aw-plus
        {
          name: 'TP-LINK ICP48AW Plus 室内监控',
          image: '/images/tp-link-ipc48aw-plus.png',
          specification: '800W像素 | 双向语音',
          description:
            '专门买来监视猫主子的，360度旋转无死角，连猫砂盆里埋屎的动作都看得一清二楚，双向语音也超实用，上班时看见逆子又在偷偷啃数据线，直接就是嚎一嗓子。',
          link: 'https://www.tp-link.com.cn/product_3279.html'
        },
        {
          name: 'Apple AirTag',
          image: '/images/airtag.png',
          specification: 'U1超宽频芯片 | 精确查找',
          description:
            '给猫主子买的防丢神器，塞进AirTag猫项圈里，U1芯片精准定位，精准到能听见它躲在哪个衣柜角落，只要附近有苹果设备都是你的寻猫雷达。（电池一年一换记得设置提醒）',
          link: 'https://www.apple.com.cn/airtag/'
        }
      ]
    },
    {
      title: '生活用品',
      description: '提升生活品质的装备',
      equipment_list: [
        {
          name: '徕芬 SE2 吹风机',
          image: '/images/lf-se2.webp',
          specification: '白色',
          description:
            '总感觉戴森是智商税，三千块的戴森买不起，几百块的徕芬用着也不差。风速够猛，做工细节也不错，吹完头发没那么毛躁。',
          link: 'https://www.laifen.net/hairdryer/se-2'
        },
        {
          name: '小米 米家手持蒸汽熨烫机',
          image: '/images/guatangji.png',
          specification: '1200W | 20g/min蒸汽量',
          description:
            '买来拯救我那些皱巴巴的衣服，比老式熨斗方便太多了。手柄能折叠，出门塞行李箱也不占地方，就是水箱有点小，熨两件就要加水。',
          link: 'https://www.mi.com/shop/buy/detail?product_id=18388&cfrom=search'
        },
        {
          name: '小米 米家除螨仪2',
          image: '/images/chumanyi.png',
          specification: '高频拍打 / UV紫外线照射',
          description: '常年皮肤过敏，这个除螨仪真的救了我的命，每次用完都能吸出一堆白色粉末。',
          link: 'https://www.mi.com/shop/buy/detail?product_id=19760&cfrom=search'
        },
        {
          name: '米家电动精修螺丝刀',
          image: '/images/luosidao.png',
          specification: '-',
          description: '平时拿来拆个手机，拆个电脑，拆个小电器',
          link: 'https://www.mi.com/shop/buy/detail?product_id=12636'
        }
      ]
    },
    {
      title: '我的收藏',
      description:
        '以下所有图片均为个人收藏的实物拍摄，无篡改无不良引导，仅用于收藏分享与文化交流，非商业用途。所有图片版权归拍摄者（本人）所有，禁止未经授权的转载、盗用或用于任何商业目的。本人严格遵守相关法律法规，展示内容不涉及任何形式的货币改造、仿制或不当使用。',
      equipment_list: [
        {
          name: '2019版 00000403 大开门 8位全同号 全套',
          full: true,
          large: true,
          image: '/images/00000403.jpg',
          specification: '第五套人民币新版 / 1元至100元全同号 / 00000大开门冠号 / 无油无斑无折痕',
          description:
            '我的心头好收藏！从1元到100元全套同号，号码全是00000403，每张都保持无油无斑无折痕的完美状态，灯光下看票面干净得反光，每次拿出来欣赏都特别有成就感。',
          link: false
        },
        {
          name: '2005版 尾号77777 尾豹子号 全套',
          full: true,
          large: true,
          image: '/images/77777.jpg',
          specification: '第五套人民币2005版 / 1元-100元尾号77777 / 尾豹子号',
          description:
            '这套2005版的77777豹子号更是我的得意收藏，全套品相完美，票面崭新挺括，现在都是新版人民币了，2005年版越来越少见，虽然不是8位全同号，但这个尾豹子号也算是凤毛麟角了，每次拿出来欣赏，那个醒目的"77777"尾号都特别抢眼。',
          link: false
        },

        {
          name: '第四套人民币 100连体钞 四连体',
          full: true,
          large: true,
          image: '/images/100-4.jpg',
          specification: '第四套人民币 / 100元四连体 / 未裁切原版',
          description:
            '完整保留着当年的未裁切原貌，没有一点折痕，记得小时候拿压岁钱，百元大钞有红的有蓝的，每次拿到红色的新版都兴奋不已，现在第四套人民币早已经退出流通了，看着这四张连在一起的百元大钞，瞬间就想起小时候拿压岁钱的兴奋感。',
          link: false
        },
        {
          name: '袁大头三年 银元',
          full: true,
          // large: true,
          largeHeight: true,
          image: '/images/minguosannian.jpg',
          specification: '民国三年袁大头 / PCGS AU Detail评级 / 原味包浆',
          description:
            '老一辈人最熟悉的硬通货，在当时一枚大洋足够买好几担大米，时代久远，难免有些流通痕迹，但整体保存得还算相当不错，细节都还在，最喜欢它那种自然的原味包浆。',
          link: false
        },
        {
          name: '光绪元宝 银元',
          full: true,
          // large: true,
          largeHeight: true,
          image: '/images/guangxuyuanbao.jpg',
          specification: '清代官铸银元 / PCGS认证 / 原光品相',
          description:
            '清代银元的代表作，也叫做龙洋，历经百年却依然保留清晰有力的字口，流通痕迹可以说非常的轻，还保留着漂亮的原始包浆。',
          link: false
        },
        {
          name: '飞天茅台 500ml 1997年',
          full: true,
          large: true,
          image: '/images/maotai.png',
          specification: '1997年 | 43度 / 500ml',
          description:
            '1997年的飞天茅台，比我都大好几岁，老一辈收藏的，自然存放28年，顶盖的封膜老化有点裂，缠了一圈胶带，好在顶盖不受影响，酒体保存完好，每年称重都没有跑酒的现象出现，可惜是43度的，要是53度该多好啊，高度酒的话现在得多抢手。不过好歹是实打实的老茅台，就当是个时代的见证吧。',
          link: false
        },
        {
          name: '三连号666666豹子号',
          full: true,
          large: true,
          image: '/images/666666.jpg',
          specification: '10元钞三连号 | 六六大顺豹子号',
          description:
            '光是这"六个六"开头的冠号就够让人喜欢了，三张冠号分别是66666647、66666648、66666649，不仅都是六同豹子号开头，还保持着完美的连号顺序。',
          link: false
        }
      ]
    }
    // {
    //   title: '摄影设备',
    //   description: '用于记录生活点滴',
    //   equipment_list: [
    //     {
    //       name: 'Sony A7III',
    //       image: 'https://img02.anheyu.com/adminuploads/1/2023/07/01/649fb50c6c2a3.png',
    //       specification: '全画幅微单',
    //       description: '主力摄影设备，成像优秀',
    //       link: 'https://www.sony.com/a7iii'
    //     }
    //   ]
    // },
    // {
    //   title: '厨房好物',
    //   description: '让下厨更加简单愉快',
    //   equipment_list: [
    //     {
    //       name: '电饭煲',
    //       image: '/path/to/cooker.jpg',
    //       specification: '4L 多功能',
    //       description: '煮饭、煲汤多用途',
    //       link: '/posts/kitchen-appliances'
    //     }
    //   ]
    // }
  ]
}

// 从主题配置读取，未配置时使用默认数据
const equipmentData = ref({ ...defaultEquipmentData, ...theme.value.equipment })

// 判断是否是外部链接
const isExternalLink = link => {
  if (!link) return
  return link.includes('https://') || link.includes('http://')
}

// 复制文本
const copyText = text => {
  navigator.clipboard.writeText(text).then(() => {
    $message.success(`已复制名称 【 ${text} 】`)
  })
}

// 模拟评论文本功能
const comment = (name, specification, description) => {
  // `${equipment.name} ${equipment.specification} ${equipment.description}`
  commentText(`**${name}** \`${specification}\` *${description}*`)
  // 这里可以实现评论功能
}

// 创建一个封装观察者函数，以便可以被重用
const setupIntersectionObserver = () => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px'
    }
  )

  // 获取所有装备卡片元素并观察它们
  const equipmentItems = document.querySelectorAll('.equipment-item-content-item')
  equipmentItems.forEach(item => {
    // 如果元素还没有fade-in-on-scroll类，则添加
    if (!item.classList.contains('fade-in-on-scroll')) {
      item.classList.add('fade-in-on-scroll')
    }
    // 如果元素还没有fade-in-visible类，则观察它
    if (!item.classList.contains('fade-in-visible')) {
      observer.observe(item)
    }
  })

  return observer
}



onMounted(() => {
  initFancybox(theme.value)

  // 初始化观察者
  const observer = setupIntersectionObserver()
})
</script>
<style lang="scss" scoped>
// 媒体查询混合
@mixin maxWidth1200 {
  @media (max-width: 1200px) {
    @content;
  }
}

@mixin maxWidth768 {
  @media (max-width: 768px) {
    @content;
  }
}

// 添加淡入动画的keyframes
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 淡入效果类
.fade-in-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in-visible {
  opacity: 1;
  transform: translateY(0);
}

.author-content-item {
  border-radius: 24px;
  background: var(--main-card-background);
  border: 1px solid var(--main-card-border);
  box-shadow: 0 8px 16px -4px #2c2d300c;
  position: relative;
  padding: 1.5em 2rem;
  overflow: hidden;
}

.author-content.author-content-item {
  height: 19rem;
  background-position: left 28%;
  background-repeat: no-repeat;
  background-size: cover;
  color: #fff;
  overflow: hidden;
  margin-top: 0;
  background-size: 400%;
  animation: gradient 15s ease infinite;

  .card-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .author-content-item-tips {
    opacity: 0.8;
    font-size: 12px;
    margin-bottom: 1rem;
  }

  .author-content-item-title {
    margin-bottom: 1rem;
    font-size: 36px;
    font-weight: 700;
    line-height: 1;
  }

  .content-bottom {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .tips {
      font-weight: 600;
      color: #fff;
    }
  }
}

@media screen and (min-width: 1200px) {
  .author-content-item {
    animation: slide-in 0.6s 0s backwards;
  }
}

// 我的装备
.goodthings {
  border: 1px solid var(--main-card-border);
  margin: 0.5em 0 0 0;
  padding: 0 1em;
  border-radius: 12px;
  background: linear-gradient(-120deg, var(--main-card-background2), var(--main-card-third-background));

  // background: var(--main-card-background2);
  .goodthings-title {
    margin: 1rem 0;
    line-height: 1;
    font-size: 1.5em;
    color: var(--main-color);
    position: relative;
    display: inline-block;
    padding: 0 5px;
    z-index: 2;

    &::before {
      content: '';
      width: 100%;
      height: 70%;
      background-color: var(--main-color-bg);
      position: absolute;
      left: 0;
      bottom: -20%;
      z-index: -1;
      border-radius: 999px;
    }
  }

  .goodthings-description {
    color: var(--main-font-second-color);
    margin-bottom: 1em;
  }
}

.equipment-item {
  .equipment-item-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 -8px;

    .equipment-item-content-item {
      width: calc(25% - 12px);
      border-radius: 12px;
      border: 1px solid var(--main-card-border);
      overflow: hidden;
      margin: 8px 6px;
      background: var(--main-card-background);
      box-shadow: 0 8px 16px -4px #2c2d300c;
      min-height: 400px;
      position: relative;

      @include maxWidth1200() {
        width: calc(50% - 12px);
      }

      @include maxWidth768() {
        width: 100%;
      }

      .equipment-item-content-item-info {
        padding: 8px 16px 16px 16px;
        margin-top: 12px;
      }

      .equipment-item-content-item-name {
        font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;

        font-size: 18px;
        font-weight: bold;
        line-height: 1;
        margin-bottom: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: fit-content;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
          color: var(--main-color);
        }
      }

      .equipment-item-content-item-specification {
        font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
        font-size: 12px;
        color: var(--main-font-second-color);
        color: var(--main-color-reverse);
        line-height: 16px;
        margin-bottom: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .equipment-item-content-item-description {
        font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
        line-height: 20px;
        color: var(--main-font-second-color);
        height: 80px;
        display: -webkit-box;
        overflow: hidden;
        font-weight: 600;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        font-size: 12px;
      }

      a.equipment-item-content-item-link {
        font-size: 14px;
        background: #9999992b;
        padding: 4px 8px;
        border-radius: 8px;
        cursor: var(--main-pointer-cursor);

        &:hover {
          background: var(--main-color);
          color: #fff;
        }
      }

      .bber-reply {
        .iconfont {
          font-size: 1.4em;
          transition: color 0.3s;

          &:hover {
            color: var(--main-color);
          }
        }
      }

      .equipment-item-content-item-cover {
        width: 100%;
        height: 200px;
        background: var(--main-card-second-background);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &.large {
        width: calc(50% - 12px);
        min-height: 550px;

        .equipment-item-content-item-cover {
          height: 350px;
        }

        @include maxWidth1200() {
          width: 100%;
        }
      }

      &.largeHeight {
        min-height: 550px;

        .equipment-item-content-item-cover {
          height: 350px;
        }
      }

      .equipment-item-content-item-a {
        height: 80%;
        width: 80%;

        &.full {
          height: 95%;
          // border-radius: 30px;
        }
      }

      .equipment-item-content-item-image {
        object-fit: contain;
        height: 100%;
        // width: 100%;
        transition: transform 0.3s;

        &:hover {
          transform: scale(1.02);
        }
      }

      .equipment-item-content-item-toolbar {
        display: flex;
        justify-content: space-between;
        position: absolute;
        bottom: 12px;
        left: 0;
        width: 100%;
        padding: 0 16px;
      }
    }
  }
}

@keyframes highlight-flash {

  0%,
  100% {
    // border: 1px solid var(--main-card-border);
    box-shadow: none;
  }

  50% {
    // border: 1px solid var(--main-color);
    box-shadow: 0 0 0px 3px var(--main-color);
  }
}

.flash-highlight {
  animation: highlight-flash 1s ease-in-out 3;
}
</style>
