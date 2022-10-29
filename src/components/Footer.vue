<template>
  <el-footer style="padding: 0">
    <el-row style="background-color: #43484d; color: #fff">
      <el-col :span="3" :offset="3" style="text-align: left">
        <h4>Who We Are</h4>
        <ul style="list-style: none; padding-inline-start: 0">
          <li>
            <el-link href="http://www.iop.cas.cn/" target="_blank">Institute of Physics,Chinese Academy of Science</el-link>
          </li>
        </ul>
      </el-col>
    </el-row>
  </el-footer>
  <div>this is footer</div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>
