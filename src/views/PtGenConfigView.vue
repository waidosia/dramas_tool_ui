<template>
  <div>

    <div style="text-align: right; margin-bottom: 20px;">
      <el-button type="primary" @click="openNewDialog">
        新增 PTGEN
      </el-button>
    </div>

    <el-table :data="ptgenList" border style="width: 100%">
      <el-table-column label="名称" prop="name"/>
      <el-table-column label="URL" prop="url"/>
      <el-table-column label="是否可用" prop="is_available">
        <template #default="scope">
          <el-tag :type="scope.row.is_available ? 'success' : 'danger'">
            {{ scope.row.is_available ? '可用' : '不可用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <div style="display: flex; justify-content: space-around;">
            <el-button size="small" type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deletePtgen(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗，用于新增和编辑 PTGEN -->
    <el-dialog v-model="dialogVisible" title="PTGEN配置">
      <el-form :model="form">
        <el-form-item label="名称" label-width="80px">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="URL" label-width="80px">
          <el-input v-model="form.url"/>
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
import {_del, _get, _post, _put} from "@/Service.js";

export default {
  name: 'PtGenConfigView',
  data() {
    return {
      ptgenList: [], // PTGEN 列表
      dialogVisible: false, // 弹窗显示状态
      form: {
        id: null,
        name: '',
        url: '',
        is_available: false
      },
      isEdit: false, // 是否为编辑模式
    };
  },
  mounted() {
    this.fetchPtgenList();
  },
  methods: {
    fetchData() {
      this.fetchPtgenList();
      this.$emit('dataFetched', this.ptgenList); // 通知父组件
    },
    async fetchPtgenList() {
      const res = await _get("/api/ptgen");
      if (res){
        if (res.code === 200){
          this.ptgenList = res.data
        } else {
          ElMessage.error("获取PTGEN列表失败");
        }
      }
    },
    openNewDialog() {
      this.form = {
        id: null,
        name: '',
        url: '',
        is_available: false
      };
      this.dialogVisible = true;
      this.isEdit = false;
    },
    openEditDialog(row) {
      this.form = {...row}; // 将行数据复制到表单
      this.dialogVisible = true;
      this.isEdit = true;
    },

    async submitForm() {
      if (this.isEdit) {
        // 编辑
        const res = await _put(`/api/ptgen/${this.form.id}`,{},this.form);
        if (res && res.code === 200){
          ElMessage.success('编辑成功');
          await this.fetchPtgenList();
          this.dialogVisible = false;
        } else {
          ElMessage.error('编辑失败');
          this.dialogVisible = false;
        }
      } else {
        // 新增
        const res = await _post(`/api/ptgen`,{},this.form);
        if (res && res.code === 200){
          ElMessage.success('新增成功');
          await this.fetchPtgenList();
          this.dialogVisible = false;
        } else {
          ElMessage.error('新增失败');
          this.dialogVisible = false;
        }
      }
    },

    async deletePtgen(id) {
      const res = await _del(`/api/ptgen/${id}`);
      if (res && res.code === 200){
        ElMessage.success('删除成功');
        await this.fetchPtgenList();
      } else {
        ElMessage.error('删除失败');
      }
    }
  }
};
</script>

<style scoped>

</style>
