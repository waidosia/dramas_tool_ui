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
import axios from "axios";
import {ElMessage} from "element-plus";

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
    },
    fetchPtgenList() {
      // 获取 PTGEN 列表
      fetch('http://127.0.0.1:5000/api/ptgen')
          .then(response => response.json())
          .then(data => {
            if (data.code === 200) {
              this.ptgenList = data.data;
            }
          });
    },
    openNewDialog() {
      // 打开新增 PTGEN 的弹窗
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
      // 打开编辑 PTGEN 的弹窗
      this.form = {...row}; // 将行数据复制到表单
      this.dialogVisible = true;
      this.isEdit = true;
    },
    submitForm() {
      if (this.isEdit) {
        // 编辑模式，发送PUT请求
        axios.put(`http://127.0.0.1:5000/api/ptgen/${this.form.id}`, this.form)
            .then(() => {
              ElMessage.success('编辑成功');
              this.fetchPtgenList();
              this.dialogVisible = false;
            })
            .catch(error => {
              console.error(error);
              ElMessage.error('编辑失败');
            });
      } else {
        // 新增模式，发送POST请求
        axios.post('http://127.0.0.1:5000/api/info/ptgen', this.form)
            .then(() => {
              ElMessage.success('新增成功');
              this.fetchPtgenList();
              this.dialogVisible = false;
            })
            .catch(error => {
              console.error(error);
              ElMessage.error('新增失败');
            });
      }
    },

    deletePtgen(id) {
      axios.delete(`http://127.0.0.1:5000/api/ptgen/${id}`)
          .then(() => {
            ElMessage.success('删除成功');
            this.fetchPtgenList();
          })
          .catch(error => {
            console.error(error);
            ElMessage.error('删除失败');
          });
    }
  }
};
</script>

<style scoped>

</style>
