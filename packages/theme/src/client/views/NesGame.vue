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
        <div class="cheat-wrapper" ref="cheatWrapperRef">
          <div class="cheat-bar">
            <button
              class="cheat-toggle-btn"
              :class="{ active: showCheatPanel }"
              @click="showCheatPanel = !showCheatPanel"
              title="金手指"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 21v-4a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v4" />
                <path d="M12 3a4 4 0 0 1 4 4c0 1.5-.5 2.5-1.5 3.5L12 13l-2.5-2.5C8.5 9.5 8 8.5 8 7a4 4 0 0 1 4-4z" />
                <path d="M12 7v6" />
              </svg>
              <span>金手指</span>
              <span v-if="activeCheatCount" class="cheat-badge">{{ activeCheatCount }}</span>
              <svg
                class="cheat-toggle-chevron"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          <transition name="cheat-pop">
            <div v-if="showCheatPanel" class="cheat-panel" @click.stop>
              <div class="cheat-input-row">
                <input
                  v-model="cheatCodeInput"
                  class="cheat-input cheat-code-input"
                  placeholder="XXXX-YY-ZZ"
                  spellcheck="false"
                  @keyup.enter="addCheat"
                />
                <input
                  v-model="cheatNameInput"
                  class="cheat-input cheat-name-input"
                  placeholder="备注（可选）"
                  spellcheck="false"
                  @keyup.enter="addCheat"
                />
                <button class="cheat-add-btn" @click="addCheat">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span>添加</span>
                </button>
              </div>

              <div v-if="cheats.length" class="cheat-list">
                <div
                  v-for="c in cheats"
                  :key="c.code"
                  class="cheat-item"
                  :class="{ disabled: !c.enabled }"
                >
                  <span class="cheat-status-dot" :class="{ on: c.enabled }"></span>
                  <span class="cheat-name">{{ c.name || "未命名" }}</span>
                  <code class="cheat-code">{{ c.code }}</code>
                  <button
                    class="cheat-action"
                    :class="{ primary: !c.enabled }"
                    @click="toggleCheat(c)"
                  >
                    {{ c.enabled ? "关闭" : "开启" }}
                  </button>
                  <button
                    class="cheat-action danger"
                    title="删除"
                    @click="removeCheat(c)"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    </svg>
                  </button>
                </div>
                <button class="cheat-clear-all" @click="clearAllCheats">
                  全部关闭
                </button>
              </div>
              <div v-else class="cheat-empty">
                尚未添加金手指，格式如
                <code>079F-01-01</code>（兼容 VirtuaNES）
              </div>
            </div>
          </transition>
        </div>
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
        <div class="controls-header">
          <h3>键盘按键说明</h3>
          <div class="controls-actions">
            <button
              class="customize-toggle"
              :class="{ active: customizeMode }"
              @click="toggleCustomize"
              :title="customizeMode ? '退出自定义' : '自定义按键'"
            >
              <svg
                v-if="customizeMode"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M20 7h-9" />
                <path d="M14 17H5" />
                <circle cx="17" cy="17" r="3" />
                <circle cx="7" cy="7" r="3" />
              </svg>
              <span>{{ customizeMode ? '完成' : '自定义' }}</span>
            </button>
            <button
              v-if="customizeMode"
              class="customize-reset"
              @click="resetKeymap"
              title="恢复默认按键"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>恢复默认</span>
            </button>
          </div>
        </div>

        <div v-if="customizeMode" class="customize-tip">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <span>点击下方任意按键 → 按下新键位即可（Esc 取消）</span>
        </div>

        <div class="control-groups">
          <div class="control-group p1-controls">
            <div class="group-title">P1 玩家</div>
            <div class="keys-container">
              <div class="sub-group">
                <div class="group-title">方向键</div>
                <div class="key-row">
                  <div class="key empty"></div>
                  <div
                    class="key"
                    :class="keyClass('p1', 'UP')"
                    @click="startEditKey('p1', 'UP')"
                  >
                    <template v-if="editingKey === 'p1.UP'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p1.UP) }}</template>
                  </div>
                  <div class="key empty"></div>
                </div>
                <div class="key-row">
                  <div
                    class="key"
                    :class="keyClass('p1', 'LEFT')"
                    @click="startEditKey('p1', 'LEFT')"
                  >
                    <template v-if="editingKey === 'p1.LEFT'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p1.LEFT) }}</template>
                  </div>
                  <div
                    class="key"
                    :class="keyClass('p1', 'DOWN')"
                    @click="startEditKey('p1', 'DOWN')"
                  >
                    <template v-if="editingKey === 'p1.DOWN'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p1.DOWN) }}</template>
                  </div>
                  <div
                    class="key"
                    :class="keyClass('p1', 'RIGHT')"
                    @click="startEditKey('p1', 'RIGHT')"
                  >
                    <template v-if="editingKey === 'p1.RIGHT'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p1.RIGHT) }}</template>
                  </div>
                </div>
              </div>

              <div class="sub-group">
                <div class="group-title">动作键</div>
                <div class="key-row">
                  <div
                    class="key turbo"
                    :class="keyClass('p1', 'C')"
                    @click="startEditKey('p1', 'C')"
                  >
                    <template v-if="editingKey === 'p1.C'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p1.C) }} <span class="key-label">C</span></template>
                  </div>
                  <div
                    class="key turbo"
                    :class="keyClass('p1', 'D')"
                    @click="startEditKey('p1', 'D')"
                  >
                    <template v-if="editingKey === 'p1.D'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p1.D) }} <span class="key-label">D</span></template>
                  </div>
                </div>
                <div class="key-row">
                  <div
                    class="key"
                    :class="keyClass('p1', 'A')"
                    @click="startEditKey('p1', 'A')"
                  >
                    <template v-if="editingKey === 'p1.A'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p1.A) }} <span class="key-label">A</span></template>
                  </div>
                  <div
                    class="key"
                    :class="keyClass('p1', 'B')"
                    @click="startEditKey('p1', 'B')"
                  >
                    <template v-if="editingKey === 'p1.B'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p1.B) }} <span class="key-label">B</span></template>
                  </div>
                </div>
              </div>
            </div>

            <div class="sub-group function-keys-p1">
              <div class="group-title">功能键</div>
              <div class="key-row">
                <div
                  class="key special rectangular"
                  :class="keyClass('p1', 'START')"
                  @click="startEditKey('p1', 'START')"
                >
                  <template v-if="editingKey === 'p1.START'">按新键…</template>
                  <template v-else>{{ formatKey(controls.p1.START) }} <span class="key-label">开始</span></template>
                </div>
                <div
                  class="key special rectangular"
                  :class="keyClass('p1', 'SELECT')"
                  @click="startEditKey('p1', 'SELECT')"
                >
                  <template v-if="editingKey === 'p1.SELECT'">按新键…</template>
                  <template v-else>{{ formatKey(controls.p1.SELECT) }} <span class="key-label">选择</span></template>
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
                  <div
                    class="key"
                    :class="keyClass('p2', 'UP')"
                    @click="startEditKey('p2', 'UP')"
                  >
                    <template v-if="editingKey === 'p2.UP'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p2.UP) }}</template>
                  </div>
                  <div class="key empty"></div>
                </div>
                <div class="key-row">
                  <div
                    class="key"
                    :class="keyClass('p2', 'LEFT')"
                    @click="startEditKey('p2', 'LEFT')"
                  >
                    <template v-if="editingKey === 'p2.LEFT'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p2.LEFT) }}</template>
                  </div>
                  <div
                    class="key"
                    :class="keyClass('p2', 'DOWN')"
                    @click="startEditKey('p2', 'DOWN')"
                  >
                    <template v-if="editingKey === 'p2.DOWN'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p2.DOWN) }}</template>
                  </div>
                  <div
                    class="key"
                    :class="keyClass('p2', 'RIGHT')"
                    @click="startEditKey('p2', 'RIGHT')"
                  >
                    <template v-if="editingKey === 'p2.RIGHT'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p2.RIGHT) }}</template>
                  </div>
                </div>
              </div>

              <div class="sub-group">
                <div class="group-title">动作键</div>
                <div class="key-row">
                  <div
                    class="key turbo"
                    :class="keyClass('p2', 'C')"
                    @click="startEditKey('p2', 'C')"
                  >
                    <template v-if="editingKey === 'p2.C'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p2.C) }} <span class="key-label">C</span></template>
                  </div>
                  <div
                    class="key turbo"
                    :class="keyClass('p2', 'D')"
                    @click="startEditKey('p2', 'D')"
                  >
                    <template v-if="editingKey === 'p2.D'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p2.D) }} <span class="key-label">D</span></template>
                  </div>
                </div>
                <div class="key-row">
                  <div
                    class="key"
                    :class="keyClass('p2', 'A')"
                    @click="startEditKey('p2', 'A')"
                  >
                    <template v-if="editingKey === 'p2.A'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p2.A) }} <span class="key-label">A</span></template>
                  </div>
                  <div
                    class="key"
                    :class="keyClass('p2', 'B')"
                    @click="startEditKey('p2', 'B')"
                  >
                    <template v-if="editingKey === 'p2.B'">按新键…</template>
                    <template v-else>{{ formatKey(controls.p2.B) }} <span class="key-label">B</span></template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="key-note">
            带<span class="turbo-dot"></span>为连发键，适合射击类游戏
            <span v-if="formatKey(controls.p2.A).endsWith('*')">*</span>
            <span v-if="formatKey(controls.p2.A).endsWith('*')" class="key-note-suffix">表示小键盘</span>
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

    // 切换游戏后加载该游戏对应的金手指列表（不自动启用）
    loadCheats();

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

// 内置默认按键（KeyboardEvent.code）
// P2 不依赖小键盘，笔记本也能用
const DEFAULT_CONTROLS = {
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
};

// localStorage 持久化键名
const KEYMAP_STORAGE_KEY = "vitepress-theme-ninc:nes-keymap";

/**
 * 三层合并：localStorage > themeConfig.nes.keymap > DEFAULT_CONTROLS
 * - DEFAULT_CONTROLS：内置默认，保证开箱可用
 * - themeConfig：站点作者在 themeConfig.ts 里改的默认值（构建期）
 * - localStorage：玩家运行时通过 UI 改键的覆盖（运行期，浏览器持久化）
 */
function loadControls() {
  // 第 1 层：内置默认
  const merged = {
    p1: { ...DEFAULT_CONTROLS.p1 },
    p2: { ...DEFAULT_CONTROLS.p2 },
  };

  // 第 2 层：themeConfig.nes.keymap 覆盖（构建期配置）
  const cfgKeymap = nesConfig.value.keymap;
  if (cfgKeymap) {
    if (cfgKeymap.p1) Object.assign(merged.p1, cfgKeymap.p1);
    if (cfgKeymap.p2) Object.assign(merged.p2, cfgKeymap.p2);
  }

  // 第 3 层：localStorage 覆盖（运行期玩家改键）
  if (!import.meta.env.SSR) {
    try {
      const stored = localStorage.getItem(KEYMAP_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          if (parsed.p1) Object.assign(merged.p1, parsed.p1);
          if (parsed.p2) Object.assign(merged.p2, parsed.p2);
        }
      }
    } catch {
      // localStorage 损坏时静默降级到默认
    }
  }

  return merged;
}

const controls = ref(loadControls());

// ============== 运行时改键 ==============
// 是否处于改键模式（开启后 .key 可点击）
const customizeMode = ref(false);
// 当前正在等待新按键的位置，格式 'p1.UP' / 'p2.A'，null 表示未在监听
const editingKey = ref(null);

/** 把 KeyboardEvent.code 转成可读字符用于显示 */
function formatKey(code) {
  if (!code) return "—";
  // 字母键 KeyX → X
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  // 数字键 Digit1 → 1
  if (/^Digit\d$/.test(code)) return code.slice(5);
  // 小键盘 Numpad1 → 1（带 * 后缀提示小键盘）
  if (/^Numpad\d$/.test(code)) return code.slice(6) + "*";
  // 方向键
  const arrowMap = {
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→",
  };
  if (arrowMap[code]) return arrowMap[code];
  // 修饰键：用 Unicode 符号 + L/R 后缀，避免长单词溢出按键框
  // ⇧ Shift / ⌃ Ctrl / ⌥ Alt / ⌘ Meta（Mac）/ ⊞ Win
  const modMap = {
    ShiftLeft: "⇧L",
    ShiftRight: "⇧R",
    ControlLeft: "⌃L",
    ControlRight: "⌃R",
    AltLeft: "⌥L",
    AltRight: "⌥R",
    MetaLeft: "⌘L",
    MetaRight: "⌘R",
  };
  if (modMap[code]) return modMap[code];
  // 编辑键 / 功能键：尽量用 1-4 字符的缩写
  const specialMap = {
    Space: "Spc",
    Enter: "↵",
    Escape: "Esc",
    Tab: "Tab",
    Backspace: "⌫",
    CapsLock: "Caps",
    Insert: "Ins",
    Delete: "Del",
    Home: "Home",
    End: "End",
    PageUp: "PgUp",
    PageDown: "PgDn",
    PrintScreen: "PrSc",
    ScrollLock: "Scrl",
    Pause: "Pse",
    ContextMenu: "Menu",
    NumLock: "Num",
  };
  if (specialMap[code]) return specialMap[code];
  // 标点符号键（主键盘）
  const punctMap = {
    Minus: "-",
    Equal: "=",
    BracketLeft: "[",
    BracketRight: "]",
    Backslash: "\\",
    Semicolon: ";",
    Quote: "'",
    Comma: ",",
    Period: ".",
    Slash: "/",
    Backquote: "`",
  };
  if (punctMap[code]) return punctMap[code];
  // 小键盘运算符（带 * 后缀提示小键盘）
  const numpadOpMap = {
    NumpadAdd: "+*",
    NumpadSubtract: "-*",
    NumpadMultiply: "**",
    NumpadDivide: "/*",
    NumpadDecimal: ".*",
    NumpadEnter: "↵*",
  };
  if (numpadOpMap[code]) return numpadOpMap[code];
  // F1-F24
  if (/^F\d{1,2}$/.test(code)) return code;
  // 兜底：原样返回（最长 4 字符截断，避免溢出）
  return code.length > 4 ? code.slice(0, 4) + "…" : code;
}

/**
 * 按键显示文字长度对应的字号 class
 * - 1~3 字符：默认（不附加 class）
 * - 4 字符：text-sm
 * - 5+ 字符：text-xs
 */
function keyLenClass(code) {
  const len = formatKey(code).length;
  if (len >= 5) return "text-xs";
  if (len === 4) return "text-sm";
  return "";
}

/**
 * 单个按键的统一 class 绑定：editing / clickable / 长度字号
 * 模板里直接 :class="keyClass('p1', 'UP')" 即可
 */
function keyClass(player, action) {
  return [
    {
      editing: editingKey.value === `${player}.${action}`,
      clickable: customizeMode.value,
    },
    keyLenClass(controls.value[player][action]),
  ];
}

/** 开启/关闭改键模式 */
function toggleCustomize() {
  customizeMode.value = !customizeMode.value;
  if (!customizeMode.value) {
    editingKey.value = null;
  }
}

/**
 * 点击某个按键 → 进入监听状态
 * @param player 'p1' | 'p2'
 * @param action 'UP'|'DOWN'|'LEFT'|'RIGHT'|'A'|'B'|'C'|'D'|'SELECT'|'START'
 */
function startEditKey(player, action) {
  if (!customizeMode.value) return;
  editingKey.value = `${player}.${action}`;
}

/** 改键模式下的全局 keydown 监听器 */
function handleCustomizeKeydown(event) {
  if (!customizeMode.value || !editingKey.value) return;

  // Esc 取消当前改键
  if (event.code === "Escape") {
    editingKey.value = null;
    event.preventDefault();
    return;
  }

  // 阻止默认行为（避免 Enter 提交、空格滚动等）
  event.preventDefault();
  event.stopPropagation();

  const [player, action] = editingKey.value.split(".");
  // 写入 controls
  controls.value[player][action] = event.code;
  // 持久化到 localStorage
  if (!import.meta.env.SSR) {
    try {
      localStorage.setItem(
        KEYMAP_STORAGE_KEY,
        JSON.stringify({
          p1: controls.value.p1,
          p2: controls.value.p2,
        })
      );
    } catch {
      // 写入失败（隐私模式等）静默降级
    }
  }
  showToast(`${player.toUpperCase()} ${action} 已设为 ${formatKey(event.code)}`, "success");
  editingKey.value = null;
}

/** 恢复默认按键（清空 localStorage，重置为 DEFAULT_CONTROLS） */
function resetKeymap() {
  controls.value = {
    p1: { ...DEFAULT_CONTROLS.p1 },
    p2: { ...DEFAULT_CONTROLS.p2 },
  };
  if (!import.meta.env.SSR) {
    try {
      localStorage.removeItem(KEYMAP_STORAGE_KEY);
    } catch {}
  }
  editingKey.value = null;
  showToast("已恢复默认按键", "success");
}

// ============== 金手指 ==============
// 兼容 VirtuaNES 的金手指格式：XXXX-YY-ZZ
// XXXX = 内存地址（4 位十六进制）
// Y   = 修改类型（0:始终 1:一次 2:不大于 3:不小于）
// Z   = 数值长度
// ZZ  = 数值（2 位十六进制）
const CHEAT_REGEX = /^[0-9A-Fa-f]{4}-[0-3]\d-[0-9A-Fa-f]{2}$/;
const cheatStorageKey = computed(
  () => `nes-cheats-${currentGame.value.savePrefix}`
);

// 金手指列表项：{ code, name, enabled }
const cheats = ref([]);
const cheatCodeInput = ref("");
const cheatNameInput = ref("");
const showCheatPanel = ref(false);
const cheatWrapperRef = ref(null);

// 点击外部关闭浮层
function handleCheatClickOutside(e) {
  if (!showCheatPanel.value) return;
  const el = cheatWrapperRef.value;
  if (el && !el.contains(e.target)) {
    showCheatPanel.value = false;
  }
}

const activeCheatCount = computed(() =>
  cheats.value.filter((c) => c.enabled).length
);

// 当前游戏的预设金手指（来自 themeConfig.nes.roms[].cheats）
const cheatPresets = computed(() => currentGame.value?.cheats || []);

/** 从 localStorage 读取当前游戏的金手指列表。
 *  - 首次加载（localStorage 无数据）：把 themeConfig 里该游戏的预设金手指全部加入列表（默认关闭）
 *  - 已有存档：按存档恢复（启用状态一律重置为 false，因为游戏实例是新的）
 */
function loadCheats() {
  cheats.value = [];
  if (import.meta.env.SSR) return;
  try {
    const stored = localStorage.getItem(cheatStorageKey.value);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        cheats.value = parsed
          .map((c) => ({
            code: String(c.code || "").toUpperCase(),
            name: String(c.name || ""),
            enabled: false,
          }))
          .filter((c) => CHEAT_REGEX.test(c.code));
        return;
      }
    }
    // 首次加载：注入预设金手指（默认关闭）
    const presets = cheatPresets.value || [];
    if (presets.length) {
      cheats.value = presets
        .map((p) => {
          const code = String(p.code || "").trim().toUpperCase();
          return {
            code,
            name: String(p.name || ""),
            enabled: false,
          };
        })
        .filter((c) => CHEAT_REGEX.test(c.code));
      saveCheats();
    }
  } catch {
    // 读取失败静默降级
  }
}

/** 持久化金手指列表到 localStorage（按游戏存档前缀隔离） */
function saveCheats() {
  if (import.meta.env.SSR) return;
  try {
    localStorage.setItem(
      cheatStorageKey.value,
      JSON.stringify(
        cheats.value.map((c) => ({
          code: c.code,
          name: c.name,
          enabled: c.enabled,
        }))
      )
    );
  } catch {
    // 写入失败静默降级
  }
}

/** 添加金手指：校验格式 → 去重 → 加入列表（默认关闭，需用户手动开启）→ 持久化 */
function addCheat() {
  const raw = cheatCodeInput.value.trim().toUpperCase();
  if (!CHEAT_REGEX.test(raw)) {
    showToast("金手指格式应为 XXXX-YY-ZZ（如 079F-01-01）", "error");
    return;
  }
  if (cheats.value.some((c) => c.code === raw)) {
    showToast("该金手指已存在", "warning");
    return;
  }
  const name = cheatNameInput.value.trim();
  const item = { code: raw, name, enabled: false };
  cheats.value.push(item);
  saveCheats();
  cheatCodeInput.value = "";
  cheatNameInput.value = "";
  showToast(name ? `已添加金手指「${name}」` : "已添加金手指", "success");
}

/** 切换某个金手指的启用状态 */
function toggleCheat(item) {
  if (!nesRef.value || !isGameLoaded.value) {
    showToast("请先加载游戏", "warning");
    return;
  }
  item.enabled = !item.enabled;
  try {
    if (item.enabled) {
      nesRef.value.cheatCode(item.code);
    } else {
      nesRef.value.cancelCheatCode(item.code);
    }
  } catch {
    // 调用失败静默处理
  }
  saveCheats();
}

/** 删除某个金手指 */
function removeCheat(item) {
  if (item.enabled && nesRef.value && isGameLoaded.value) {
    try {
      nesRef.value.cancelCheatCode(item.code);
    } catch {
      // 调用失败静默处理
    }
  }
  cheats.value = cheats.value.filter((c) => c.code !== item.code);
  saveCheats();
}

/** 一键关闭所有已启用的金手指（不清空列表，保留预设便于再次开启） */
function clearAllCheats() {
  const hasEnabled = cheats.value.some((c) => c.enabled);
  if (!hasEnabled) return;
  if (nesRef.value && isGameLoaded.value) {
    try {
      nesRef.value.cancelCheatCodeAll();
    } catch {
      // 调用失败静默处理
    }
  }
  cheats.value.forEach((c) => (c.enabled = false));
  saveCheats();
  showToast("已关闭所有金手指", "success");
}
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
  // 改键模式用 capture 阶段拦截，避免被游戏 handleKeyDown / 浏览器默认行为抢先
  window.addEventListener("keydown", handleCustomizeKeydown, true);
  window.addEventListener("resize", handleResize);
  // 点击外部关闭金手指浮层
  document.addEventListener("click", handleCheatClickOutside, true);
  // 加载当前游戏的金手指列表
  loadCheats();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keydown", handleCustomizeKeydown, true);
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("click", handleCheatClickOutside, true);
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
  // 容纳「选择游戏:」+ 下拉框 + 金手指按钮，超出 .header-box 默认宽度
  width: auto;
  max-width: 50%;
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

// ============== 金手指 ==============
.cheat-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  z-index: 50;
}

.cheat-bar {
  display: flex;
  justify-content: center;
}

.cheat-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--main-font-second-color);
  background-color: var(--main-card-second-background);
  border: 1px solid var(--main-card-border);
  border-radius: 15px;
  cursor: var(--main-pointer-cursor);
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;

  svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
  }

  .cheat-toggle-chevron {
    width: 13px;
    height: 13px;
    margin-left: 2px;
    transition: transform 0.2s ease;
  }

  &:hover {
    color: var(--main-color);
    border-color: var(--main-color);
  }

  // 展开状态下：主色填充 + 箭头旋转
  &.active {
    color: #fff;
    background-color: var(--main-color);
    border-color: var(--main-color);

    .cheat-toggle-chevron {
      transform: rotate(180deg);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--main-color);
    outline-offset: 2px;
  }
}

// 启用中数量徽标
.cheat-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  color: var(--main-color);
  background-color: var(--main-color-bg);
  border-radius: 9px;

  .cheat-toggle-btn.active & {
    color: var(--main-color);
    background-color: #fff;
  }
}

// 浮层面板：absolute 定位，浮在内容区上方
.cheat-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: min(560px, calc(100vw - 32px));
  max-height: 60vh;
  overflow-y: auto;
  background-color: var(--main-card-background);
  border: 1px solid var(--main-card-border);
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
  // Mac 风格滚动条
  scrollbar-width: thin;
  scrollbar-color: var(--main-card-border) transparent;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--main-card-border);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.cheat-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.cheat-input {
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  color: var(--main-font-color);
  background-color: var(--main-card-second-background);
  border: 1px solid var(--main-card-border);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: var(--main-font-second-color);
    opacity: 0.7;
  }

  &:focus {
    border-color: var(--main-color);
    box-shadow: 0 0 0 2px var(--main-color-bg);
  }
}

.cheat-code-input {
  width: 140px;
  font-family: var(--font-mono, "SFMono-Regular", Consolas, monospace);
  letter-spacing: 0.5px;
}

.cheat-name-input {
  flex: 1;
  min-width: 120px;
  max-width: 220px;
}

.cheat-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background-color: var(--main-color);
  border: 1px solid var(--main-color);
  border-radius: 8px;
  cursor: var(--main-pointer-cursor);
  transition: opacity 0.2s ease;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    opacity: 0.9;
  }

  &:focus-visible {
    outline: 2px solid var(--main-color);
    outline-offset: 2px;
  }
}

.cheat-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cheat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background-color: var(--main-card-second-background);
  border: 1px solid var(--main-card-border);
  border-radius: 8px;
  transition: opacity 0.2s ease;

  // 已禁用的金手指整行降低不透明度
  &.disabled {
    opacity: 0.55;

    .cheat-status-dot {
      background-color: var(--main-card-border);
    }
  }
}

.cheat-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--main-color);
  flex-shrink: 0;
  transition: background-color 0.2s ease;

  &.on {
    background-color: var(--main-color);
    box-shadow: 0 0 0 3px var(--main-color-bg);
  }
}

.cheat-name {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: var(--main-font-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cheat-code {
  font-family: var(--font-mono, "SFMono-Regular", Consolas, monospace);
  font-size: 12px;
  color: var(--main-font-second-color);
  background-color: var(--main-card-background);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--main-card-border);
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.cheat-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--main-font-second-color);
  background-color: transparent;
  border: 1px solid var(--main-card-border);
  border-radius: 13px;
  cursor: var(--main-pointer-cursor);
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;

  svg {
    width: 13px;
    height: 13px;
  }

  &:hover {
    color: var(--main-color);
    border-color: var(--main-color);
  }

  // “开启”按钮：主色描边强调
  &.primary {
    color: var(--main-color);
    border-color: var(--main-color);

    &:hover {
      background-color: var(--main-color-bg);
    }
  }

  // “删除”按钮：悬停时变红
  &.danger {
    width: 26px;
    padding: 0;

    &:hover {
      color: #e5484d;
      border-color: #e5484d;
      background-color: rgba(229, 72, 77, 0.08);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--main-color);
    outline-offset: 2px;
  }
}

.cheat-clear-all {
  align-self: flex-end;
  margin-top: 4px;
  height: 26px;
  padding: 0 12px;
  font-size: 12px;
  color: var(--main-font-second-color);
  background-color: transparent;
  border: 1px dashed var(--main-card-border);
  border-radius: 13px;
  cursor: var(--main-pointer-cursor);
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: #e5484d;
    border-color: #e5484d;
  }
}

.cheat-empty {
  margin-top: 10px;
  padding: 14px;
  text-align: center;
  font-size: 12px;
  color: var(--main-font-second-color);
  background-color: var(--main-card-second-background);
  border: 1px dashed var(--main-card-border);
  border-radius: 8px;

  code {
    font-family: var(--font-mono, "SFMono-Regular", Consolas, monospace);
    font-size: 12px;
    color: var(--main-color);
    padding: 1px 5px;
    margin: 0 2px;
    background-color: var(--main-color-bg);
    border-radius: 3px;
  }
}

// 浮层出现/消失动画
.cheat-pop-enter-active {
  transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.cheat-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.18s ease;
}
.cheat-pop-enter-from,
.cheat-pop-leave-to {
  opacity: 0;
  // 配合 .cheat-panel 自身的 translateX(-50%)，需要保留水平居中
  transform: translateX(-50%) translateY(-6px) scale(0.96);
}
.cheat-pop-enter-to,
.cheat-pop-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
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
    margin: 0;
    color: var(--main-color);
    font-size: 16px;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
  }

  // 功能快捷键区的 h3 不在 .controls-header 内，需要保留底部间距与分隔线
  &.function-keys > h3 {
    margin-bottom: 15px;
    padding-bottom: 8px;
    font-size: 18px;
    text-align: center;
    border-bottom: 1px solid var(--main-card-border);
  }
}

// 按键说明区头部：标题 + 改键操作按钮
.controls-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 10px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--main-card-border);

  h3 {
    flex: 0 1 auto;
  }
}

.controls-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

// 改键模式开关 / 完成按钮
.customize-toggle,
.customize-reset {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 26px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--main-color);
  background-color: var(--main-card-second-background);
  border: 1px solid var(--main-color);
  border-radius: 13px;
  cursor: var(--main-pointer-cursor);
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;

  svg {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }

  &:hover {
    color: var(--main-color);
    border-color: var(--main-color);
  }

  &:focus-visible {
    outline: 2px solid var(--main-color);
    outline-offset: 2px;
  }
}

// 开启改键模式后高亮主色
.customize-toggle.active {
  color: #fff;
  background-color: var(--main-color);
  border-color: var(--main-color);

  &:hover {
    opacity: 0.9;
  }
}

// 恢复默认按钮：次要样式
.customize-reset:hover {
  color: var(--main-color-reverse);
  border-color: var(--main-color-reverse);
}

// 改键模式提示横幅
.customize-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding: 6px 10px;
  font-size: 12px;
  color: var(--main-color);
  background-color: var(--main-color-bg);
  border: 1px dashed var(--main-color);
  border-radius: 6px;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
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

    // 玩家标题（P1/P2）左侧加圆角小竖条作为装饰
    // 只作用于直接子级 .group-title，不影响 sub-group 内的小标题
    > .group-title:first-child {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 0;

      &::before {
        content: '';
        display: inline-block;
        width: 3px;
        height: 14px;
        border-radius: 2px;
        background-color: var(--main-font-second-color);
      }
    }
  }

  // P1 用主色，P2 用反色（区分两个玩家）
  &.p1-controls > .group-title:first-child {
    color: var(--main-color);

    &::before {
      background-color: var(--main-color);
    }
  }

  &.p2-controls > .group-title:first-child {
    color: var(--main-color-reverse);

    &::before {
      background-color: var(--main-color-reverse);
    }
  }

  // P2 的连发键（C/D）也用反色，与 P2 标题色保持一致
  &.p2-controls .key.turbo {
    background-color: var(--main-color-reverse-bg);
    border-color: var(--main-color-reverse);
    color: var(--main-color-reverse);

    &::after {
      background-color: var(--main-color-reverse);
    }

    // 改键模式下 hover 也跟反色
    &.clickable:hover {
      border-color: var(--main-color-reverse);
      color: var(--main-color-reverse);
    }
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
  font-size: 14px;
  line-height: 1;
  box-shadow: var(--main-shadow-border);
  position: relative;
  // 长字符按字号自动缩小，避免溢出 40×40 按键框
  &.text-sm {
    font-size: 12px;
  }
  &.text-xs {
    font-size: 10px;
  }

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
    background-color: var(--main-color-bg);
    border-color: var(--main-color);
    color: var(--main-color);
  }

  // 改键模式开启后：所有 .key 可点击
  &.clickable {
    cursor: var(--main-pointer-cursor);
    transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;

    &:hover {
      border-color: var(--main-color);
      color: var(--main-color);
    }
  }

  // 正在等待新按键时：醒目高亮 + 呼吸动画
  &.editing {
    color: #fff !important;
    background-color: var(--main-color) !important;
    border-color: var(--main-color) !important;
    animation: nes-key-pulse 1s ease-in-out infinite;
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

@keyframes nes-key-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 var(--main-color-bg);
  }
  50% {
    box-shadow: 0 0 0 6px transparent;
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

  .key-note-suffix {
    margin-left: 4px;
    opacity: 0.85;
  }
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
