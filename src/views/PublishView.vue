<template>
  <div class="publish-container">
    <el-form :model="form" label-width="100px" class="publish-form">
      <el-row :gutter="20">
        <!-- 左侧信息区 -->
        <el-col :span="12">
          <!-- 基本信息卡片 -->
          <el-card class="info-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Edit /></el-icon>
                <span>基本信息</span>
              </div>
            </template>

            <el-form-item label="视频文件夹">
              <el-select
                v-model="form.videoFolder"
                filterable
                placeholder="请选择视频所属文件夹"
                @click="fetchVideoFolders"
                class="full-width"
              >
                <el-option
                  v-for="videoFolder in videoFolders"
                  :key="videoFolder.name"
                  :label="videoFolder.name"
                  :value="videoFolder.path"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="豆瓣地址">
              <div class="input-with-button">
                <el-input
                  v-model="form.ptGen"
                  placeholder="根据豆瓣地址，动态获取信息"
                  class="flex-grow"
                />
<!--                <el-button type="primary" @click="submitPtGen" class="icon-button">-->
<!--                  <el-icon><Chicken /></el-icon>-->
<!--                </el-button>-->
              </div>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="中文名">
                  <el-input
                    v-model="form.cnName"
                    @blur="convertToPinyin"
                    placeholder="请输入中文名称"
                    class="full-width"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="英文名">
                  <el-input
                    v-model="form.enName"
                    placeholder="将自动生成拼音"
                    class="full-width"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="年份">
                  <el-date-picker
                    v-model="form.year"
                    placeholder="发布年份"
                    type="year"
                    class="full-width"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="季数">
                  <el-input-number
                    v-model="form.season"
                    :max="99"
                    :min="1"
                    controls-position="right"
                    class="full-width"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="片源">
                  <el-select v-model="form.filmSource" placeholder="选择片源" class="full-width">
                    <el-option label="WEB-DL" value="WEB-DL" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="来源">
                  <el-select v-model="form.source" placeholder="选择来源" class="full-width">
                    <el-option label="网络付费短剧" value="网络付费短剧" />
                    <el-option label="抖音短剧" value="抖音短剧" />
                    <el-option label="快手短剧" value="快手短剧" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="小组">
              <el-select v-model="form.team" placeholder="选择小组" class="full-width">
                <el-option label="GodDramas" value="GodDramas" />
              </el-select>
            </el-form-item>

            <el-form-item label="封面">
              <div class="input-with-button">
                <el-input
                  v-model="form.cover"
                  placeholder="输入在线图片链接或选择本地图片"
                  class="flex-grow"
                />
                <el-upload
                  ref="upload"
                  :show-file-list="false"
                  :auto-upload="false"
                  @change="handleFileChange"
                  class="upload-button"
                >
                  <el-button type="primary">选择文件</el-button>
                </el-upload>
<!--                <el-button type="primary" @click="submitCover" class="icon-button">-->
<!--                  <el-icon><UploadFilled /></el-icon>-->
<!--                </el-button>-->
              </div>
            </el-form-item>

            <el-form-item label="简介">
              <el-input
                v-model="form.introduction"
                type="textarea"
                :rows="3"
                placeholder="请输入简介"
              />
            </el-form-item>

            <el-form-item label="分类">
              <el-checkbox-group v-model="form.category" class="category-group">
                <el-checkbox label="剧情" value="剧情" />
                <el-checkbox label="爱情" value="爱情" />
                <el-checkbox label="穿越" value="穿越" />
                <el-checkbox label="重生" value="重生" />
                <el-checkbox label="逆袭" value="逆袭" />
                <el-checkbox label="都市" value="都市" />
                <el-checkbox label="喜剧" value="喜剧" />
                <el-checkbox label="科幻" value="科幻" />
              </el-checkbox-group>
            </el-form-item>
          </el-card>

          <!-- 命名信息卡片 -->
          <el-card class="naming-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Files /></el-icon>
                <span>命名信息</span>
              </div>
            </template>
            <el-form-item label="主标题">
              <el-input v-model="form.mainTitle" placeholder="请输入主标题" />
            </el-form-item>
            <el-form-item label="副标题">
              <el-input v-model="form.subTitle" placeholder="请输入副标题" />
            </el-form-item>
            <el-form-item label="种子路径">
              <div class="input-with-button">
                <el-input v-model="form.torrentPath" disabled placeholder="种子路径" />
                <el-button type="primary" @click="TorrentDownload">下载</el-button>
              </div>
            </el-form-item>
          </el-card>
        </el-col>

        <!-- 右侧信息区 -->
        <el-col :span="12">
          <el-card class="debug-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Monitor /></el-icon>
                <span>调试信息</span>
              </div>
            </template>
            <el-input
              v-model="form.debugInfo"
              type="textarea"
              :rows="6"
              disabled
              placeholder="debug信息显示"
              ref="logInput"
            />
          </el-card>

          <el-card class="publish-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Document /></el-icon>
                <span>发种排版信息</span>
              </div>
            </template>
            <el-form-item label="引用内容">
              <el-input v-model="form.reference" disabled />
            </el-form-item>
            <el-form-item label="封面">
              <el-input v-model="form.cover" disabled />
            </el-form-item>
            <el-form-item label="组标">
              <el-input v-model="form.groupIcon" disabled />
            </el-form-item>
            <el-form-item label="发种信息">
              <el-input v-model="form.publishInfo" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item label="MediaInfo">
              <el-input v-model="form.mediaInfo" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item label="影片信息标">
              <el-input v-model="form.videoInfoIcon" disabled />
            </el-form-item>
            <el-form-item label="截图标">
              <el-input v-model="form.screenshotIcon" disabled />
            </el-form-item>
            <el-form-item label="截图列表">
              <el-input v-model="form.screenshotPath" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item label="缩略图">
              <el-input v-model="form.videoScreenshotLink" />
            </el-form-item>
          </el-card>
        </el-col>
      </el-row>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button
            v-if="!isFinished"
            type="primary"
            size="large"
            @click="Start">
          <el-icon><VideoPlay /></el-icon>
           开 始 整 理 信 息
        </el-button>
        <el-button
          v-else
          type="success"
          size="large"
          @click="Save">
          <el-icon><Files /></el-icon>
            核 对 后 保 存
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { pinyin } from "pinyin-pro";
import { Chicken, UploadFilled, Edit, Monitor, Document, Files, VideoPlay } from "@element-plus/icons-vue";
import {_file, _get, _post, _put} from "@/Service.js";

const date = new Date();

export default {
  components: { Chicken, UploadFilled, Edit, Monitor, Document, Files, VideoPlay },
  data() {
    return {
      logInput: null, // 用于绑定 textarea DOM
      logs: [],
      form: {
        //ID
        id: null,
        // 视频文件夹
        videoFolder: null,
        // 中文名
        cnName: '',
        // 英文名
        enName: '',
        // 发布年份
        year: 0,
        // 发布当前季
        season: 0,
        // 片源
        filmSource:'',
        // 短剧来源
        source: '',
        // 发布小组
        team: '',
        // 封面图
        cover: '',
        // 豆瓣链接
        ptGen: '',
        // 简介
        introduction:'',
        // 类型
        category: [],
        // 主标题
        mainTitle: '',
        // 副标题
        subTitle: '',
        // 种子存放路径
        torrentPath: '',
        // 多张截图的地址
        screenshotLink: [],
        // 多张截图的展示
        screenshotPath: '',
        // 缩略图的地址
        videoScreenshotLink: '',
        // debug窗口文本
        debugInfo: '',
        // 发布信息
        publishInfo: '',
        // media信息
        mediaInfo: '',
        //引用内容
        reference:'',
        // 组标
        groupIcon:'',
        //影片信息标
        videoInfoIcon:'',
        // 截图标
        screenshotIcon:'',
        // 第一集路径
        firstFileName: '',
        // 分辨率
        resolution: '',
        // 视频编码
        video_codec: '',
        // 音频编码
        audio_codec: ''
      },
      videoFolders: [],
      selectedFile: null,
      isFinished: false, // 控制按钮状态
    };
  },
  mounted() {
    const savedTaskId = localStorage.getItem('active_task_id')
    if (savedTaskId) {
      this.appendLog(`[恢复任务监听] task_id: ${savedTaskId}`)
      this.startSSE(savedTaskId)
    }
    this.fetchVideoFolders();
    this.initData();
  },
  methods: {
    initData() {
      this.form.year = date;
      this.form.team = "GodDramas";
      this.form.source = "网络付费短剧";
      this.form.filmSource = "WEB-DL";
      this.form.reference = "[quote][size=4]因组内调整，之后新发布，均禁止[color=Red]转载 [color=Black]谢谢！！[/size][/quote]";
      this.form.groupIcon = "https://img.pterclub.com/images/2024/01/10/GodDramas-.png";
      this.form.videoInfoIcon = "https://img.pterclub.com/images/2024/01/10/49401952f8353abd4246023bff8de2cc.png";
      this.form.screenshotIcon = "https://img.pterclub.com/images/2024/01/10/3a3a0f41d507ffa05df76996a1ed69e7.png";
    },
    async appendLog(msg) {
      this.form.debugInfo += (this.form.debugInfo ? '\n' : '') + msg
      await this.$nextTick(() => {
        if (this.logInput) {
          this.logInput.scrollTop = this.logInput.scrollHeight
        }
      })
    },
    async fetchVideoFolders() {
      const res = await _get('/api/info/get_path');
      if (res && res.code === 200) {
        this.videoFolders = res.data;
      } else {
        ElMessage.error('获取目录列表失败');
      }
    },
    handleFileChange(file) {
      this.selectedFile = file.raw;
      console.log('selectedFile:', this.selectedFile)
      console.log('typeof selectedFile:', typeof this.selectedFile)
      console.log('instanceof File:', this.selectedFile instanceof File)
      this.form.cover = file.name;
    },
    convertToPinyin() {
      const pinyinResult = pinyin(this.form.cnName, {toneType: "none"});
      this.form.enName = pinyinResult.replaceAll(" ", ".");
    },
    TorrentDownload() {
      if (this.form.torrentPath !== "") {
        this.Download(this.form.torrentPath);
      }
    },
    Download(path) {
      window.open("http://127.0.0.1:5000/api/download/" + "?path=" + path, "_blank");
    },
    async Start() {
      this.form.debugInfo = ""
      const res = await _file('/api/publish', this.selectedFile, this.form);
      if (res && res.code === 200 && res.data.task_id) {
        ElMessage.success("发种信息已准备完成")
        localStorage.setItem('active_task_id', res.data.task_id)
        await this.startSSE(res.data.task_id)
      } else {
        ElMessage.error("不明生物来袭")
      }
    },
    async startSSE(taskId) {
      const eventSource = new EventSource(`http://127.0.0.1:5000/api/publish/stream_log/${taskId}`)
      this.eventSource = eventSource

      this.eventSource.onmessage = async (e) => {
        const logData = JSON.parse(e.data);
        let {level, message, data} = logData;
        let prefix = '';

        if (level === 'INSPECT') {
          // 解析 data 数据，填充from表单
          this.form = data
          this.form.category = this.form.category.split(',')
          this.form.screenshotPath = this.form.screenshotLink.join('\n');

        }
        if (level === 'ERROR') prefix = '❌ ';
        if (level === 'SUCCESS') prefix = '✅ ';
        if (level === 'INFO') prefix = '📘 ';

        await this.appendLog(prefix + message);
      };

      // ✅ 正确放在外面
      this.eventSource.addEventListener('close', (e) => {
        const status = e.data; // 拿到任务最终状态
        this.eventSource.close();
        localStorage.removeItem('active_task_id');

        if (status === 'completed') {
          this.isFinished = true; // ✅ 只有任务成功时才切换状态
        } else {
          this.appendLog('📘 任务未完成，可重新提交');
        }
      });

      this.eventSource.onerror = () => {
        this.appendLog('[连接断开]');
        eventSource.close();
      };
    },
    async Save(){
      const res = await _post(`/api/publish/save`, {},this.form);
      if (res &&res.code === 200) {
          ElMessage.success('保存成功');
          this.isFinished = false
          // 清空所有信息，重新开始
          this.form = {}
          this.initData()
        } else {
          ElMessage.error('保存失败');
        }
      }

    }
};
</script>


<style scoped>
.publish-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
}

.publish-form {
  max-width: 1400px;
  margin: 0 auto;
}

.info-card,
.debug-card,
.publish-card,
.naming-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.card-header .el-icon {
  font-size: 18px;
  color: #409eff;
}

.full-width {
  width: 100%;
}

.input-with-button {
  display: flex;
  align-items: center;
  width: 100%;
}

.input-with-button > *:not(:last-child) {
  margin-right: 8px;
}

.flex-grow {
  flex: 1;
}

.icon-button {
  padding: 8px;
}

.upload-button {
  margin-right: 8px;
}

.category-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding: 20px 0;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  padding-right: 12px;
}

:deep(.el-form-item__content) {
  width: calc(100% - 100px);
}

:deep(.el-input__wrapper),
:deep(.el-textarea__wrapper),
:deep(.el-select),
:deep(.el-date-editor),
:deep(.el-input-number) {
  width: 100%;
  box-shadow: none;
  border: 1px solid #dcdfe6;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__wrapper:hover),
:deep(.el-select:hover),
:deep(.el-date-editor:hover),
:deep(.el-input-number:hover) {
  border-color: #409eff;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__wrapper.is-focus),
:deep(.el-select .el-input__wrapper.is-focus),
:deep(.el-date-editor .el-input__wrapper.is-focus),
:deep(.el-input-number .el-input__wrapper.is-focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.el-input-number .el-input-number__decrease),
:deep(.el-input-number .el-input-number__increase) {
  background-color: #f5f7fa;
  border-color: #dcdfe6;
}

:deep(.el-input-number .el-input-number__decrease:hover),
:deep(.el-input-number .el-input-number__increase:hover) {
  color: #409eff;
  border-color: #409eff;
}

:deep(.el-date-editor .el-input__wrapper),
:deep(.el-select .el-input__wrapper),
:deep(.el-input-number .el-input__wrapper) {
  padding: 0 8px;
}

:deep(.el-input__wrapper) {
  padding: 0 8px;
}

:deep(.el-textarea__wrapper) {
  padding: 8px;
}

@media screen and (max-width: 1200px) {
  .el-col-12 {
    width: 100%;
  }

  .publish-form {
    padding: 0 10px;
  }
}

:deep(.el-table) {
  margin-bottom: 16px;
}

:deep(.el-table__header-wrapper) {
  display: none;
}

:deep(.el-table__body-wrapper) {
  border: none;
}

:deep(.el-table__row) {
  background-color: transparent;
}

:deep(.el-table__cell) {
  padding: 8px;
  border: none;
  background-color: transparent;
}

:deep(.el-table__inner-wrapper) {
  border: none;
}

:deep(.el-table__inner-wrapper::before) {
  display: none;
}

:deep(.el-table__cell:first-child) {
  background-color: #f5f7fa;
  font-weight: 500;
  text-align: right;
  padding-right: 16px;
  color: #606266;
  border-right: 1px solid #dcdfe6;
}

:deep(.el-table__cell:last-child) {
  padding-left: 16px;
}

:deep(.el-table__cell) {
  border-bottom: 1px solid #dcdfe6;
}
</style>
