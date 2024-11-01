<template>
  <div>
    <el-form :model="settings" label-width="120px">

      <div style="text-align: right; margin-bottom: 20px;">
        <el-button type="primary" @click="toggleEdit">
          {{ isEditing ? '保存' : '编辑' }}
        </el-button>
      </div>

      <!-- 下载器配置 -->
      <el-divider>主要配置</el-divider>
      <el-form-item label="下载器">
        <el-select v-model="settings.downloader_id" :disabled="!isEditing" placeholder="请选择下载器">
          <el-option v-for="downloader in downloaders" :key="downloader.id" :label="downloader.name"
                     :value="downloader.id"></el-option>
        </el-select>
      </el-form-item>

      <!-- 图床配置 -->
      <el-form-item label="图床配置">
        <el-select v-model="settings.image_host_id" :disabled="!isEditing" placeholder="请选择图床配置">
          <el-option v-for="imageHost in imageHosts" :key="imageHost.id" :label="imageHost.name"
                     :value="imageHost.id"></el-option>
        </el-select>
      </el-form-item>

      <!-- PT生成器配置 -->
      <el-form-item label="PTGEN配置">
        <el-select v-model="settings.pt_gen_id" :disabled="!isEditing" placeholder="请选择PT生成器">
          <el-option v-for="ptGen in ptGens" :key="ptGen.id" :label="ptGen.name" :value="ptGen.id"></el-option>
        </el-select>
      </el-form-item>

      <!-- 其他配置 -->
      <el-divider>其他配置</el-divider>
      <el-form-item label="代理URL">
        <el-input v-model="settings.proxy_url" :disabled="!isEditing" placeholder="请输入代理URL"></el-input>
      </el-form-item>

      <el-form-item label="种子文件路径">
        <el-input v-model="settings.torrent_path" :disabled="!isEditing"
                  placeholder="请输入发种后下载种子文件的路径"></el-input>
      </el-form-item>

      <el-form-item label="是否转移">
        <el-switch v-model="settings.is_transfer" :disabled="!isEditing"></el-switch>
      </el-form-item>
      <template v-if="settings.is_transfer">
        <el-form-item label="转移目录">
          <el-input v-model="settings.transfer_dir" :disabled="!isEditing" placeholder="请输入转移目录"></el-input>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      isEditing: false,  // 控制表单是否可编辑
      settings: {
        downloader_id: null,
        id: 1,
        image_host_id: null,
        is_transfer: false,
        proxy_url: '',
        pt_gen_id: null,
        torrent_path: '',
        transfer_dir: ''
      },
      downloaders: [], // 下载器下拉框选项
      imageHosts: [],  // 图床下拉框选项
      ptGens: []       // PT生成器下拉框选项
    };
  },
  created() {
    this.fetchSettings();
    this.fetchDownloaders();
    this.fetchImageHosts();
    this.fetchPtGens();
  },
  methods: {
    fetchData() {
      this.fetchSettings();
      this.fetchDownloaders();
      this.fetchImageHosts();
      this.fetchPtGens();
    },
    toggleEdit() {
      if (this.isEditing) {
        this.updateSettings();  // 如果当前是编辑状态，点击时保存数据
      }
      this.isEditing = !this.isEditing;
    },
    fetchSettings() {
      axios.get('http://127.0.0.1:5000/api/info/')
          .then(response => {
            if (response.data.code === 200) {
              this.settings = response.data.data;
            } else {
              ElMessage.error('获取设置失败');
            }
          })
          .catch(error => {
            console.error(error);
            ElMessage.error('请求失败');
          });
    },
    fetchDownloaders() {
      axios.get('http://127.0.0.1:5000/api/downloader')
          .then(response => {
            if (response.data.code === 200) {
              this.downloaders = response.data.data;
            } else {
              ElMessage.error('获取下载器列表失败');
            }
          })
          .catch(error => {
            console.error(error);
            ElMessage.error('请求失败');
          });
    },
    fetchImageHosts() {
      axios.get('http://127.0.0.1:5000/api/img?is_available=true')
          .then(response => {
            if (response.data.code === 200) {
              this.imageHosts = response.data.data;
            } else {
              ElMessage.error('获取图床列表失败');
            }
          })
          .catch(error => {
            console.error(error);
            ElMessage.error('请求失败');
          });
    },
    fetchPtGens() {
      axios.get('http://127.0.0.1:5000/api/ptgen?is_available=true')
          .then(response => {
            if (response.data.code === 200) {
              this.ptGens = response.data.data;
            } else {
              ElMessage.error('获取PT生成器列表失败');
            }
          })
          .catch(error => {
            console.error(error);
            ElMessage.error('请求失败');
          });
    },
    updateSettings() {
      axios.put(`http://127.0.0.1:5000/api/info/1`, this.settings)
          .then(response => {
            if (response.data.code === 200) {
              ElMessage.success('设置更新成功');
            } else {
              ElMessage.error('更新设置失败');
            }
          })
          .catch(error => {
            ElMessage.error('请求失败');
          });
    }
  }
};
</script>
