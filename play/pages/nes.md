---
title: NES 模拟器
fullWidth: true
comment: true
description: 在线NES(任天堂红白机)模拟器，小霸王模拟器，支持上传游戏ROM文件和Ms2录像文件。无需下载，直接在浏览器中运行经典NES游戏，并支持TAS录像的播放功能。支持存档/读档、按键配置等实用功能。兼容超级马里奥、魂斗罗、冒险岛、恶魔城、洛克人等经典红白机游戏。
card: false
---

<script setup>
import { NesGame } from 'vitepress-theme-ninc/views'
</script>

<ClientOnly>
    <NesGame />
</ClientOnly>
