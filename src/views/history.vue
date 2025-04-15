<template>
  <el-card class="card" shadow="hover">
    <div slot="header" class="card-header">整理历史</div>

    <el-table :data="publishData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="cnName" label="中文名" width="150" >
      <template #default="scope">
          <span v-html="truncate(scope.row.cnName)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="enName" label="英文名" width="150">
        <template #default="scope">
          <span v-html="truncate(scope.row.enName)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="year" label="年份" width="60" />
      <el-table-column prop="season" label="季数" width="60" />
      <el-table-column prop="cover" label="封面" width="90">
        <template #default="scope">
          <a :href="scope.row.cover" target="_blank">查看</a>
        </template>
      </el-table-column>
      <el-table-column prop="pt_gen" label="豆瓣地址" width="150" >
      <template #default="scope">
          <span v-html="truncate(scope.row.ptGen)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="introduction" label="简介" >
        <template #default="scope">
          <span v-html="truncate(scope.row.introduction)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column prop="mainTitle" label="主标题" width="150" >
         <template #default="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.mainTitle" placement="top">
              <span v-html="truncate(scope.row.mainTitle)"></span>
            </el-tooltip>
          </template>
      </el-table-column>
      <el-table-column prop="subTitle" label="副标题" width="150" >
        <template #default="scope">
           <el-tooltip class="item" effect="dark" :content="scope.row.subTitle" placement="top">
          <span v-html="truncate(scope.row.subTitle)"></span>
             </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="screenshot1_link" label="截图1" width="90">
        <template #default="scope">
          <a :href="scope.row.screenshot1_link" target="_blank">查看</a>
        </template>
      </el-table-column>
      <el-table-column prop="videoScreenshotLink" label="视频缩略图" width="90">
        <template #default="scope">
          <a :href="scope.row.videoScreenshotLink" target="_blank">查看</a>
        </template>
      </el-table-column>
<!--      <el-table-column prop="publishInfo" label="发布信息" >-->
<!--        <template #default="scope">-->
<!--          <span v-html="truncate(scope.row.publishInfo)"></span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="mediaInfo" label="媒体信息" >-->
<!--        <template #default="scope">-->
<!--          <span v-html="truncate(scope.row.mediaInfo)"></span>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <div style="margin-top: 20px; text-align: center;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        @current-change="fetchData"
      />
    </div>
  </el-card>
</template>

<script>
import {_get, _put} from "@/Service.js";
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      publishData: [], // 存储表格数据
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页条数
      total: 0, // 总记录数
    };
  },

  methods: {
     truncate(text) {
      if (text && text.length > 15) {
        return `<el-tooltip content="${text}" placement="top">
                  <span>${text.substring(0, 15)}...</span>
                </el-tooltip>`;
      }
      return text;
    },
    async fetchData(page = 1) {
       const res = await _get(`/api/publish/history?page=${page}&size=${this.pageSize}`, {});
       if (res){
        if (res.code === 200){
          this.publishData = res.data.data
          this.total = res.data.total
        } else {
          ElMessage.error("获取发布历史列表失败");
        }
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.card-header {
  font-size: 18px;
  font-weight: bold;
}
</style>
