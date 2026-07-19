<template>
  <div class="nes-container s-card">
    <div class="game-header">
      <h3>
        <span class="game-title">
          <span class="title-text">{{ currentGame.name.split("-")[0] }}</span>
          <span class="subtitle">NES 模拟器</span>
        </span>
      </h3>
      <div class="select-container header-box">
        <span class="select-label">选择游戏:</span>
        <el-select
          v-model="selectedGame"
          @change="changeGame"
          size="default"
          class="game-select"
          popper-class="game-select-dropdown"
        >
          <el-option
            v-for="game in gameRoms"
            :key="game.id"
            :label="game.name"
            :value="game.id"
          >
            <span class="option-box">
              {{ game.name.split("-")[0] }}
              <el-tag
                round
                type="primary"
                size="small"
                v-if="game.name.split('-')[1]"
                >{{ game.name.split("-")[1] }}</el-tag
              >
            </span>
          </el-option>
          <template #label="{ label }">
            <span class="option-box">
              {{ label.split("-")[0] }}
              <el-tag
                round
                type="primary"
                size="small"
                v-if="label.split('-')[1]"
                >{{ label.split("-")[1] }}</el-tag
              >
            </span>
          </template>
        </el-select>
      </div>
      <div class="video-container header-box">
        <span class="video-label">播放录像:</span>
        <el-button round type="primary" size="small" @click="playDefaultTas"
          >默认TAS录像</el-button
        >
        <el-tooltip
          placement="top"
          content="tip：录像文件仅支持使用原版游戏rom进行播放，使用修改版rom播放录像可能会出现操作不同步的现象"
        >
          <el-button round type="primary" size="small" @click="uploadFm2"
            >上传FM2录像文件</el-button
          >
        </el-tooltip>
        <input
          type="file"
          ref="fm2FileInput"
          class="file-input"
          accept=".fm2"
          @change="onFm2FileSelected"
        />
      </div>
    </div>

    <div class="game-layout">
      <div class="controls-section keyboard">
        <h3>键盘按键说明</h3>
        <div class="control-groups">
          <div class="control-group p1-controls">
            <div class="group-title">P1 玩家</div>
            <div class="keys-container">
              <div class="sub-group">
                <div class="group-title">方向键</div>
                <div class="key-row">
                  <div class="key empty"></div>
                  <div class="key">W</div>
                  <div class="key empty"></div>
                </div>
                <div class="key-row">
                  <div class="key">A</div>
                  <div class="key">S</div>
                  <div class="key">D</div>
                </div>
              </div>

              <div class="sub-group">
                <div class="group-title">动作键</div>
                <div class="key-row">
                  <div class="key turbo">
                    I <span class="key-label">C</span>
                  </div>
                  <div class="key turbo">
                    U <span class="key-label">D</span>
                  </div>
                </div>
                <div class="key-row">
                  <div class="key">K <span class="key-label">A</span></div>
                  <div class="key">J <span class="key-label">B</span></div>
                </div>
              </div>
            </div>

            <div class="sub-group function-keys-p1">
              <div class="group-title">功能键</div>
              <div class="key-row">
                <div class="key special rectangular">
                  Enter <span class="key-label">开始</span>
                </div>
                <div class="key special rectangular">
                  右Shift <span class="key-label">选择</span>
                </div>
              </div>
            </div>
          </div>

          <div class="control-group p2-controls">
            <div class="group-title">P2 玩家</div>
            <div class="keys-container">
              <div class="sub-group">
                <div class="group-title">方向键</div>
                <div class="key-row">
                  <div class="key empty"></div>
                  <div class="key">↑</div>
                  <div class="key empty"></div>
                </div>
                <div class="key-row">
                  <div class="key">←</div>
                  <div class="key">↓</div>
                  <div class="key">→</div>
                </div>
              </div>

              <div class="sub-group">
                <div class="group-title">动作键</div>
                <div class="key-row">
                  <div class="key turbo">
                    5 <span class="key-label">C</span>
                  </div>
                  <div class="key turbo">
                    4 <span class="key-label">D</span>
                  </div>
                </div>
                <div class="key-row">
                  <div class="key">2 <span class="key-label">A</span></div>
                  <div class="key">1 <span class="key-label">B</span></div>
                </div>
              </div>
            </div>
            <div class="key-note">数字小键盘</div>
          </div>

          <div class="key-note">
            带<span class="turbo-dot"></span>为连发键，适合射击类游戏
          </div>
        </div>
      </div>

      <div class="game-container">
        <Suspense>
          <NesVue
            ref="nesRef"
            label="点击屏幕中央加载游戏"
            class="nes-game"
            :width="gameWidth"
            :height="gameHeight"
            :p1="controls.p1"
            :p2="controls.p2"
            :url="currentRomUrl"
            :no-clip="false"
            :turbo="22"
            @success="onGameLoaded"
          />
          <template #fallback>
            <div class="fallback-loading">加载中...</div>
          </template>
        </Suspense>
      </div>

      <div class="controls-section function-keys">
        <h3>功能快捷键</h3>
        <div class="function-keys-list">
          <div class="function-key">
            <span class="key-name" :class="{ 'with-shift': preventMistouch }">
              <template v-if="preventMistouch">Shift + N</template>
              <template v-else>N</template>
            </span>
            <span class="key-desc">快速存档</span>
          </div>
          <div class="function-key">
            <span class="key-name" :class="{ 'with-shift': preventMistouch }">
              <template v-if="preventMistouch">Shift + R</template>
              <template v-else>R</template>
            </span>
            <span class="key-desc">重置游戏</span>
          </div>
          <div class="function-key">
            <span class="key-name" :class="{ 'with-shift': preventMistouch }">
              <template v-if="preventMistouch">Shift + M</template>
              <template v-else>M</template>
            </span>
            <span class="key-desc">快速读档</span>
          </div>
          <div class="function-key">
            <span class="key-name" :class="{ 'with-shift': preventMistouch }">
              <template v-if="preventMistouch">Shift + P</template>
              <template v-else>P</template>
            </span>
            <span class="key-desc">游戏截图</span>
          </div>
          <div class="function-key">
            <span class="key-name" :class="{ 'with-shift': preventMistouch }">
              <template v-if="preventMistouch">Shift + O</template>
              <template v-else>O</template>
            </span>
            <span class="key-desc">暂停/继续</span>
          </div>
          <div class="function-key danger">
            <span class="key-name" :class="{ 'with-shift': preventMistouch }">
              Shift + Q
            </span>
            <span class="key-desc">清空存档</span>
          </div>
        </div>
        <div class="function-keys-list">
          <div class="function-key">
            <span class="key-name success"> Shift + 1 </span>
            <span class="key-desc">存档 <span class="key-num">1</span></span>
          </div>
          <div class="function-key">
            <span class="key-name success"> Shift + 2 </span>
            <span class="key-desc">读档 <span class="key-num">1</span> </span>
          </div>
          <div class="function-key">
            <span class="key-name success"> Shift + 3 </span>
            <span class="key-desc">存档 <span class="key-num">2</span></span>
          </div>
          <div class="function-key">
            <span class="key-name success"> Shift + 4 </span>
            <span class="key-desc">读档 <span class="key-num">2</span></span>
          </div>
        </div>

        <div class="prevent-mistouch">
          <div class="switch-container">
            <span class="switch-label">防误触模式</span>
            <label class="switch">
              <input type="checkbox" v-model="preventMistouch" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="switch-hint" v-if="preventMistouch">
            已开启，需按 Shift+按键 激活功能
          </div>
        </div>

        <div class="game-info">
          <p>操作提示：</p>
          <ul>
            <li class="bold">点击游戏屏幕中央开始游戏</li>
            <li class="bold">I/U 键为连发键，适合射击类游戏</li>
            <li class="bold">支持双人游戏（P2使用方向键和小键盘）</li>
            <li class="bold">支持手柄控制，连接即可使用</li>
            <li class="bold">存档会保存在IndexDB中</li>
          </ul>
        </div>

        <div
          class="rom-upload-area"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
          :class="{ dragging: isDragging }"
          @click="triggerFileInput"
        >
          <input
            type="file"
            ref="fileInput"
            class="file-input"
            accept=".nes"
            @change="onFileSelected"
          />
          <div class="upload-content">
            <div class="upload-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div class="upload-text">
              没有想玩的游戏？不想玩无敌版？<br />
              将ROM拖放到此处<br />
              或点击此处上传ROM加载游戏
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="toast-container" v-if="toastMessage">
      <div class="toast-message">
        {{ toastMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  nextTick,
  reactive,
  defineAsyncComponent,
} from "vue";
import { ElSelect, ElOption, ElTag, ElButton, ElTooltip } from "element-plus";
// 改为异步导入
const NesVue = defineAsyncComponent({
  loader: () => import("nes-vue").then((module) => module.NesVue),
  loadingComponent: {
    template:
      '<div class="nes-loading"><div class="loading-spinner"></div><div class="loading-text">加载模拟器中...</div></div>',
  },
  errorComponent: {
    template: '<div class="nes-error">模拟器加载失败，请刷新页面重试</div>',
  },
  delay: 200,
  timeout: 10000,
});

const nesRef = ref(null);
const isPaused = ref(false);
const toastMessage = ref("");
const saveId = ref("mario-save-01");
const isGameLoaded = ref(false);
const windowWidth = ref(0);

if (!import.meta.env.SSR) {
  windowWidth.value = window.innerWidth;
}
const preventMistouch = ref(false);
const fileInput = ref(null);
const fm2FileInput = ref(null);
const isDragging = ref(false);

// 从 themeConfig.nes 读取 ROM 列表（默认配置已含超级马里奥，无需额外导入）
const { theme } = useData();
const nesConfig = computed(() => theme.value?.nes || {});
const gameRoms = computed(() => nesConfig.value.roms || []);
const defaultRomId = computed(() => nesConfig.value.defaultRomId || gameRoms.value[0]?.id || "mario");
const selectedGame = ref(defaultRomId.value);

// 当前选中的游戏信息
const currentGame = computed(() => {
  return (
    gameRoms.value.find((game) => game.id === selectedGame.value) ||
    gameRoms.value[0]
  );
});

// 当前游戏ROM的URL
const currentRomUrl = computed(() => {
  return currentGame.value.url;
});

// 添加多存档位 ID
const saveId0 = computed(() => `${currentGame.value.savePrefix}-save-00`);
const saveId1 = computed(() => `${currentGame.value.savePrefix}-save-01`);
const saveId2 = computed(() => `${currentGame.value.savePrefix}-save-02`);

// 切换游戏
async function changeGame() {
  if (!nesRef.value) return;

  try {
    // 先暂停当前游戏
    // if (isGameLoaded.value) {
    //   nesRef.value.pause()
    // }

    // 更新存档ID
    saveId.value = `${currentGame.value.savePrefix}-save-01`;

    // 重置游戏状态
    // isGameLoaded.value = false
    // isPaused.value = false

    // 显示加载提示
    showToast("正在加载游戏...", "info");
  } catch (error) {
    console.error("切换游戏失败:", error);
    showToast("切换游戏失败", "error");
  }
}

// 属性值是 KeyboardEvent.code
const controls = ref({
  p1: {
    UP: "KeyW",
    DOWN: "KeyS",
    LEFT: "KeyA",
    RIGHT: "KeyD",
    A: "KeyK",
    B: "KeyJ",
    C: "KeyI",
    D: "KeyU",
    SELECT: "ShiftRight",
    START: "Enter",
  },
  p2: {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    A: "Numpad2",
    B: "Numpad1",
    C: "Numpad5",
    D: "Numpad4",
  },
});
// 响应式游戏尺寸计算
const gameWidth = computed(() => {
  if (windowWidth.value <= 900) {
    // 移动设备上占据更大的空间
    return Math.min(500, windowWidth.value - 40); // 减去一些边距
  } else {
    // 桌面设备根据整体布局适配
    return 720;
  }
});

const gameHeight = computed(() => {
  // 保持16:15的近似比例
  return Math.round(gameWidth.value * 0.937);
});

// 监听窗口大小变化
function handleResize() {
  windowWidth.value = window.innerWidth;
}

// Toast 消息显示
function showToast(message, type = "info") {
  // toastMessage.value = message
  // setTimeout(() => {
  //   toastMessage.value = ''
  // }, 2000)
  $message[type](message, {
    duration: 1000,
  });
}

// 游戏加载完成
function onGameLoaded() {
  isGameLoaded.value = true;
  showToast("游戏加载完成", "success");
}

// 键盘事件处理
function handleKeyDown(event) {
  if (!isGameLoaded.value || !nesRef.value) return;

  const key = event.key.toLowerCase();

  // 判断是否需要 Shift 键
  if (preventMistouch.value) {
    // 防误触模式下需要按住Shift键
    if (!event.shiftKey) return;
  }

  // 如果是清空存档功能，必须按下 Shift+Q 组合键
  if (key === "q" && event.shiftKey) {
    clearAllSaves();
    return;
  }

  // 数字键映射 - 主键盘上的数字键（非小键盘）
  if (event.shiftKey) {
    // 判断是数字键且不是小键盘的数字键（event.code以Digit开头的是主键盘数字键）
    switch (event.code) {
      case "Digit1":
        saveGameToSlot(1);
        break;
      case "Digit2":
        loadGameFromSlot(1);
        break;
      case "Digit3":
        saveGameToSlot(2);
        break;
      case "Digit4":
        loadGameFromSlot(2);
        break;
    }
  }

  // 普通功能键
  if (!preventMistouch.value || (preventMistouch.value && event.shiftKey)) {
    switch (key) {
      case "n":
        saveGame();
        break;
      case "m":
        loadGame();
        break;
      case "o":
        togglePause();
        break;
      case "r":
        resetGame();
        break;
      case "p":
        screenShot();
        break;
    }
  }
}

// 清空所有存档
function clearAllSaves() {
  if (!isGameLoaded.value || !nesRef.value) return;
  try {
    nesRef.value.clear();
    showToast("所有存档已清空", "warning");
  } catch (error) {
    showToast("清空存档失败", "error");
    console.error("清空存档失败:", error);
  }
}

// 保存到指定存档位
function saveGameToSlot(slot) {
  if (!isGameLoaded.value || !nesRef.value) return;
  try {
    const slotId = slot === 1 ? saveId1.value : saveId2.value;
    nesRef.value.save(slotId);
    showToast(`已保存到存档 ${slot}`, "success");
  } catch (error) {
    showToast("存档失败", "error");
    console.error("存档失败:", error);
  }
}

// 从指定存档位读取
function loadGameFromSlot(slot) {
  if (!isGameLoaded.value || !nesRef.value) return;
  try {
    const slotId = slot === 1 ? saveId1.value : saveId2.value;
    nesRef.value.load(slotId);
    showToast(`已读取存档 ${slot}`, "success");
  } catch (error) {
    showToast(`读取存档 ${slot} 失败，可能没有存档`, "error");
    console.error("读档失败:", error);
  }
}

// 修改普通存档功能使用存档位0
function saveGame() {
  if (!isGameLoaded.value || !nesRef.value) return;
  try {
    nesRef.value.save(saveId0.value);
    showToast("游戏已存档", "success");
  } catch (error) {
    showToast("存档失败", "error");
    console.error("存档失败:", error);
  }
}

function loadGame() {
  if (!isGameLoaded.value || !nesRef.value) return;
  try {
    nesRef.value.load(saveId0.value);
    showToast("读档成功", "success");
  } catch (error) {
    showToast("读档失败，可能没有存档", "error");
    console.error("读档失败:", error);
  }
}

// 截图功能
function screenShot() {
  if (!isGameLoaded.value || !nesRef.value) return;
  try {
    nesRef.value.screenshot(true, "super-mario-screenshot");
    showToast("截图已保存", "success");
  } catch (error) {
    showToast("截图失败", "error");
    console.error("截图失败:", error);
  }
}

// 重置游戏
function resetGame() {
  if (!isGameLoaded.value || !nesRef.value) return;
  nesRef.value.reset();
  showToast("游戏已重置", "info");
}

// 暂停/继续游戏
function togglePause() {
  if (!isGameLoaded.value || !nesRef.value) return;

  if (isPaused.value) {
    nesRef.value.play();
    isPaused.value = false;
    showToast("游戏继续", "info");
  } else {
    nesRef.value.pause();
    isPaused.value = true;
    showToast("游戏已暂停", "info");
  }
}

// 挂载和卸载键盘事件监听
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("resize", handleResize);
});

// 触发文件选择
function triggerFileInput() {
  fileInput.value.click();
}

// 拖拽相关处理
function onDragOver(e) {
  isDragging.value = true;
}

function onDragLeave(e) {
  isDragging.value = false;
}

async function onDrop(e) {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file && file.name.toLowerCase().endsWith(".nes")) {
    await handleRomFile(file);
  } else {
    showToast("请上传.nes格式的ROM文件", "error");
  }
}

// 文件选择处理
async function onFileSelected(e) {
  // console.log('文件选择处理', e)
  const file = e.target.files[0];
  if (file && file.name.toLowerCase().endsWith(".nes")) {
    await handleRomFile(file);
    // console.log('文件选择处理', file)
  } else {
    showToast("请上传.nes格式的ROM文件", "error");
  }
  // 清空input，以便可以重复选择同一个文件
  e.target.value = "";
}

// 处理ROM文件
async function handleRomFile(file) {
  try {
    // 先暂停当前游戏
    if (isGameLoaded.value && nesRef.value) {
      nesRef.value.pause();
    }

    const customGame = {
      id: "custom-" + Date.now(),
      name: file.name.replace(".nes", ""),
      url: URL.createObjectURL(file),
      savePrefix: "custom-" + Date.now(),
    };
    // 添加到游戏列表
    gameRoms.value.push(customGame);

    // 等待一下确保组件状态更新
    await nextTick();

    // 切换到新游戏
    selectedGame.value = customGame.id;
    // 触发游戏切换
    await changeGame();

    showToast("ROM加载成功", "success");
  } catch (error) {
    console.error("ROM加载失败:", error);
    showToast("ROM加载失败", "error");
  }
}

// 播放默认TAS录像
async function playDefaultTas() {
  if (!isGameLoaded.value || !nesRef.value) {
    showToast("请先加载游戏", "warning");
    return;
  }
  try {
    const url = currentGame.value.fm2;
    if (!url) {
      $message.info("当前游戏没有默认录像文件，请自行上传");
      return;
    }
    await nesRef.value.fm2URL(url).then((fm2Play) => {
      fm2Play();
      showToast("开始播放TAS录像", "success");
    });
  } catch (error) {
    console.error("播放TAS录像失败:", error);
    showToast("播放TAS录像失败", "error");
  }
}

// 触发FM2文件选择
function uploadFm2() {
  fm2FileInput.value.click();
}

// FM2文件选择处理
async function onFm2FileSelected(e) {
  const file = e.target.files[0];
  if (!file || !file.name.toLowerCase().endsWith(".fm2")) {
    showToast("请选择.fm2格式的录像文件", "error");
    return;
  }

  if (!isGameLoaded.value || !nesRef.value) {
    showToast("请先加载游戏", "warning");
    return;
  }

  try {
    const text = await file.text();
    await nesRef.value.fm2Text(text);
    nesRef.value.fm2Play();
    showToast("开始播放FM2录像", "success");
  } catch (error) {
    console.error("播放FM2录像失败:", error);
    showToast("播放FM2录像失败", "error");
  }
  // 清空input，以便可以重复选择同一个文件
  e.target.value = "";
}
</script>

<style lang="scss" scoped>
.nes-container {
  margin: 0 auto 2rem;
  font-family: var(--main-font-family);
  color: var(--main-font-color);
  transition: all 0.3s ease;
  cursor: var(--main-default-cursor);
}

.game-header {
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid var(--main-card-border);
  padding-bottom: 15px;

  h3 {
    font-size: 1.8rem !important;
    margin: 0;
    color: var(--main-color);
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: none;

    .game-title {
      display: flex;
      align-items: baseline;
      gap: 10px;
    }

    .title-text {
      min-width: 80px;
    }

    .subtitle {
      font-size: 1rem;
      color: var(--main-font-second-color);
      font-weight: normal;
    }
  }
}

.header-box {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 340px;
}
.select-container {
  position: absolute;
  left: 10px;
}
.video-container {
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 8px;

  .video-label {
    font-size: 20px;
    color: var(--main-color-reverse);
    white-space: nowrap;
  }

  :deep(.el-button) {
    background-color: var(--main-color-bg);
    border-color: var(--main-color);
    color: var(--main-color);

    &:hover {
      background-color: var(--main-color);
      border-color: var(--main-color);
      color: #fff;
    }
  }

  .file-input {
    display: none;
  }
}

.select-label {
  font-size: 20px;
  color: var(--main-color-reverse);
  white-space: nowrap;
}

:deep(.game-select) {
  width: 230px;

  .el-input__wrapper {
    background-color: var(--main-card-second-background);
    box-shadow: 0 0 0 1px var(--main-card-border);

    &:hover {
      box-shadow: 0 0 0 1px var(--main-color);
    }

    &.is-focus {
      box-shadow: 0 0 0 1px var(--main-color);
    }
  }

  .el-input__inner {
    color: var(--main-font-color);
    font-size: 14px;
  }
}

@media (max-width: 1200px) {
  .game-header {
    flex-direction: column;
    gap: 15px;
    .select-container {
      position: relative;
      left: 0;
    }
  }

  .video-container {
    position: relative;
    right: 0;
    justify-content: center;
  }
}

.game-layout {
  display: grid;
  gap: 15px;
  align-items: start;

  @media (min-width: 1401px) {
    /* 大屏幕三栏布局 */
    grid-template-columns: 1.2fr 2fr 1.2fr;
    // .function-keys {
    //   min-width: 305px;
    // }
  }

  @media (max-width: 1400px) {
    /* 中等屏幕两栏布局，按键说明移到下方 */
    grid-template-columns: 2fr 2fr;
    grid-template-areas:
      "game function"
      "keyboard keyboard";

    .game-container {
      grid-area: game;
    }

    .controls-section.keyboard {
      grid-area: keyboard;
      width: 100%;
      margin-top: 15px;
      border-top: 1px solid var(--main-card-border);
      padding-top: 15px;
    }

    .controls-section.function-keys {
      grid-area: function;
    }
  }

  @media (max-width: 1200px) {
    /* 小屏幕单栏布局 */
    grid-template-columns: 1fr;
    grid-template-areas:
      "game"
      "function"
      "keyboard";

    .game-container {
      margin: 0 auto;
    }
  }
}

.game-container {
  position: relative;
}

:deep(.nes-game) {
  border: 5px solid var(--main-card-border);
  border-radius: 30px;
  box-shadow: var(--main-shadow-blackdeep);
  background-color: #000;
  transition: all 0.3s ease;
  max-width: 100%;
  position: relative;
  canvas {
    transform: scale(1.07) translateX(1px) translateY(-0.5px);
  }
  & div:nth-of-type(2) {
    border: 2px solid #3d3d3f;
    border-radius: 10px;
    padding: 5px 10px;
    color: #a1a2b8 !important;
    cursor: var(--main-pointer-cursor) !important;
    background-color: #1b1c20;
    transition: all 0.3s ease;
    &:hover {
      background-color: #2d2f33;
      color: var(--main-color) !important;
    }
  }

  &:hover {
    box-shadow: var(--main-shadow-blue);
    border-color: var(--main-color);
  }
  &::before {
  }
}
.fallback-loading{
  border: 5px solid var(--main-card-border);
  border-radius: 30px;
  box-shadow: var(--main-shadow-blackdeep);
  background-color: #000;
  transition: all 0.3s ease;
  max-width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  color: var(--main-color);
  font-weight: 600;

}

.controls-section {
  background-color: var(--main-card-background);
  border-radius: 10px;
  padding: 15px;
  box-shadow: var(--main-shadow-border);
  border: var(--style-border);
  height: 100%;

  h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: var(--main-color);
    font-size: 18px;
    text-align: center;
    border-bottom: 1px solid var(--main-card-border);
    padding-bottom: 8px;
  }
}

.control-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-group {
  text-align: center;

  .group-title {
    font-weight: bold;
    margin-bottom: 8px;
    color: var(--main-font-second-color);
  }

  &.p1-controls,
  &.p2-controls {
    border: 1px solid var(--main-card-border);
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 15px;
    background-color: var(--main-card-second-background);

    .group-title {
      margin-top: 0;
    }
  }

  &.p1-controls {
    border-left: 3px solid var(--main-color);
  }

  &.p2-controls {
    border-left: 3px solid var(--main-color-reverse);
  }
}

.keys-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
}

.function-keys-p1 {
  max-width: 150px;
  margin: 0 auto;
}

.sub-group {
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
}

.key-row {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 4px;
}

.key {
  width: 40px;
  height: 40px;
  background-color: var(--main-card-second-background);
  border: 1px solid var(--main-card-border);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: var(--main-shadow-border);
  position: relative;

  &.empty {
    visibility: hidden;
  }

  &.rectangular {
    width: auto;
    min-width: 100px;
    padding: 0 10px;
  }

  &.turbo {
    background-color: var(--main-color-bg);
    border-color: var(--main-color);
    color: var(--main-color);

    &::after {
      content: "";
      position: absolute;
      top: 5px;
      right: 5px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--main-color);
    }
  }

  &.special {
    background-color: var(--main-color-reverse-bg);
    border-color: var(--main-color-reverse);
    color: var(--main-color-reverse);
  }

  .key-label {
    position: absolute;
    bottom: 2px;
    right: 2px;
    font-size: 9px;
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 2px solid var(--main-color);
    outline-offset: 2px;
  }
}

.turbo-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--main-color);
  margin: 0 3px;
}

.key-note {
  font-size: 12px;
  color: var(--main-font-second-color);
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.function-keys-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
}

.function-key {
  display: flex;
  align-items: center;
  gap: 10px;
  &.danger {
    .key-name {
      background-color: var(--main-color-error-bg) !important;
      color: var(--main-color-error) !important;
    }
  }
  .key-num {
    font-size: 12px;
    color: var(--main-color-success);
    border: 1px solid var(--main-color-success);
    border-radius: 4px;
    padding: 0 4px;
  }
  .key-name {
    background-color: var(--main-color-bg);
    color: var(--main-color);
    padding: 5px 8px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 12px;
    min-width: 40px;
    text-align: center;
    box-shadow: var(--main-shadow-border);
    transition: all 0.3s ease;
    &.success {
      background-color: var(--main-color-success-bg2) !important;
      color: var(--main-color-success) !important;
    }
    &.with-shift {
      min-width: 70px;
      background-color: var(--main-color-bg2);
      color: var(--main-color);
    }

    &:focus-visible {
      outline: 2px solid var(--main-color);
      outline-offset: 2px;
    }
  }

  .key-desc {
    font-size: 14px;
    color: var(--main-font-color);
  }
}

.prevent-mistouch {
  margin: 15px 0;
  padding: 10px;
  background-color: var(--main-card-second-background);
  border-radius: 8px;
  border: 1px solid var(--main-card-border);
}

.switch-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.switch-label {
  font-weight: bold;
  color: var(--main-font-second-color);
}

.switch-hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--main-color);
  text-align: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--main-card-border);
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--main-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--main-color);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.game-info {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid var(--main-card-border);

  p {
    margin: 0;
    font-weight: bold;
    color: var(--main-font-second-color);
  }

  ul {
    margin: 0;
    padding-left: 20px;

    li {
      margin: 0;
      font-size: 12px;
      color: var(--main-font-second-color);
      list-style-type: none !important;
      &::before {
        top: 7.5px;
      }
      &.bold {
        font-weight: bold;
        color: var(--main-color);
      }
    }
  }
}

.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}

.toast-message {
  background-color: var(--main-color-bg3);
  color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  animation: fadeIn 0.3s, fadeOut 0.3s 1.7s;
  box-shadow: var(--main-shadow-blue);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

// 添加响应式媒体查询
@media (max-width: 767px) {
  .nes-container {
    padding: 10px;
  }

  .control-btn {
    padding: 6px 10px;

    .btn-icon {
      font-size: 18px;
    }

    span {
      font-size: 11px;
    }
  }

  .keys-container {
    flex-direction: column;
    gap: 10px;
  }

  .key {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .controls-section {
    padding: 10px;
  }

  .key {
    width: 35px;
    height: 35px;
    font-size: 0.9em;
  }

  .function-key {
    .key-name {
      min-width: 35px;
      font-size: 12px;
    }
    .key-desc {
      font-size: 12px;
    }
  }
}

.rom-upload-area {
  margin-top: 20px;
  border: 2px dashed var(--main-card-border);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background-color: var(--main-card-second-background);

  &:hover {
    border-color: var(--main-color);
    background-color: var(--main-color-bg);

    .upload-icon svg {
      stroke: var(--main-color);
    }

    .upload-text {
      color: var(--main-color);
    }
  }

  &.dragging {
    border-color: var(--main-color);
    background-color: var(--main-color-bg2);

    .upload-icon svg {
      stroke: var(--main-color);
      transform: scale(1.1);
    }

    .upload-text {
      color: var(--main-color);
    }
  }
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  svg {
    stroke: var(--main-font-second-color);
    transition: all 0.3s ease;
  }
}

.upload-text {
  font-size: 14px;
  color: var(--main-font-second-color);
  line-height: 1.5;
  transition: all 0.3s ease;
}

.controls-section.keyboard {
  position: relative;
  transition: all 0.3s ease;

  @media (max-width: 1400px) {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .control-groups {
      display: flex;
      justify-content: center;
      gap: 30px;
      flex-wrap: wrap;
    }

    .control-group {
      flex: 0 0 auto;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}

.nes-loading,
.nes-error {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--main-card-second-background);
  border-radius: 10px;
  border: 15px solid var(--main-card-border);
  color: var(--main-font-color);
}

.nes-error {
  color: var(--main-color-reverse);
  font-weight: bold;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--main-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.loading-text {
  font-size: 16px;
  font-weight: bold;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
