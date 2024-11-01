<template>
  <div>
    <el-container>
      <!-- 主体表单部分 -->
      <el-form :model="screenshotConfig" label-width="120px" style="width: 100%;">


        <div style="text-align: right; margin-bottom: 20px;">
          <el-button type="primary" @click="toggleEdit">
            {{ isEditing ? '保存' : '编辑' }}
          </el-button>
        </div>

        <!-- 截图设置 -->
        <el-divider>截图设置</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="起始点">
              <el-input-number v-model="screenshotConfig.starting_point" :disabled="!isEditing" :max="1" :min="0"
                               :step="0.01"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="终止点">
              <el-input-number v-model="screenshotConfig.end_point" :disabled="!isEditing" :max="1" :min="0"
                               :step="0.01"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="复杂度">
              <el-input-number v-model="screenshotConfig.complexity" :disabled="!isEditing" :max="1" :min="0"
                               :step="0.01"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 缩略图设置 -->
        <el-divider>缩略图设置</el-divider>
        <el-form-item label="是否生成缩略图">
          <el-switch v-model="screenshotConfig.is_thumbnail" :disabled="!isEditing"></el-switch>
        </el-form-item>

        <template v-if="screenshotConfig.is_thumbnail">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="缩略图水平数量">
                <el-input-number v-model="screenshotConfig.thumbnail_horizontal" :disabled="!isEditing"
                                 :min="1"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="缩略图垂直数量">
                <el-input-number v-model="screenshotConfig.thumbnail_vertical" :disabled="!isEditing"
                                 :min="1"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!-- 其他设置 -->
        <el-divider>其他设置</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="自动上传">
              <el-switch v-model="screenshotConfig.auto_upload" :disabled="!isEditing"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="截图数量">
              <el-input-number v-model="screenshotConfig.num" :disabled="!isEditing" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="存储目录">
              <el-input v-model="screenshotConfig.dir" :disabled="!isEditing"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="删除本地图片">
              <el-switch v-model="screenshotConfig.del_local_img" :disabled="!isEditing"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios';
import {ElMessage} from "element-plus";

export default {
  name: "ScreenshotConfigView",
  data() {
    return {
      isEditing: false,  // 控制表单是否可编辑
      screenshotConfig: {
        auto_upload: false,
        complexity: 0.0,
        del_local_img: false,
        dir: '',
        end_point: 0.0,
        id: null,
        is_thumbnail: false,
        num: 1,
        starting_point: 0.0,
        thumbnail_horizontal: 1,
        thumbnail_vertical: 1
      }
    };
  },
  created() {
    this.fetchScreenshotConfig();
  },
  methods: {
    fetchData() {
      this.fetchScreenshotConfig();
    },
    // 切换编辑和保存状态
    toggleEdit() {
      if (this.isEditing) {
        this.updateScreenshotConfig();  // 如果当前是编辑状态，点击时保存数据
      }
      this.isEditing = !this.isEditing;
    },
    // 获取截图配置
    fetchScreenshotConfig() {
      axios.get('http://127.0.0.1:5000/api/screenshot')
          .then(response => {
            if (response.data.code === 200) {
              this.screenshotConfig = response.data.data[0];
            } else {
              ElMessage.error('获取截图配置失败');
            }
          })
          .catch(error => {
            console.error(error);
            ElMessage.error('请求失败');
          });
    },
    // 更新截图配置
    updateScreenshotConfig() {
      axios.put(`http://127.0.0.1:5000/api/screenshot/${this.screenshotConfig.id}`, this.screenshotConfig)
          .then(response => {
            if (response.data.code === 200) {
              ElMessage.success('更新成功');
              this.fetchScreenshotConfig();
            } else {
              ElMessage.error('更新失败');
            }
          })
          .catch(error => {
            console.error(error);
            ElMessage.error('更新失败');
          });
    }
  }
};
</script>
