<template>
  <div class="container">
    <h2 class="title">短剧信息输入</h2>

    <el-form :model="form" label-width="120px">
      <!-- 左侧信息区 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="card" shadow="hover">
            <div slot="header" class="card-header">信息输入区</div>

            <el-form-item label="视频文件夹">
              <el-select v-model="form.videoFolder" filterable placeholder="请选择视频所属文件夹">
                <el-option v-for="videoFolder in videoFolders" :key="videoFolder.name" :label="videoFolder.name"
                           :value="videoFolder.path"></el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="豆瓣地址" style="display: flex; flex-wrap: wrap;">
              <el-input v-model="form.ptGen" placeholder="根据豆瓣地址，动态获取信息" style="flex: 1;"/>
              <el-button style="flex: 0;" @click="submitPtGen">
                <el-icon>
                  <Chicken/>
                </el-icon>
              </el-button>
            </el-form-item>
            <div style="display: flex; flex-wrap: wrap;">
              <el-form-item label="中文名">
                <el-input v-model="form.cnName" @blur="convertToPinyin"/>
              </el-form-item>
              <el-form-item label="英文名">
                <el-input v-model="form.enName" placeholder="将自动生成拼音,可自行修改"/>
              </el-form-item>
            </div>
            <div style="display: flex; flex-wrap: wrap;">
              <el-form-item label="年份" style="flex: 0;">
                <el-date-picker
                    v-model="form.year"
                    placeholder="发布年份"
                    type="year"
                />
              </el-form-item>
              <el-form-item label="季数" style="flex: 0;">
                <el-input-number
                    v-model="form.season"
                    :max="10"
                    :min="1"
                    controls-position="right"
                    size="small"
                />
              </el-form-item>
              <el-form-item label="来源" style="flex: 1;">
                <el-select v-model="form.source" placeholder="选择来源">
                  <el-option label="网络付费短剧" value="1"></el-option>
                  <el-option label="抖音短剧" value="2"></el-option>
                  <el-option label="快手短剧" value="3"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="小组" style="flex: 1;">
                <el-select v-model="form.group" placeholder="选择小组">
                  <el-option label="GodDramas" value="1"></el-option>
                </el-select>
              </el-form-item>
            </div>

            <el-form-item label="封面" style="display: flex; flex-wrap: wrap;">
              <el-input v-model="form.cover" placeholder="输入在线图片链接或本地图片" style="flex: 1;"/>
              <el-upload ref="upload" :show-file-list="false" :auto-upload="false" @change="handleFileChange">
                <el-button type="primary">选择本地文件</el-button>
              </el-upload>
              <el-button style="flex: 0;" @click="submitCover">
                <el-icon>
                  <UploadFilled/>
                </el-icon>
              </el-button>
            </el-form-item>
            <el-form-item label="简介" style="display: flex; flex-wrap: wrap; ">
              <el-input v-model="form.introduction" placeholder="简介" type="textarea" style="flex: 1;"/>
            </el-form-item>



            <el-form-item label="分类">
              <el-checkbox-group v-model="form.category">
                <el-checkbox label="剧情" value="1"/>
                <el-checkbox label="爱情" value="2"/>
                <el-checkbox label="穿越" value="3"/>
                <el-checkbox label="重生" value="4"/>
                <el-checkbox label="逆袭" value="5"/>
                <el-checkbox label="都市" value="6"/>
                <el-checkbox label="喜剧" value="7"/>
                <el-checkbox label="科幻" value="8"/>
              </el-checkbox-group>
            </el-form-item>
          </el-card>
        </el-col>

        <!-- 右侧调试与信息区 -->
        <el-col :span="12">
          <el-card class="card" shadow="hover">
            <div slot="header" class="card-header">debug窗口</div>
            <el-input v-model="form.debugInfo" placeholder="debug信息显示" type="textarea" disabled/>
          </el-card>

          <el-card class="card mt-20" shadow="hover">
            <div slot="header" class="card-header">发种排版信息</div>
            <el-input v-model="form.reference" placeholder="引用内容" disabled/>
            <el-input v-model="form.cover" placeholder="封面" disabled/>
            <el-input v-model="form.groupIcon" placeholder="组标" disabled/>
            <el-input v-model="form.publishInfo" placeholder="发种信息" type="textarea"/>
            <el-input v-model="form.videoInfoIcon" placeholder="影片信息标" disabled/>
            <el-input v-model="form.mediaInfo" placeholder="MediaInfo信息" type="textarea"/>
            <el-input v-model="form.screenshotIcon" placeholder="截图标" disabled/>
            <el-input v-model="form.screenshotPath" placeholder="截图列表" type="textarea"/>
            <el-input v-model="form.videoScreenshotLink" placeholder="缩略图"/>
          </el-card>
        </el-col>
      </el-row>

      <!-- 命名信息 -->
      <el-card class="card mt-20" shadow="hover">
        <div slot="header" class="card-header">命名信息</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主标题">
              <el-input v-model="form.mainTitle"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="副标题">
              <el-input v-model="form.subTitle"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="种子路径">
              <el-input v-model="form.torrentPath" placeholder="输入种子路径"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 操作按钮展示 -->
      <el-row :gutter="20" class="buttons-row mt-20">
        <el-col :span="6">
          <el-button block type="primary">1. 重命名文件夹生成</el-button>
        </el-col>
        <el-col :span="6">
          <el-button block type="primary">2. 生成命名种子</el-button>
        </el-col>
        <el-col :span="6">
          <el-button block type="primary">3. 截图种子</el-button>
        </el-col>
        <el-col :span="6">
          <el-button block type="primary">4. 实现MediaInfo生成</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";
import {pinyin} from "pinyin-pro";
import {Chicken, UploadFilled} from "@element-plus/icons-vue";

const date = new Date();
export default {
  components: {Chicken, UploadFilled},
  data() {
    return {
      form: {
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
        // 短剧来源
        source: '',
        // 发布小组
        group: '',
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
        screenshotIcon:''
      },
      videoFolders: [],
      selectedFile: null,

    };
  },
  created() {
    this.fetchVideoFolders();
    this.initData();
  },
  methods: {
    initData(){
      this.form.year = date;
      this.form.group = "1";
      this.form.reference = "[quote][size=4]因组内调整，之后新发布，均禁止[color=Red]转载 [color=Black]谢谢！！[/size][/quote]"
      this.form.groupIcon = "https://img.pterclub.com/images/2024/01/10/GodDramas-.png"
      this.form.videoInfoIcon = "https://img.pterclub.com/images/2024/01/10/49401952f8353abd4246023bff8de2cc.png"
      this.form.screenshotIcon = "https://img.pterclub.com/images/2024/01/10/3a3a0f41d507ffa05df76996a1ed69e7.png"
    },
    fetchVideoFolders() {
      axios.get('http://127.0.0.1:5000/api/info/get_path')
          .then(response => {
            if (response.data.code === 200) {
              this.videoFolders = response.data.data;
            } else {
              ElMessage.error('获取短剧目录列表失败');
            }
          })
          .catch(error => {
            console.error(error);
            ElMessage.error('获取短剧目录列表失败');
          });
    },
    convertToPinyin() {
      const pinyinResult = pinyin(this.form.cnName, {toneType: "none"});
      this.form.enName = pinyinResult.replaceAll(" ", ".")

    },
    handleFileChange(file) {
      this.selectedFile = file.raw;
      this.form.cover = file.name;
    },
    submitPtGen(){
      axios
          .post("http://127.0.0.1:5000/api/ptgen/send", { url: this.form.ptGen })
          .then((response) => {
             console.log(response)
            if (response.data.code === 200) {
              // 更新封面图
              this.form.cover = response.data.data.poster;
              // 中文名
              this.form.cnName = response.data.data.chinese_title;
              // 英文名
              this.convertToPinyin()
              // 年份
              this.form.year = new Date().setFullYear(response.data.data.year);
              // 简介
              this.form.introduction = response.data.data.introduction;
              //类型
              this.form.category = response.data.data.genre;
              // 发布信息
              this.form.publishInfo = response.data.data.format;
              this.$message.success("获取豆瓣信息成功");
            } else{
              this.$message.error(response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
            this.$message.error("在线链接上传失败");
          });
    },
    submitCover() {
      if (this.isOnlineImageUrl(this.form.cover)) {
        // 如果是在线链接
        axios
          .post("http://127.0.0.1:5000/api/upload/link", { url: this.form.cover })
          .then((response) => {
             console.log(response)
            if (response.data.code === 200) {
              this.form.cover = response.data.data; // 更新输入框内容为上传后的URL
              this.$message.success("在线图片链接上传成功");
            } else{
              this.$message.error(response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
            this.$message.error("在线链接上传失败");
          });
      } else if (this.selectedFile) {
        // 如果是本地文件，上传文件流
        const formData = new FormData();
        formData.append("file", this.selectedFile);

        axios
          .post("http://127.0.0.1:5000/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            console.log(response)
            if (response.data.code === 200) {
              this.form.cover = response.data.data; // 更新输入框内容为上传后的URL
              this.$message.success("本地图片上传成功");
            } else{
              this.$message.error(response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
            this.$message.error("本地文件上传失败");
          });
      } else {
        this.$message.warning("请输入有效的链接或选择一个文件");
      }
    },

    // 判断输入框内容是否为在线图片链接
    isOnlineImageUrl(url) {
      return url.startsWith("http://") || url.startsWith("https://");
    },
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  overflow-y: auto;
  max-height: 100vh;
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.card {
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
}

.mt-20 {
  margin-top: 20px;
}

.buttons-row {
  margin-top: 20px;
}
</style>
