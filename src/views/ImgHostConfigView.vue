<template>
  <div>
    <el-table :data="imgHostList" border style="width: 100%">
      <el-table-column label="图床名称" prop="name"></el-table-column>
      <el-table-column label="图床地址" prop="url"></el-table-column>
      <el-table-column label="Token/Cookie" prop="key_or_cookie"></el-table-column>
      <el-table-column label="是否启用" prop="is_available">
        <template #default="scope">
          <el-tag :type="scope.row.is_available ? 'success' : 'danger'">
            {{ scope.row.is_available ? '启用' : '不启用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="使用代理" prop="is_proxy">
        <template #default="scope">
          <el-tag :type="scope.row.is_proxy ? 'success' : 'danger'">
            {{ scope.row.is_proxy ? '使用' : '不使用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button size="small" type="primary" @click="editImgHost(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div>
    <el-dialog v-model="dialogVisible" center title="修改图床配置">
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="图床名称">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="图床地址">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>
        <el-form-item label="Token/Cookie">
          <el-input v-model="editForm.key_or_cookie"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="editForm.is_available"></el-switch>
        </el-form-item>
         <el-form-item label="是否使用代理">
          <el-switch v-model="editForm.is_proxy"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="saveImgHost">保存</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";
import {_get, _put} from "@/Service.js";

export default {
  name: 'ImgHostConfigView',
  data() {
    return {
      imgHostList: [],
      dialogVisible: false,
      editForm: {
        id: null,
        name: '',
        url: '',
        key_or_cookie: '',
        is_available: true,
        is_proxy:false,
      }
    };
  },
  created() {
    this.fetchImgHosts();
    this.$emit('dataFetched', this.imgHostList); // 通知父组件
  },
  methods: {
    fetchData() {
      this.fetchImgHosts();
    },
    // 获取图床信息
    async fetchImgHosts() {
      const res = await _get('/api/img')
      if (res){
        if (res.code === 200) {
          this.imgHostList = res.data
        } else {
         ElMessage.error('获取图床列表失败');
        }
      }
    },
    // 打开编辑弹窗
    editImgHost(imgHost) {
      this.editForm = {...imgHost};
      this.dialogVisible = true;
    },

    // 保存修改后的图床信息
    async saveImgHost() {
      const res = await _put(`/api/img/${this.editForm.id}`, {},this.editForm);
      if (res) {
        if (res.code === 200) {
          ElMessage.success('编辑成功');
          this.dialogVisible = false; // 关闭弹窗
          await this.fetchImgHosts(); // 刷新列表
        } else {
          ElMessage.error('编辑失败');
          this.dialogVisible = false; // 关闭弹窗
        }
      }
    }
  }
};
</script>

<style scoped>

</style>
