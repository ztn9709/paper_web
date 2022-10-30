<template>
  <el-header>
    <el-row type="flex" justify="start">
      <a href="#/home">
        <el-image :src="img" style="width: 50px; height: 50px; padding-right: 10px" fit="cover"></el-image>
      </a>
      <div class="title">凝聚态物质文献数据库</div>
      <el-menu :default-active="activePath" mode="horizontal" router background-color="#43484d" text-color="#fff" active-text-color="#ffd04b" :ellipsis="false">
        <el-menu-item index="/home">
          <el-icon>
            <House />
          </el-icon>
          主页
        </el-menu-item>
        <el-menu-item index="/recent">
          <el-icon>
            <Notebook />
          </el-icon>
          最近
        </el-menu-item>
        <el-menu-item index="/" disabled>
          <el-icon>
            <Loading />
          </el-icon>
          其他
        </el-menu-item>
      </el-menu>
    </el-row>
  </el-header>
</template>

<script>
import img from '@/assets/logo.png'
export default {
  name: 'Header',
  data() {
    return {
      img: img
    }
  },
  computed: {
    activePath() {
      return this.$route.path
    }
  }
}
</script>

<style scoped lang="less">
.el-menu {
  border-bottom: 0;
  margin-left: 10px;
}

.title {
  color: white;
  line-height: 60px;
}

.el-header {
  background-color: #43484d;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 999;
}
</style>
