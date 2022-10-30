<template>
  <el-card class="box-card">
    <template v-slot:header>
      <div class="clearfix">
        <!-- <el-button type="text" @click="dialogTableVisible = true">查看相似文章</el-button>
                <el-dialog title="Top 10 papers" :visible.sync="dialogTableVisible">
                  <el-table :data="gridData">
                    <el-table-column property="title" label="Title" width="400"></el-table-column>
                    <el-table-column property="similarity" label="Similarity" width="200"></el-table-column>
                  </el-table>
                </el-dialog> -->
        <span>
          <el-link :href="paper.link" :underline="false" target="_blank" style="color: #3294d8; font-size: 30px">{{ paper.title }}</el-link>
        </span>
      </div>
    </template>
    <div v-for="(val, key) in paper" :key="key" class="text item">
      <div v-if="key[0] != '_' && key != 'link' && key != 'title' && key != 'topo_label'">{{ capitalize_filter(key) }} : {{ array2String_filter(val) }}</div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Article',
  props: ['paper']
}
</script>
