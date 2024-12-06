<template>
  <div id="app">
    <!-- 最外层的el-container，包含顶部header和整个页面 -->
    <el-container style="height: 100vh; width: 100vw; flex-direction: column;">

      <!-- 顶部导航栏 -->
      <el-header height="60px" style="background-color: #f2f2f2;">
        <div style="display: flex; align-items: center; height: 100%; width: 100%;">
          <span style="font-size: 24px; margin-left: 20px;">管理平台</span>
        </div>
      </el-header>

      <!-- 左侧导航和右侧内容区域 -->
      <el-container style="flex: 1; display: flex; flex-direction: row;">
        <!-- 左侧导航栏 -->
        <el-aside style="background-color: #f9f9f9; height: calc(100vh - 60px);" width="200px">
          <el-menu :default-active="activeMenu" @select="handleSelect">
            <el-menu-item index="publish">发布信息</el-menu-item>
            <el-menu-item index="history">发布历史</el-menu-item>
            <el-menu-item index="config">配置</el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 右侧主要内容 -->
        <el-main style="padding: 20px; background-color: #ffffff; height: calc(100vh - 60px); overflow-y: auto;">
          <router-view></router-view> <!-- 通过路由加载相应的内容 -->
        </el-main>
      </el-container>

    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: 'config', // 默认选择"配置"页面
    };
  },
  methods: {
    handleSelect(index) {
      if (index === 'publish') {
        this.$router.push('/publish');
      } else if (index === 'config') {
        this.$router.push('/config');
      } else if (index === 'history') {
        this.$router.push('/history');
      }
    },
  },
};
</script>

<style scoped>
/* 为整个页面设置全局的布局，使页面在不同分辨率下保持良好的显示 */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.el-container {
  display: flex;
}

.el-aside {
  border-right: 1px solid #ddd; /* 给左侧导航加上边框，使页面层次更分明 */
}

.el-main {
  flex: 1; /* 使右侧内容区域占满剩余的水平空间 */
  overflow: hidden;
}

.el-header {
  width: 100%; /* 使灰色的顶部导航栏占满全屏宽度 */
}

.el-menu-item {
  text-align: left;
}
</style>
