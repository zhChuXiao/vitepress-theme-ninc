<template>
  <div class="card-container">
    <div class="card-titlebar">
      <div class="card-buttons">
        <button class="card-button close"></button>
        <button class="card-button minimize"></button>
        <button class="card-button maximize"></button>
      </div>
      <div class="card-title">404 - Not Found</div>
    </div>

    <div class="code-area">
      <div class="code-line">
        <div class="code-content indent-1"><span class="comment">// 404 - Page Not Found</span></div>
      </div>

      <!-- <div class="code-line">
          <div class="code-content indent-1"><span class="comment">// HTTP Status Code: 404</span></div>
        </div> -->

      <div class="code-line">
        <div class="code-content indent-1">
          <span class="keyword">public class</span> <span class="class-name">NotFoundError</span> {
        </div>
      </div>

      <div class="code-line">
        <div class="code-content indent-2">
          <span class="keyword">public static <span class="type">void</span></span> <span class="function">main</span>(<span class="type">String</span>[]
          <span class="args">args</span>) {
        </div>
      </div>

      <!-- <div class="code-line">
          <div class="code-content indent-3"><span class="keyword">boolean</span> found = <span class="number">false</span>;</div>
        </div> -->

      <div class="code-line">
        <div class="code-content indent-3"><span class="new">if</span> (<span class="new">!</span>found) {</div>
      </div>

      <div class="code-line">
        <div class="code-content indent-4">
          <span class="keyword"><span class="new">throw</span> new</span> <span class="function">RuntimeException</span>(<span class="string"
            >"(╯°□°)╯︵ ┻━┻"</span
          >);
        </div>
      </div>

      <div class="code-line">
        <div class="code-content indent-3">}</div>
      </div>

      <div class="code-line">
        <div class="code-content indent-2">}</div>
      </div>

      <div class="code-line">
        <div class="code-content indent-1">}</div>
      </div>

      <div class="code-line">
        <div class="code-content indent-1"><span class="comment"><a class="comment-link" @click="$emit('backHome')">// 返回首页</a> </span></div>
      </div>

      <div class="footer">
        <span><a class="link" @click="$emit('backHome')" >https://blog.ninc.top</a> • 找不到请求的资源</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.card-container {
  background: #1e222a;
  border: 1px solid #2c313c;
  border-radius: 12px;
  /* box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.1); */
  max-width: 650px;
  width: 100%;
  overflow: hidden;
}

/* Mac窗口标题栏 */
.card-titlebar {
  background: #2c313c;
  height: 28px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #1a1d29;
}

.card-buttons {
  display: flex;
  gap: 8px;
}

.card-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
}

.card-button.close {
  background: #ff5f57;
}
.card-button.minimize {
  background: #ffbd2e;
}
.card-button.maximize {
  background: #28c940;
}

.card-title {
  color: #d89ca4;
  font-size: 12px;
  font-weight: 600;
  position: relative;
  left: -20px;
  /* transform: translateX(-50%); */
  margin-left: auto;
  margin-right: auto;
}

/* 代码区域 */
.code-area {
  padding: 24px;
  background: #1e222a;
}

.code-line {
  margin: 0;
  padding: 2px 0;
  display: flex;
  align-items: flex-start;
  min-height: 22px;
}

.code-content {
  white-space: pre;
  font-family: 'Courier new';
  flex: 1;
}

/* Eva Dark Bold 语法高亮 */
.comment {
  color: #5c6370;
  font-style: italic;
}


.keyword {
  color: #9685d0;
  font-weight: 800;
}
.new {
  color: rgb(206, 101, 238);
  font-weight: 800;
}

.class-name {
  color: #70B5C1;
  font-weight: 400;
}

.string {
  color: #98c379;
}

.number {
  color: #d19a66;
}

.error {
  color: #e06c75;
  font-weight: 800;
}

.type {
  color: #e5c07b;
  font-weight: 400;
}
.args {
  /* color: #6F94E7; */
  color: #e06c75;

}
.function {
  color: #6F94E7;
  /* color: #e06c75; */
  font-weight: 800;
}

.link {
  color: #5c6370;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.comment-link {
  color: #d89ca4;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.comment-link:hover {
  color: #d89ca4;
  border-bottom-color: #d89ca4;
}
.link:hover {
  color: #5c6370;
  border-bottom-color: #5c6370;
}

/* 缩进样式 */
.indent-1 {
  margin-left: 0;
}
.indent-2 {
  margin-left: 24px;
}
.indent-3 {
  margin-left: 48px;
}
.indent-4 {
  margin-left: 72px;
}

/* 底部信息 */
.footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #2c313c;
  text-align: center;
  color: #5c6370;
  font-size: 13px;
}

@media (max-width: 768px) {
  body {
    padding: 20px;
    font-size: 14px;
  }

  .card-container {
    border-radius: 8px;
  }

  .code-area {
    padding: 16px;
  }

  .indent-2 {
    margin-left: 20px;
  }
  .indent-3 {
    margin-left: 40px;
  }
  .indent-4 {
    margin-left: 60px;
  }
}
</style>
