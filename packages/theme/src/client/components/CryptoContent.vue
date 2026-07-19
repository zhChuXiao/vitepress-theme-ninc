<!-- 文章加密组件 -->
<template>
  <div class="crypto-content">
    <Transition name="fade" mode="out-in">
      <div v-if="!decrypted" class="crypto-form s-card">
        <div class="crypto-icon">
          <i class="iconfont icon-lock"></i>
        </div>
        <h2 class="crypto-title">文章已加密</h2>
        <p class="crypto-tip">上传密钥后开启密码输入框</p>

        <!-- 密钥上传区域 -->
        <div v-if="!hasSecretKey" class="key-upload-area">
          <div
            class="key-upload-box"
            @dragover.prevent="dragover = true"
            @dragleave.prevent="dragover = false"
            @drop.prevent="onDropFile"
            :class="{ dragover: dragover }"
            @click="triggerFileInput"
          >
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              accept=".txt,.key,.json"
              @change="onFileSelected"
            />
            <i class="iconfont icon-upload"></i>
            <p>拖拽密钥文件到此处或点击上传</p>
            <p class="upload-tip">
              支持
              <span
                v-for="item in ['.key', '.txt', '.json']"
                class="file-type"
                :key="item"
                >{{ item }}</span
              >
              格式
            </p>
          </div>
          <p v-if="keyError" class="error-message">{{ keyError }}</p>
        </div>

        <!-- 密码输入区域 -->
        <div v-if="hasSecretKey" class="input-group">
          <input
            type="password"
            v-model="password"
            placeholder="请输入密码"
            @keyup.enter="decrypt()"
            ref="passwordInput"
            :disabled="isLocked"
          />
          <button @click="decrypt()" class="decrypt-btn" :disabled="isLocked">
            <span v-if="!isLocked">解锁</span>
            <span v-else>{{ lockCountdown }}s</span>
          </button>
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>
        <p v-if="isLocked" class="locked-message">
          <i class="iconfont icon-warning"></i>
          密码尝试次数过多，已临时锁定
        </p>

        <!-- 重置密钥按钮 -->
        <div v-if="hasSecretKey" class="reset-key">
          <button @click="resetSecretKey" class="reset-key-btn">
            <i class="iconfont icon-refresh"></i> 重置密钥
          </button>
        </div>
      </div>
      <div v-else class="content-wrapper">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import CryptoJS from "crypto-js";

const props = defineProps({
  cryptoConfig: {
    type: Object,
    required: true,
  },
});

const password = ref("");
const decrypted = ref(false);
const error = ref("");
const keyError = ref("");
const passwordInput = ref(null);
const fileInput = ref(null);
const triedStorage = ref(false);
const attemptCount = ref(0);
const isLocked = ref(false);
const lockCountdown = ref(0);
const dragover = ref(false);
const hasSecretKey = ref(false);
const secretKey = ref("");
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 30; // 锁定时间，单位秒

// 固定盐值，用于增强密码安全性
const SALT_PREFIX = "VitePress-ninc-Theme-Salt-";
const PEPPER_SUFFIX = "-Secure-Pepper-Key";

// 添加一个额外的签名密钥
const SIGNATURE_KEY =
  "c3BlY2lhbC1zaWduYXR1cmUta2V5LWZvci12aXRlcHJlc3MtdGhlbWUtc2VjdXJpdHk=";

// 根据页面路径和一些额外因素生成唯一的存储密钥
const storageKey = computed(() => {
  const path = window.location.pathname;
  const domain = window.location.hostname;
  return `article_password_${CryptoJS.SHA256(path + domain)
    .toString()
    .substring(0, 16)}`;
});

// 密钥存储的键名 - 全局通用
const secretKeyStorageKey = computed(() => {
  // 使用固定的应用级别存储键，不再基于页面路径
  return `global_article_secret_key`;
});

// 生成安全的 HMAC 签名
const generateSignature = (data) => {
  return CryptoJS.HmacSHA256(data, SIGNATURE_KEY).toString();
};

// 验证签名
const verifySignature = (data, signature) => {
  const calculatedSignature = generateSignature(data);
  return calculatedSignature === signature;
};

// 生成加强版的密钥，使用 PBKDF2 算法
const generateStrongKey = (passwordStr, salt) => {
  // 结合固定盐值和可变盐值
  const combinedSalt = SALT_PREFIX + salt + PEPPER_SUFFIX;

  // 使用 PBKDF2 进行密钥派生，迭代次数为 10000，增强安全性
  const derivedKey = CryptoJS.PBKDF2(passwordStr, combinedSalt, {
    keySize: 8, // 256 bits
    iterations: 10000,
  }).toString();

  return {
    key: CryptoJS.enc.Hex.parse(derivedKey.substring(0, 32)),
    iv: CryptoJS.enc.Hex.parse(derivedKey.substring(32, 64)),
  };
};

// 生成指纹信息，用于验证用户环境
const generateFingerprint = () => {
  const userAgent = navigator.userAgent;
  const language = navigator.language;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const platform = navigator.platform;

  return CryptoJS.SHA256(
    `${userAgent}|${language}|${screenWidth}x${screenHeight}|${timeZone}|${platform}`
  ).toString();
};

// 倒计时函数
const startCountdown = () => {
  lockCountdown.value = LOCK_TIME;
  const timer = setInterval(() => {
    lockCountdown.value--;
    if (lockCountdown.value <= 0) {
      clearInterval(timer);
      isLocked.value = false;
      attemptCount.value = 0; // 重置尝试次数
    }
  }, 1000);
};

// 安全地保存数据到 sessionStorage
const secureStoreSave = (key, data) => {
  // 添加时间戳和指纹
  const fingerprint = generateFingerprint();
  const now = new Date().getTime();

  // 对实际密码进行加密存储，而不是明文存储
  const encryptedData = CryptoJS.AES.encrypt(
    data.toString(),
    SIGNATURE_KEY + fingerprint.substring(0, 16),
    { iv: CryptoJS.enc.Utf8.parse(PEPPER_SUFFIX.substring(0, 16)) }
  ).toString();

  const storageData = {
    data: encryptedData, // 存储加密后的密码，而不是原始密码
    timestamp: now,
    fingerprint: fingerprint,
    path: window.location.pathname,
  };

  // 将数据转为 JSON 并加密
  const jsonData = JSON.stringify(storageData);

  // 生成签名
  const signature = generateSignature(jsonData);

  // 构建最终数据对象
  const finalData = {
    payload: jsonData,
    signature: signature,
  };

  // 存储加密后的数据
  sessionStorage.setItem(key, JSON.stringify(finalData));
};

// 安全地从 sessionStorage 读取数据
const secureStoreGet = (key) => {
  const encryptedData = sessionStorage.getItem(key);
  if (!encryptedData) return null;

  try {
    // 解析存储的数据
    const parsedData = JSON.parse(encryptedData);
    const { payload, signature } = parsedData;

    // 验证签名
    if (!verifySignature(payload, signature)) {
      console.error("数据签名验证失败，可能被篡改");
      sessionStorage.removeItem(key);
      return null;
    }

    // 解析有效载荷
    const storageData = JSON.parse(payload);

    // 检查指纹是否匹配
    const currentFingerprint = generateFingerprint();
    if (storageData.fingerprint !== currentFingerprint) {
      console.error("用户环境指纹不匹配，可能在不同设备上访问");
      sessionStorage.removeItem(key);
      return null;
    }

    // 检查路径是否匹配
    if (storageData.path !== window.location.pathname) {
      console.error("页面路径不匹配");
      sessionStorage.removeItem(key);
      return null;
    }

    // 检查时间戳（有效期24小时）
    const now = new Date().getTime();
    if (now - storageData.timestamp > 24 * 60 * 60 * 1000) {
      console.error("数据已过期");
      sessionStorage.removeItem(key);
      return null;
    }

    // 将加密的密码解密后返回
    try {
      return CryptoJS.AES.decrypt(
        storageData.data,
        SIGNATURE_KEY + storageData.fingerprint.substring(0, 16),
        { iv: CryptoJS.enc.Utf8.parse(PEPPER_SUFFIX.substring(0, 16)) }
      ).toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error("密码解密失败:", e);
      return null;
    }
  } catch (e) {
    console.error("解析存储数据失败:", e);
    sessionStorage.removeItem(key);
    return null;
  }
};

// 保存尝试次数到 localStorage
const saveAttemptCount = () => {
  if (attemptCount.value === 0) return;

  const attemptData = {
    count: attemptCount.value,
    timestamp: new Date().getTime(),
    fingerprint: generateFingerprint(),
    path: window.location.pathname,
  };

  const jsonData = JSON.stringify(attemptData);
  const signature = generateSignature(jsonData);

  localStorage.setItem(
    `${storageKey.value}_attempts`,
    JSON.stringify({
      payload: jsonData,
      signature: signature,
    })
  );
};

// 从 localStorage 读取尝试次数
const loadAttemptCount = () => {
  const data = localStorage.getItem(`${storageKey.value}_attempts`);
  if (!data) return;

  try {
    const parsedData = JSON.parse(data);
    const { payload, signature } = parsedData;

    // 验证签名
    if (!verifySignature(payload, signature)) {
      localStorage.removeItem(`${storageKey.value}_attempts`);
      return;
    }

    const attemptData = JSON.parse(payload);

    // 检查指纹是否匹配
    const currentFingerprint = generateFingerprint();
    if (attemptData.fingerprint !== currentFingerprint) {
      return; // 不同设备不共享尝试次数
    }

    // 检查路径是否匹配
    if (attemptData.path !== window.location.pathname) {
      return; // 不同页面不共享尝试次数
    }

    // 检查时间戳（1小时后过期）
    const now = new Date().getTime();
    if (now - attemptData.timestamp > 60 * 60 * 1000) {
      localStorage.removeItem(`${storageKey.value}_attempts`);
      return;
    }

    // 设置尝试次数
    attemptCount.value = attemptData.count;

    // 如果尝试次数已达上限，立即锁定
    if (attemptCount.value >= MAX_ATTEMPTS) {
      isLocked.value = true;
      const remaining =
        LOCK_TIME - Math.floor((now - attemptData.timestamp) / 1000);
      if (remaining > 0) {
        lockCountdown.value = remaining;
        startCountdown();
      } else {
        // 锁定已过期，重置尝试次数
        attemptCount.value = 0;
        localStorage.removeItem(`${storageKey.value}_attempts`);
        localStorage.removeItem(`${storageKey.value}_lock`);
      }
    }
  } catch (e) {
    console.error("解析尝试次数数据失败:", e);
    localStorage.removeItem(`${storageKey.value}_attempts`);
  }
};

// 退出加密状态
const logout = () => {
  decrypted.value = false;
  password.value = "";
  sessionStorage.removeItem(storageKey.value);
  // 同时清除尝试次数记录
  localStorage.removeItem(`${storageKey.value}_attempts`);
  localStorage.removeItem(`${storageKey.value}_lock`);
  attemptCount.value = 0;
};

// 触发文件选择
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 处理文件拖放
const onDropFile = (event) => {
  dragover.value = false;
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
};

// 处理文件选择
const onFileSelected = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
};

// 处理上传的文件
const processFile = (file) => {
  keyError.value = "";

  // 检查文件类型
  const validExtensions = [".txt", ".key", ".json"];
  const fileExtension = file.name
    .substring(file.name.lastIndexOf("."))
    .toLowerCase();

  if (!validExtensions.includes(fileExtension)) {
    keyError.value = "不支持的文件格式，请上传 .key、.txt或.json文件";
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      let key = e.target.result;

      // 尝试解析JSON文件
      if (fileExtension === ".json") {
        try {
          const jsonData = JSON.parse(key);
          // 尝试从JSON中提取密钥
          if (jsonData.key || jsonData.secretKey || jsonData.secret) {
            key = jsonData.key || jsonData.secretKey || jsonData.secret;
          } else {
            // 如果没有明确的密钥字段，使用整个JSON字符串的哈希
            key = CryptoJS.SHA256(key).toString();
          }
        } catch (jsonError) {
          console.error("解析JSON文件失败:", jsonError);
          // 如果JSON解析失败，使用文件内容的哈希
          key = CryptoJS.SHA256(key).toString();
        }
      }

      // 存储密钥
      storeSecretKey(key);

      // 更新UI状态
      hasSecretKey.value = true;
      secretKey.value = key;

      // 自动聚焦到密码输入框
      setTimeout(() => {
        if (passwordInput.value) {
          passwordInput.value.focus();
        }
      }, 100);

      typeof $message !== "undefined" && $message.success("密钥已上传");
    } catch (error) {
      console.error("处理密钥文件出错:", error);
      keyError.value = "处理密钥文件出错，请重试";
    }
  };

  reader.onerror = () => {
    keyError.value = "读取文件失败，请重试";
  };

  reader.readAsText(file);
};

// 安全存储密钥 - 全局通用
const storeSecretKey = (key) => {
  try {
    // 生成指纹
    const fingerprint = generateFingerprint();

    // 加密密钥
    const encryptedKey = CryptoJS.AES.encrypt(
      key,
      SIGNATURE_KEY + fingerprint.substring(0, 16),
      { iv: CryptoJS.enc.Utf8.parse(PEPPER_SUFFIX.substring(0, 16)) }
    ).toString();

    // 构建存储数据 - 移除页面路径依赖
    const storageData = {
      key: encryptedKey,
      timestamp: new Date().getTime(),
      fingerprint: fingerprint,
      // 不再存储特定页面路径，使密钥全局可用
    };

    // 生成签名
    const jsonData = JSON.stringify(storageData);
    const signature = generateSignature(jsonData);

    // 存储数据
    localStorage.setItem(
      secretKeyStorageKey.value,
      JSON.stringify({
        payload: jsonData,
        signature: signature,
      })
    );
  } catch (e) {
    console.error("存储密钥出错:", e);
  }
};

// 从存储中获取密钥 - 全局通用
const getStoredSecretKey = () => {
  try {
    const data = localStorage.getItem(secretKeyStorageKey.value);
    if (!data) return null;

    const parsedData = JSON.parse(data);
    const { payload, signature } = parsedData;

    // 验证签名
    if (!verifySignature(payload, signature)) {
      console.error("密钥签名验证失败");
      localStorage.removeItem(secretKeyStorageKey.value);
      return null;
    }

    const storageData = JSON.parse(payload);

    // 检查指纹
    const currentFingerprint = generateFingerprint();
    if (storageData.fingerprint !== currentFingerprint) {
      console.error("密钥指纹不匹配");
      return null;
    }

    // 移除路径检查，使密钥在所有页面通用
    // 不再检查页面路径是否匹配

    // 检查时间戳（7天有效期）
    const now = new Date().getTime();
    if (now - storageData.timestamp > 7 * 24 * 60 * 60 * 1000) {
      console.error("密钥已过期");
      localStorage.removeItem(secretKeyStorageKey.value);
      return null;
    }

    // 解密密钥
    try {
      const decryptedKey = CryptoJS.AES.decrypt(
        storageData.key,
        SIGNATURE_KEY + storageData.fingerprint.substring(0, 16),
        { iv: CryptoJS.enc.Utf8.parse(PEPPER_SUFFIX.substring(0, 16)) }
      ).toString(CryptoJS.enc.Utf8);

      return decryptedKey;
    } catch (e) {
      console.error("解密密钥失败:", e);
      return null;
    }
  } catch (e) {
    console.error("获取存储密钥出错:", e);
    return null;
  }
};

// 重置密钥
const resetSecretKey = () => {
  localStorage.removeItem(secretKeyStorageKey.value);
  hasSecretKey.value = false;
  secretKey.value = "";
  password.value = "";
  error.value = "";
  keyError.value = "";
  typeof $message !== "undefined" && $message.info("密钥已重置");
};

// 检查存储的密码
const checkStoredPassword = () => {
  if (triedStorage.value) return;
  triedStorage.value = true;

  // 检查是否已锁定
  const lockData = localStorage.getItem(`${storageKey.value}_lock`);
  if (lockData) {
    try {
      const { timestamp, remaining } = JSON.parse(lockData);
      const now = new Date().getTime();
      const elapsed = Math.floor((now - timestamp) / 1000);

      if (elapsed < remaining) {
        isLocked.value = true;
        lockCountdown.value = remaining - elapsed;
        startCountdown();
        return;
      } else {
        // 锁定已过期，清除锁定状态
        localStorage.removeItem(`${storageKey.value}_lock`);
      }
    } catch (e) {
      console.error("解析锁定数据出错:", e);
      localStorage.removeItem(`${storageKey.value}_lock`);
    }
  }

  // 检查是否有存储的密钥
  const storedKey = getStoredSecretKey();
  if (storedKey) {
    secretKey.value = storedKey;
    hasSecretKey.value = true;
  }

  // 使用安全存储读取密码
  const pwd = secureStoreGet(storageKey.value);
  if (pwd && hasSecretKey.value) {
    password.value = pwd;
    decrypt(true); // 传入 true 表示使用存储的密码
  }
};

// 解密函数
const decrypt = (useStoredPassword = false) => {
  if (isLocked.value) {
    error.value = `尝试次数过多，请在 ${lockCountdown.value} 秒后重试`;
    return;
  }

  if (!password.value) {
    error.value = "请输入密码";
    return;
  }

  if (!hasSecretKey.value || !secretKey.value) {
    error.value = "请先上传密钥文件";
    return;
  }

  try {
    // 如果设置了固定密码，进行验证
    if (props.cryptoConfig.password) {
      // 检查当前尝试次数是否已达上限（除非使用存储的密码）
      if (!useStoredPassword && attemptCount.value >= MAX_ATTEMPTS) {
        isLocked.value = true;
        error.value = `尝试次数过多，请等待 ${LOCK_TIME} 秒后重试`;

        // 存储锁定信息
        const lockInfo = {
          timestamp: new Date().getTime(),
          remaining: LOCK_TIME,
        };
        localStorage.setItem(
          `${storageKey.value}_lock`,
          JSON.stringify(lockInfo)
        );

        startCountdown();
        return;
      }

      // 使用上传的密钥而不是硬编码的密钥
      const encryptedInputPassword = CryptoJS.HmacSHA256(
        password.value,
        secretKey.value
      ).toString();

      // 比较加密后的密码
      if (encryptedInputPassword === props.cryptoConfig.password) {
        decrypted.value = true;

        // 使用安全存储保存密码
        secureStoreSave(storageKey.value, password.value);

        error.value = "";
        attemptCount.value = 0; // 成功后重置尝试次数
        // 清除尝试次数记录
        localStorage.removeItem(`${storageKey.value}_attempts`);

        typeof $message !== "undefined" && $message.success("已解锁");
      } else {
        if (!useStoredPassword) {
          // 只有用户手动输入错误的密码才显示错误
          // 增加尝试次数计数（在密码验证失败后）
          attemptCount.value++;
          // 保存尝试次数到本地存储
          saveAttemptCount();

          const remainingAttempts = MAX_ATTEMPTS - attemptCount.value;
          if (remainingAttempts > 0) {
            error.value = `密码错误，请重试（还剩 ${remainingAttempts} 次尝试）`;
          } else {
            isLocked.value = true;
            error.value = `尝试次数过多，请等待 ${LOCK_TIME} 秒后重试`;
            startCountdown();
          }
          password.value = "";
        }
      }
    } else {
      error.value = "文章未正确配置加密设置";
    }
  } catch (e) {
    console.error("解密过程出错:", e);
    error.value = "解密过程出错，请重试";
    password.value = "";
  }
};

// 加密文本的方法
const encryptText = (text, passwordStr, salt = "") => {
  if (!salt) {
    salt = CryptoJS.lib.WordArray.random(16).toString();
  }

  const { key, iv } = generateStrongKey(passwordStr, salt);

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // 返回格式：salt:iv:密文
  return salt + ":" + encrypted.toString();
};

// 解密文本的方法
const decryptText = (encryptedData, passwordStr) => {
  const parts = encryptedData.split(":");
  if (parts.length < 2) {
    throw new Error("加密数据格式不正确");
  }

  const salt = parts[0];
  const ciphertext = parts.slice(1).join(":");

  const { key, iv } = generateStrongKey(passwordStr, salt);

  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

// 监听锁定状态变化
watch(isLocked, (newVal) => {
  if (newVal === false) {
    error.value = "";
  }
});

onMounted(() => {
  // 先加载尝试次数
  loadAttemptCount();

  // 检查本地存储的密码和密钥
  checkStoredPassword();

  // 如果没有密钥，自动聚焦到密码输入框
  if (hasSecretKey.value && passwordInput.value) {
    passwordInput.value.focus();
  }
});
</script>

<style lang="scss" scoped>
.crypto-content {
  width: 100%;

  .crypto-form {
    padding: 2rem;
    margin: 2rem 0;
    text-align: center;
    height: 350px;
    animation: form-appear 0.6s ease-out;

    @keyframes form-appear {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .crypto-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: var(--main-color);

      .iconfont {
        display: inline-block;
        font-size: 3rem;
        color: var(--main-color);
        animation: icon-bounce 1.5s ease infinite;
      }

      @keyframes icon-bounce {
        0%,
        20%,
        50%,
        80%,
        100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }
    }

    .crypto-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--main-font-color);
    }

    .crypto-tip {
      color: var(--main-font-color-3);
      margin-bottom: 1.5rem;
    }

    .key-upload-area {
      width: 80%;
      max-width: 400px;
      margin: 0 auto 1.5rem;

      .key-upload-box {
        border: 2px dashed var(--main-card-border);
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        background-color: var(--main-card-background);

        &:hover {
          border-color: var(--main-color);
          background-color: var(--main-color-bg);
        }

        &.dragover {
          border-color: var(--main-color);
          background-color: var(--main-color-bg);
          transform: scale(1.02);
        }

        .iconfont {
          font-size: 2rem;
          color: var(--main-color);
          margin-bottom: 0.5rem;
          display: block;
        }

        p {
          margin: 0.5rem 0;
          color: var(--main-font-color);
        }

        .upload-tip {
          font-size: 0.8rem;
          color: var(--main-font-color-3);
          .file-type {
            color: var(--main-color);
            font-weight: bold;
            padding: 0 0.2rem;
          }
        }
      }
    }

    .input-group {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
      position: relative;
      width: 80%;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;

      input {
        padding: 0.75rem 1.25rem;
        border: 2px solid var(--main-card-border);
        border-radius: 12px 0 0 12px;
        outline: none;
        width: 70%;
        background-color: var(--main-card-background);
        color: var(--main-font-color);
        font-size: 1rem;
        letter-spacing: 0.5px;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

        &:focus {
          border-color: var(--main-color);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1),
            0 0 0 2px var(--main-color-bg);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          filter: grayscale(40%);
        }
      }

      .decrypt-btn {
        padding: 0.75rem 1.25rem;
        background-color: var(--main-color);
        color: white;
        border: none;
        border-radius: 0 12px 12px 0;
        cursor: var(--main-pointer-cursor);
        position: relative;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        min-width: 80px;
        font-weight: 500;
        letter-spacing: 0.5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

        span {
          cursor: var(--main-pointer-cursor);
          position: relative;
          z-index: 2;
        }

        &:hover:not(:disabled) {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        &:active:not(:disabled) {
          transform: scale(0.98);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        &:disabled {
          background-color: #ccc;
          cursor: not-allowed;
          box-shadow: none;
          span {
            cursor: not-allowed;
          }
        }

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 1;
        }

        &:hover:not(:disabled)::before {
          left: 100%;
        }
      }
    }

    .error-message {
      color: var(--main-error-color);
      margin-top: 0.5rem;
    }

    .locked-message {
      color: var(--main-warning-color);
      margin-top: 1rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;

      .iconfont {
        margin-right: 0.5rem;
        animation: warning-pulse 1s infinite;
        color: var(--main-warning-color);
      }

      @keyframes warning-pulse {
        0% {
          opacity: 0.5;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.5;
        }
      }
    }

    .reset-key {
      margin-top: 1rem;

      .reset-key-btn {
        background: none;
        border: 1px solid var(--main-card-border);
        border-radius: 8px;
        padding: 0.5rem 1rem;
        color: var(--main-font-color-3);
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;

        .iconfont {
          margin-right: 0.3rem;
        }

        &:hover {
          color: var(--main-color);
          border-color: var(--main-color);
          background-color: var(--main-color-bg);
        }
      }
    }
  }

  .content-wrapper {
    animation: fade-in 0.5s ease;

    .success-message {
      padding: 0.8rem 1.2rem;
      margin-bottom: 1.5rem;
      border-left: 6px solid var(--main-color);
      border-radius: 6px 16px 16px 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      animation: slide-in 0.5s ease, pulse 2s infinite;

      .iconfont {
        margin-right: 0.5rem;
        color: var(--main-color);
      }

      .logout-btn {
        padding: 4px 12px;
        background-color: var(--main-color-bg);
        color: var(--main-color);
        border: 1px solid var(--main-color);
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: var(--main-color);
          color: white;
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 180, 216, 0.4);
    border-left-width: 6px;
  }
  50% {
    border-left-width: 10px;
  }
  70% {
    box-shadow: 0 0 0 6px rgba(0, 180, 216, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 180, 216, 0);
    border-left-width: 6px;
  }
}
</style>
