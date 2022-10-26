<template>
  <el-container id="main">
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside width="240px">
        <Navbar></Navbar>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>
          <Footer></Footer>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
export default {
  name: 'Main',
  components: {
    Navbar,
    Header,
    Footer,
  },
}
</script>

<style lang="less" scoped>
#main {
  height: calc(100vh - 18px);
}
.el-header {
  background-color: #303133;
  line-height: 60px;
}
.el-footer {
  background-color: grey;
  line-height: 60px;
}
.el-aside {
  ul {
    height: 100%;
  }
}
</style>
