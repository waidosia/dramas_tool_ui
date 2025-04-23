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
      <el-table-column label="站点地址" prop="url"/>
      <el-table-column label="是否可用" prop="is_available">
        <template #default="scope">
          <el-tag :type="scope.row.is_available ? 'success' : 'danger'">
            {{ scope.row.is_available ? '可用' : '不可用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否使用代理" prop="is_proxy">
        <template #default="scope">
          <el-tag :type="scope.row.is_proxy ? 'success' : 'danger'">
            {{ scope.row.is_proxy ? '使用' : '不使用' }}
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
            <el-option :value="6" label="织梦"/>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" label-width="80px">
          <el-input v-model="form.url"/>
        </el-form-item>
        <el-form-item label="Cookie" label-width="80px">
          <el-input v-model="form.cookie"/>
        </el-form-item>
        <el-form-item label="可用" label-width="80px">
          <el-switch v-model="form.is_available"/>
        </el-form-item>
        <el-form-item label="代理" label-width="80px">
          <el-switch v-model="form.is_proxy"/>
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
import {_del, _get, _post, _put} from "@/Service.js";

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
      this.$emit('dataFetched', this.ptgenList); // 通知父组件
    },
    async fetchSiteList() {
      // 获取站点配置列表
      const res = await _get('/api/site');
      if (res && res.code === 200) {
        this.siteList = res.data;
      } else {
        ElMessage.error("获取站点列表失败");
      }
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
    async submitForm() {
      if (this.isEdit) {
        // 编辑
        const res = await _put(`/api/site/${this.form.id}`, {},this.form)
        if (res && res.code === 200) {
          ElMessage.success('编辑成功');
          await this.fetchSiteList();
          this.dialogVisible = false;
        } else {
          ElMessage.error('编辑失败');
          this.dialogVisible = false;
        }
      } else {
      // 新增
        const res = await _post(`/api/site`, {},this.form);
        if (res && res.code === 200) {
          ElMessage.success('新增成功');
          await this.fetchSiteList();
          this.dialogVisible = false;

      } else {
          ElMessage.error('新增失败');
          this.dialogVisible = false;
        }
      }
    },
    async deleteSite(id) {
      const res = await _del(`/api/site/${id}`);
      if (res && res.code === 200) {
        ElMessage.success('删除成功');
        await this.fetchSiteList();
      } else {
        ElMessage.error('删除失败');
      }
    },
    formatType(type) {
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
        case 6:
          return '织梦';
        default:
          return '未知类型';
      }
    }
  }
};
</script>

<style scoped>
</style>
