<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="图床配置" name="img_host">
        <ImgHostConfigView ref="imgHostConfig"/>
      </el-tab-pane>
      <el-tab-pane label="PTGEN配置" name="ptgen">
        <PtGenConfigView ref="ptgenConfig"/>
      </el-tab-pane>
      <el-tab-pane label="下载器配置" name="downloader">
        <DownloaderConfigView ref="downloaderConfig"/>
      </el-tab-pane>
      <el-tab-pane label="截图配置" name="screenshot">
        <ScreenshotConfigView ref="screenshotConfig"/>
      </el-tab-pane>
      <el-tab-pane label="发布配置" name="publish">
        <PublishConfigView ref="publishConfig"/>
      </el-tab-pane>
      <el-tab-pane label="站点配置" name="site">
        <SiteConfigView ref="siteConfig"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ImgHostConfigView from "@/views/ImgHostConfigView.vue";
import PtGenConfigView from "@/views/PtGenConfigView.vue";
import DownloaderConfigView from "@/views/DownloaderConfigView.vue";
import SiteConfigView from "@/views/SiteConfigView.vue";
import ScreenshotConfigView from "@/views/ScreenshotConfigView.vue";
import PublishConfigView from "@/views/PublishConfigView.vue";

export default {
  components: {
    ImgHostConfigView,
    PtGenConfigView,
    DownloaderConfigView,
    SiteConfigView,
    ScreenshotConfigView,
    PublishConfigView,
  },
  data() {
    return {
      activeTab: 'img_host', // 默认显示图床配置
    };
  },
  watch: {
    activeTab(newTab) {
      // 每次切换标签页时，调用对应组件的 fetchData 方法
      switch (newTab) {
        case 'img_host':
          this.$refs.imgHostConfig.fetchData();
          break;
        case 'ptgen':
          this.$refs.ptgenConfig.fetchData();
          break;
        case 'downloader':
          this.$refs.downloaderConfig.fetchData();
          break;
        case 'screenshot':
          this.$refs.screenshotConfig.fetchData();
          break;
        case 'publish':
          this.$refs.publishConfig.fetchData();
          break;
        case 'site':
          this.$refs.siteConfig.fetchData();
          break;
      }
    }
  },
  mounted() {
    // 初始化加载第一个默认选中的标签页
    this.$refs.imgHostConfig.fetchData();
  }
};
</script>
