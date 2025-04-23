<template>
  <div class="table-container">
    <el-table 
      ref="table"
      :data="tableData" 
      border 
      stripe
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <el-descriptions :column="4" size="small" border>
            <el-descriptions-item label="中文名" :span="2">
              <el-input v-model="row.cnName" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="英文名" :span="2">
              <el-input v-model="row.enName" disabled />
            </el-descriptions-item>
            
            <el-descriptions-item label="年份">
              <el-input v-model="row.year" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="季数">
              <el-input v-model="row.season" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="片源">
              <el-input v-model="row.filmSource" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="来源">
              <el-input v-model="row.source" disabled />
            </el-descriptions-item>

            <el-descriptions-item label="主标题" :span="2">
              <el-input v-model="row.mainTitle" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="小组" :span="2">
              <el-input v-model="row.team" disabled />
            </el-descriptions-item>
            
            <el-descriptions-item label="副标题" :span="2">
              <el-input v-model="row.subTitle" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="种子路径" :span="2">
              <el-input v-model="row.torrentPath" disabled />
            </el-descriptions-item>
            
            <el-descriptions-item label="图片" :span="4">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="image-container">
                    <div class="image-label">封面</div>
                    <el-image 
                      v-if="row.cover"
                      style="width: 100%; height: 180px" 
                      :src="row.cover" 
                      fit="contain"
                    />
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="image-container">
                    <div class="image-label">截图</div>
                    <div class="screenshot-container">
                      <el-button 
                        v-if="getScreenshots(row).length > 1" 
                        class="arrow-button prev" 
                        @click="prevImage(row)"
                      >
                        <el-icon><CaretLeft /></el-icon>
                      </el-button>
                      <el-image 
                        v-if="getScreenshots(row).length > 0"
                        style="width: 100%; height: 180px" 
                        :src="getCurrentScreenshot(row)" 
                        fit="contain"
                      />
                      <el-button 
                        v-if="getScreenshots(row).length > 1" 
                        class="arrow-button next" 
                        @click="nextImage(row)"
                      >
                        <el-icon><CaretRight /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="image-container">
                    <div class="image-label">缩略图</div>
                    <el-image 
                      v-if="row.videoScreenshotLink"
                      style="width: 100%; height: 180px" 
                      :src="row.videoScreenshotLink" 
                      fit="contain"
                    />
                  </div>
                </el-col>
              </el-row>
            </el-descriptions-item>
            
            <el-descriptions-item label="简介" :span="4">{{ row.introduction }}</el-descriptions-item>
            <el-descriptions-item label="分类">{{ row.category }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>

      <el-table-column prop="cnName" label="中文名" min-width="180">
        <template #default="{ row }">
          <span class="cn-name">{{ row.cnName }}</span>
        </template>
      </el-table-column>

      <el-table-column v-for="site in siteNames" :key="site" :label="site" min-width="100">
        <template #default="{ row }">
          <template v-if="getSiteStatus(row, site)">
            <div class="site-status">
              <el-tag type="success">ID {{ getSiteStatus(row, site) }}</el-tag>
              <div class="seeding-status">
                <template v-if="getSeedingStatus(row, site) === 'seeding'">
                  <el-tag type="success" size="small">已做种</el-tag>
                </template>
                <template v-else-if="getSeedingStatus(row, site) === 'seeding_in_progress'">
                  <el-tag type="warning" size="small">
                    <el-icon><Loading /></el-icon>
                    做种中
                  </el-tag>
                </template>
                <template v-else-if="getSeedingStatus(row, site) === 'error'">
                  <el-tooltip
                    :content="getSeedingStatusInfo(row, site).error_msg"
                    placement="top"
                    effect="dark"
                  >
                    <el-button type="danger" link size="small" @click="startSeeding(row.id, site)">
                      <el-icon><Warning /></el-icon>
                      做种失败
                    </el-button>
                  </el-tooltip>
                </template>
                <template v-else>
                  <el-button 
                    type="text" 
                    size="small" 
                    @click="startSeeding(row.id, site)"
                  >
                    未做种
                  </el-button>
                </template>
              </div>
            </div>
          </template>
          <template v-else>
            <template v-if="getSiteStatusInfo(row, site).status === 0">
              <el-tooltip
                :content="getSiteStatusInfo(row, site).error_msg"
                placement="top"
                effect="dark"
              >
                <el-button type="danger" link @click="publishSingle(row.id, site)">
                  <el-icon><Warning /></el-icon>
                  发布失败
                </el-button>
              </el-tooltip>
            </template>
            <template v-else-if="getSiteStatusInfo(row, site).status === 2">
              <el-tag type="warning">
                <el-icon><Loading /></el-icon>
                执行中
              </el-tag>
            </template>
            <template v-else>
              <el-button type="text" @click="publishSingle(row.id, site)">未发布</el-button>
            </template>
          </template>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="200" fixed="right">
        <template #default="{ row }">
          <div class="operation-column">
            <el-checkbox-group v-model="selectedSites[row.id]" class="site-checkboxes">
              <el-checkbox 
                v-for="site in siteNames" 
                :key="site" 
                :label="site"
                :disabled="getSiteStatus(row, site)"
              >
                {{ site }}
              </el-checkbox>
            </el-checkbox-group>
            <div class="button-group">
              <el-button 
                size="small" 
                type="primary" 
                @click="publishBatch(row.id)"
                :disabled="!selectedSites[row.id]?.length"
              >
                统一发布
              </el-button>
              <el-button 
                size="small" 
                type="success" 
                @click="startBatchSeeding(row.id)"
              >
                统一做种
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";
import {_get} from "@/Service.js";
import { CaretLeft, CaretRight, Warning, Loading } from '@element-plus/icons-vue'
import {_post} from "@/Service.js";

export default {
  name: 'PublishTable',
  components: {
    CaretLeft,
    CaretRight,
    Warning,
    Loading
  },
  data() {
    return {
      tableData: [],
      siteNames: ['北洋', '末日', '猫站', '红叶', '麒麟', '织梦'],
      selectedSites: {},
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页条数
      total: 0, // 总记录数
      form: {},
      currentImageIndex: {}
    };
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData(page = 1) {
       const res = await _get(`/api/publish/history?page=${page}&size=${this.pageSize}`, {});
       if (res){
        if (res.code === 200){
           this.tableData = res.data.data;
           this.total = res.data.total;  // 设置总数
           this.currentPage = page;      // 更新当前页
           
           // 使用 nextTick 确保在 DOM 更新后设置选中状态
           this.$nextTick(() => {
             this.tableData.forEach(item => {
               // 默认选中所有未发布的站点
               const selectedSites = this.siteNames.filter(site => !this.getSiteStatus(item, site));
               this.selectedSites[item.id] = selectedSites;
             });
           });
        } else {
          ElMessage.error("获取发种列表失败");
        }
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData(1);  // 切换每页显示数量时，重置到第一页
    },
    handleCurrentChange(val) {
      this.fetchData(val);
    },
    getSiteStatus(row, siteName) {
      const match = row.sites.find(site => this.mapSiteTypeToName(site.site_type) === siteName);
      return match ? match.torrent_id : null;
    },
    getSiteStatusInfo(row, siteName) {
      const match = row.sites.find(site => this.mapSiteTypeToName(site.site_type) === siteName);
      return match || { status: -1, error_msg: '' };
    },
    mapSiteTypeToName(type) {
      const mapping = {
        1: '北洋',
        2: '末日',
        3: '猫站',
        4: '红叶',
        5: '麒麟',
        6: '织梦',
      };
      return mapping[type];
    },
    mapSiteNameToType(siteName) {
      const mapping = {
        '北洋': 1,
        '末日': 2,
        '猫站': 3,
        '红叶': 4,
        '麒麟': 5,
        '织梦': 6,
      };
      return mapping[siteName];
    },
    async publishSingle(id, siteName) {
      const site_type = this.mapSiteNameToType(siteName);
      // 填充form表单
      this.form = {
        "publish_id":id,
        "site_type":site_type
      }
      // console.log('发布', id, site_type);
      const res = await _post(`/api/publish/site`, {},this.form);
      if (res &&res.code === 200) {
        ElMessage.success('任务开始执行');
        // 发布成功后刷新表格数据
        await this.fetchData(this.currentPage);
      } else {
        ElMessage.error(res.message);
      }
    },
    async publishBatch(id) {
      const sites = this.selectedSites[id].map(siteName => this.mapSiteNameToType(siteName));
      const form = {
        publish_id: id,
        site_types: sites
      };
      console.log(form)
      const res = await _post(`/api/publish/site/batch`, {}, form);
      if (res && res.code === 200) {
        ElMessage.success('任务开始执行');
        await this.fetchData(this.currentPage);
      } else {
        ElMessage.error(res.message || '发布失败');
      }
    },
    getScreenshots(row) {
      return [
        row.screenshot1_link,
        row.screenshot2_link,
        row.screenshot3_link,
        row.screenshot4_link,
        row.screenshot5_link
      ].filter(Boolean);
    },
    getCurrentScreenshot(row) {
      const screenshots = this.getScreenshots(row);
      if (!this.currentImageIndex[row.id]) {
        this.currentImageIndex[row.id] = 0;
      }
      return screenshots[this.currentImageIndex[row.id]];
    },
    prevImage(row) {
      const screenshots = this.getScreenshots(row);
      if (!this.currentImageIndex[row.id]) {
        this.currentImageIndex[row.id] = 0;
      }
      this.currentImageIndex[row.id] = (this.currentImageIndex[row.id] - 1 + screenshots.length) % screenshots.length;
    },
    nextImage(row) {
      const screenshots = this.getScreenshots(row);
      if (!this.currentImageIndex[row.id]) {
        this.currentImageIndex[row.id] = 0;
      }
      this.currentImageIndex[row.id] = (this.currentImageIndex[row.id] + 1) % screenshots.length;
    },
    getSeedingStatus(row, siteName) {
      const site_type = this.mapSiteNameToType(siteName);
      const downloader = row.downloaders?.find(d => d.site_type === site_type);
      if (!downloader) return null;
      
      if (downloader.status === 0) {
        return 'error';
      } else if (downloader.status === 2) {
        return 'seeding_in_progress';
      } else if (downloader.status === 1) {
        return 'seeding';
      }
      return null;
    },
    getSeedingStatusInfo(row, siteName) {
      const site_type = this.mapSiteNameToType(siteName);
      const downloader = row.downloaders?.find(d => d.site_type === site_type);
      if (!downloader) return { status: -1, error_msg: '' };
      
      return {
        status: downloader.status,
        error_msg: downloader.error_msg || ''
      };
    },
    async startSeeding(id, siteName) {
      const site_type = this.mapSiteNameToType(siteName);
      const row = this.tableData.find(item => item.id === id);
      const site = row.sites.find(site => this.mapSiteTypeToName(site.site_type) === siteName);
      const res = await _post(`/api/publish/downloader`, {}, {
        publish_id: id,
        site_type: site_type,
        torrent_id: site.torrent_id
      });
      if (res && res.code === 200) {
        ElMessage.success('开始做种');
        await this.fetchData(this.currentPage);
      } else {
        ElMessage.error(res.message || '做种失败');
      }
    },
    async startBatchSeeding(id) {
      const row = this.tableData.find(item => item.id === id);
      // 获取所有已发布但未做种或做种失败的站点
      const sites = row.sites
        .filter(site => {
          const downloader = row.downloaders?.find(d => d.site_type === site.site_type);
          return site.torrent_id && (!downloader || downloader.status !== 1);
        })
        .map(site => ({
          site_type: site.site_type,
          torrent_id: site.torrent_id
        }));

      if (sites.length === 0) {
        ElMessage.warning('没有需要做种的站点');
        return;
      }

      const res = await _post(`/api/publish/downloader/batch`, {}, {
        publish_id: id,
        sites: sites
      });
      if (res && res.code === 200) {
        ElMessage.success('批量做种开始');
        await this.fetchData(this.currentPage);
      } else {
        ElMessage.error(res.message || '批量做种失败');
      }
    }
  }
};
</script>

<style scoped>
.table-container {
  width: 100%;
  margin: 0;
  padding: 0;
}

:deep(.el-table) {
  width: 100%;
  border: none;
}

:deep(.el-table__cell) {
  padding: 8px !important;
}

:deep(.el-table__header) {
  border-right: none !important;
}

:deep(.el-table__body) {
  border-right: none !important;
}

:deep(.el-table__fixed-right) {
  height: 100% !important;
  right: 0;
  box-shadow: none;
}

:deep(.el-table__fixed-right-patch) {
  background-color: transparent;
}

:deep(.el-table__inner-wrapper) {
  border-right: none !important;
}

:deep(.el-table--border) {
  border-right: none !important;
}

:deep(.el-table--border::after) {
  display: none;
}

:deep(.el-table__fixed-right::before) {
  display: none;
}

:deep(.el-table__fixed-right .el-table__fixed-header-wrapper) {
  border-right: none !important;
}

:deep(.el-table__fixed-right .el-table__fixed-body-wrapper) {
  border-right: none !important;
}

.operation-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px;
  min-width: 180px;
}

.site-checkboxes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
}

:deep(.el-checkbox) {
  margin: 0;
  padding: 0;
  height: 24px;
  line-height: 24px;
}

:deep(.el-checkbox__label) {
  font-size: 12px;
}

.button-group {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

:deep(.el-button--small) {
  flex: 1;
  margin: 0;
  height: 28px;
}

.el-image {
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.el-image-viewer__wrapper) {
  background-color: rgba(0, 0, 0, 0.7);
}

:deep(.el-image-viewer__mask) {
  background-color: rgba(0, 0, 0, 0.9);
}

:deep(.el-image-viewer__btn) {
  color: #fff;
  font-size: 24px;
}

:deep(.el-image-viewer__actions) {
  display: none;
}

:deep(.el-image-viewer__close) {
  display: none;
}

:deep(.el-image-viewer__prev) {
  left: 40px;
}

:deep(.el-image-viewer__next) {
  right: 40px;
}

:deep(.el-image-viewer__canvas) {
  transition: transform 0.3s ease;
}

:deep(.el-descriptions__body) {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-descriptions__label) {
  width: 100px;
  color: #606266;
  font-weight: 500;
  text-align: center !important;
  justify-content: center;
  background-color: #fafafa;
}

:deep(.el-descriptions__content) {
  padding: 12px 16px;
  justify-content: center;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f7fa;
  box-shadow: none;
  border: 1px solid #dcdfe6;
  text-align: center;
}

:deep(.el-input.is-disabled .el-input__inner) {
  text-align: center;
  color: #606266;
}

:deep(.el-descriptions-item__content) {
  justify-content: center;
}

:deep(.el-descriptions-item__container) {
  display: flex;
  align-items: center;
}

:deep(.el-descriptions__body .el-descriptions__table .el-descriptions__cell) {
  text-align: center;
}

:deep(.el-image) {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-descriptions__cell) {
  padding-bottom: 16px;
}

:deep(.el-descriptions__cell:last-child) {
  padding-bottom: 0;
}

.image-container {
  margin-bottom: 16px;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 12px;
  height: 220px;
}

.image-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}

:deep(.el-image) {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

:deep(.el-image-viewer__wrapper) {
  z-index: 2050;
}

:deep(.el-image-viewer__img) {
  background-color: #fff;
  border-radius: 4px;
  max-width: 90%;
  max-height: 90%;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  padding-right: 8px;
}

.screenshot-container {
  position: relative;
  width: 100%;
  height: 180px;
}

.arrow-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  color: #409EFF;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-button:hover {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}

.arrow-button.prev {
  left: 10px;
}

.arrow-button.next {
  right: 10px;
}

:deep(.el-icon) {
  font-size: 24px;
}

.cn-name {
  color: #606266;
  font-size: 14px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 0 20px;
}

:deep(.el-pagination) {
  padding: 0;
  margin: 0;
}

:deep(.el-pagination .el-select .el-input) {
  width: 110px;
}

:deep(.el-pagination .el-pagination__total) {
  font-size: 13px;
  color: #606266;
  margin-right: 16px;
}

:deep(.el-pagination .el-pagination__sizes) {
  margin-right: 16px;
}

:deep(.el-pagination button) {
  background: transparent;
}

:deep(.el-pagination .el-pager li) {
  background: transparent;
  border: none;
}

:deep(.el-pagination .el-pager li.active) {
  color: #409EFF;
  font-weight: bold;
}

:deep(.el-checkbox.is-disabled) {
  opacity: 0.6;
}

:deep(.el-checkbox.is-disabled .el-checkbox__label) {
  color: #909399;
}

.site-status {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.seeding-status {
  margin-top: 4px;
}
</style>
