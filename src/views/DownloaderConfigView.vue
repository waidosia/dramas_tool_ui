<template>
  <div>
    <div style="text-align: right; margin-bottom: 20px;">
      <el-button type="primary" @click="openAddDialog">
        新增下载器
      </el-button>
    </div>
    <el-table :data="downloader" border style="width: 100%">
      <el-table-column label="名称" prop="name"/>
      <el-table-column label="URL" prop="url"/>
      <el-table-column label="类型" prop="type">
        <template #default="scope">
          <span>{{ formatType(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="做种路径" prop="seeding_path"/>
      <el-table-column label="操作">
        <template #default="scope">
          <div style="display: flex; justify-content: space-around;">
            <el-button size="small" type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteDownloader(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑下载器对话框 -->
    <el-dialog v-model="dialogVisible" title="下载器配置">
      <el-form :model="form" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="form.url"/>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option :value="1" label="QB"/>
            <el-option :value="2" label="TR"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="form.user"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"/>
        </el-form-item>
        <el-form-item label="做种路径">
          <el-input v-model="form.seeding_path"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {ElMessage} from 'element-plus';
import axios from 'axios';

export default {
  name: 'DownloaderConfigView',
  data() {
    return {
      downloader: [], // 存储下载器列表
      dialogVisible: false, // 控制弹窗
      form: {
        id: null,
        name: '',
        type: null,
        url: '',
        user: '',
        password: '',
        seeding_path: '',
      },
      isEdit: false, // 是否为编辑模式
    };
  },
  methods: {
    fetchData() {
      this.fetchDownloader();
    },
    // 查询所有下载器配置
    fetchDownloader() {
      axios.get('http://127.0.0.1:5000/api/downloader')
          .then(response => {
            this.downloader = response.data.data;
          })
          .catch(error => {
            console.error(error);
          });
    },
    // 打开新增下载器的对话框
    openAddDialog() {
      this.isEdit = false;
      this.form = {id: null, name: '', type: null, url: '', user: '', password: '', seeding_path: ''};
      this.dialogVisible = true;
    },
    // 打开编辑下载器的对话框
    openEditDialog(row) {
      this.isEdit = true;
      this.form = {...row};
      this.dialogVisible = true;
    },
    // 提交表单
    submitForm() {
      if (this.isEdit) {
        // 编辑模式，发送PUT请求
        axios.put(`http://127.0.0.1:5000/api/downloader/${this.form.id}`, this.form)
            .then(() => {
              ElMessage.success('编辑成功');
              this.fetchDownloader();
              this.dialogVisible = false;
            })
            .catch(error => {
              console.error(error);
              ElMessage.error('编辑失败');
            });
      } else {
        // 新增模式，发送POST请求
        axios.post('http://127.0.0.1:5000/api/info/downloader', this.form)
            .then(() => {
              ElMessage.success('新增成功');
              this.fetchDownloader();
              this.dialogVisible = false;
            })
            .catch(error => {
              console.error(error);
              ElMessage.error('新增失败');
            });
      }
    },
    // 删除下载器配置
    deleteDownloader(id) {
      axios.delete(`http://127.0.0.1:5000/api/downloader/${id}`)
          .then(() => {
            ElMessage.success('删除成功');
            this.fetchDownloader();
          })
          .catch(error => {
            console.error(error);
            ElMessage.error('删除失败');
          });
    },
    formatType(type) {
      // 这里将1转化为QB，2转化为TR
      switch (type) {
        case 1:
          return 'QB';
        case 2:
          return 'TR';
        default:
          return '未知类型';
      }
    }
  },
  mounted() {
    this.fetchDownloader();
  }
};
</script>

<style scoped>
</style>
