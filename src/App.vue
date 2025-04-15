<template>
  <div id="app">
    <el-container class="app-container">
      <!-- 顶部导航栏 -->
      <el-header class="app-header">
        <div class="header-content">
          <span class="header-title">管理平台</span>
        </div>
      </el-header>

      <!-- 左侧导航和右侧内容区域 -->
      <el-container class="main-container">
        <!-- 左侧导航栏 -->
        <el-aside class="app-aside">
          <el-menu 
            :default-active="activeMenu" 
            @select="handleSelect"
            class="app-menu"
          >
            <el-menu-item index="publish">
              <el-icon><Upload /></el-icon>
              <span>发布信息</span>
            </el-menu-item>
            <el-menu-item index="history">
              <el-icon><List /></el-icon>
              <span>发布历史</span>
            </el-menu-item>
            <el-menu-item index="config">
              <el-icon><Setting /></el-icon>
              <span>配置</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 右侧主要内容 -->
        <el-main class="app-main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, List, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const activeMenu = ref('config')

const handleSelect = (index) => {
  router.push(`/${index}`)
}
</script>

<style scoped>
/* 全局样式 */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 应用容器 */
.app-container {
  height: 100vh;
  width: 100vw;
  flex-direction: column;
}

/* 顶部导航栏 */
.app-header {
  height: 60px;
  background-color: #f2f2f2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 0 20px;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

/* 主容器 */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

/* 侧边栏 */
.app-aside {
  width: 200px;
  background-color: #f9f9f9;
  border-right: 1px solid #e6e6e6;
  transition: width 0.3s;
}

.app-menu {
  border-right: none;
  height: 100%;
}

.app-menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.app-menu :deep(.el-menu-item .el-icon) {
  margin-right: 8px;
  font-size: 18px;
}

/* 主内容区 */
.app-main {
  padding: 20px;
  background-color: #ffffff;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .app-aside {
    width: 64px;
  }
  
  .app-menu :deep(.el-menu-item span) {
    display: none;
  }
  
  .app-menu :deep(.el-menu-item .el-icon) {
    margin-right: 0;
  }
}
</style>
