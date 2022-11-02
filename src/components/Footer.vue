<template lang="pug">
el-footer(style="padding: 0")
  el-row(style="background-color: #43484d; color: #fff")
    el-col(:span="6" :offset="4" style="text-align: left")
      h4 Who We Are
      el-link(href="http://www.iop.cas.cn/" target="_blank" style="color: #fff;margin-bottom:20px")
        | Institute of Physics,Chinese Academy of Science
    el-col(:span="6" :offset="4" style="text-align: left")
      h4 Contact Us
      el-link(style="color: #fff;margin-bottom:20px")
        | zhutiannian15@mails.ucas.ac.cn
</template>

<script setup></script>
