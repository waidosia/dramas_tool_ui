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
import {_del, _get, _post, _put} from "@/Service.js";
import {ElMessage} from "element-plus";

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
      this.$emit('dataFetched', this.downloader); // 通知父组件
    },
    // 查询所有下载器配置
    async fetchDownloader() {
     const res = await _get('/api/downloader')
      if (res){
        if (res.code === 200) {
          this.downloader = res.data;
        } else {
          ElMessage.error("获取下载器列表失败");
        }
      }
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
    async submitForm() {
      if (this.isEdit) {
        // 编辑
        const res = await _put(`/api/downloader/${this.form.id}`, {},this.form);
        if (res) {
          if (res.code === 200) {
            ElMessage.success("编辑成功")
            await this.fetchDownloader();
            this.dialogVisible = false;
          } else {
            ElMessage.error("编辑失败");
            this.dialogVisible = false;
          }
        }
      } else {
        // 新增
        const res = await _post(`/api/downloader`, {},this.form);
        if (res) {
          if (res.code === 200) {
            ElMessage.success("新增成功")
            await this.fetchDownloader();
            this.dialogVisible = false;
          } else {
            ElMessage.error("新增失败");
            await this.fetchDownloader();
            this.dialogVisible = false;
          }
        }
      }
    },
    // 删除下载器配置
    async deleteDownloader(id) {
      const res = await _del(`/api/downloader/${id}`);
      if (res) {
        if (res.code === 200) {
          ElMessage.success("删除成功")
          await this.fetchDownloader();
        } else {
          ElMessage.error("删除失败");
        }
      }

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
