<template>
  <div>
    <div style="text-align: right; margin-bottom: 20px;">
      <el-button type="primary" @click="openNewDialog">
        新增站点
      </el-button>
    </div>
    <el-table :data="siteList" border style="width: 100%">
      <el-table-column label="站点名称" prop="name"/>
      <el-table-column label="类型" prop="type">
        <template #default="scope">
          {{ formatType(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="是否可用" prop="is_available">
        <template #default="scope">
          <el-tag :type="scope.row.is_available ? 'success' : 'danger'">
            {{ scope.row.is_available ? '可用' : '不可用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <div style="display: flex; justify-content: space-around;">
            <el-button size="small" type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteSite(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗，用于新增和编辑站点配置 -->
    <el-dialog v-model="dialogVisible" title="站点配置">
      <el-form :model="form">
        <el-form-item label="名称" label-width="80px">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="类型" label-width="80px">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option :value="1" label="北洋"/>
            <el-option :value="2" label="末日"/>
            <el-option :value="3" label="猫站"/>
            <el-option :value="4" label="红叶"/>
            <el-option :value="5" label="麒麟"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Cookie" label-width="80px">
          <el-input v-model="form.cookie"/>
        </el-form-item>
        <el-form-item label="是否可用" label-width="80px">
          <el-switch v-model="form.is_available"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </template>
    </el-dialog>


  </div>
</template>

<script>
import {ElMessage} from "element-plus";
import axios from "axios";

export default {
  name: 'SiteConfigView',
  data() {
    return {
      siteList: [], // 站点配置列表
      dialogVisible: false, // 弹窗显示状态
      form: {
        id: null,
        name: '',
        type: 1,
        cookie: '',
        is_available: false
      },
      isEdit: false,
    };
  },
  mounted() {
    this.fetchSiteList(); // 加载站点配置列表
  },
  methods: {
    fetchData() {
      this.fetchSiteList();
    },
    fetchSiteList() {
      // 获取站点配置列表
      fetch('http://127.0.0.1:5000/api/site')
          .then(response => response.json())
          .then(data => {
            if (data.code === 200) {
              this.siteList = data.data;
            }
          });
    },
    openNewDialog() {
      // 打开新增站点的弹窗
      this.form = {
        id: null,
        name: '',
        type: 1,
        cookie: '',
        is_available: false
      };
      this.dialogVisible = true;
      this.isEdit = false;
    },
    openEditDialog(row) {
      // 打开编辑站点的弹窗
      this.form = {...row}; // 将行数据复制到表单
      this.dialogVisible = true;
      this.isEdit = true;
    },
    submitForm() {
      if (this.isEdit) {
        // 编辑模式，发送PUT请求
        axios.put(`http://127.0.0.1:5000/api/site/${this.form.id}`, this.form)
            .then(() => {
              ElMessage.success('编辑成功');
              this.fetchSiteList();
              this.dialogVisible = false;
            })
            .catch(error => {
              console.error(error);
              ElMessage.error('编辑失败');
            });
      } else {
        // 新增模式，发送POST请求
        axios.post('http://127.0.0.1:5000/api/info/site', this.form)
            .then(() => {
              ElMessage.success('新增成功');
              this.fetchSiteList();
              this.dialogVisible = false;
            })
            .catch(error => {
              console.error(error);
              ElMessage.error('新增失败');
            });
      }
    },
    deleteSite(id) {
      axios.delete(`http://127.0.0.1:5000/api/site/${id}`)
          .then(() => {
            ElMessage.success('删除成功');
            this.fetchSiteList();
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
          return '北洋';
        case 2:
          return '末日';
        case 3:
          return '猫站';
        case 4:
          return '红叶';
        case 5:
          return '麒麟';
        default:
          return '未知类型';
      }
    }
  }
};
</script>

<style scoped>
</style>
