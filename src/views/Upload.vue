<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model:value="form.title"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="authors">
        <el-input v-model:value="form.authors"></el-input>
      </el-form-item>
      <el-form-item label="出版日期" prop="date">
        <el-input v-model:value="form.date"></el-input>
      </el-form-item>
      <el-form-item label="出版社" prop="publication">
        <el-input v-model:value="form.publication"></el-input>
      </el-form-item>
      <el-form-item label="关键词" prop="keywords">
        <el-input v-model:value="form.keywords"></el-input>
      </el-form-item>
      <el-form-item label="摘要" prop="abstract">
        <el-input type="textarea" v-model:value="form.abstract"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit('form')">上传</el-button>
        <el-button @click="reset('form')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-upload
      class="upload-demo"
      action="http://localhost:4000/api/pdf2doi"
      :on-success="handleSuccess"
      :before-remove="beforeRemove"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <template v-slot:tip>
        <div class="el-upload__tip">上传pdf文件，且不超过10MB</div>
      </template>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      rules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        authors: [{ required: true, message: '请输入作者', trigger: 'blur' }],
        date: [{ required: true, message: '请选择出版时间', trigger: 'blur' }],
        publication: [
          { required: true, message: '请输入来源出版物', trigger: 'blur' },
        ],
        keywords: [
          { required: true, message: '请输入关键词', trigger: 'blur' },
        ],
        abstract: [
          { required: true, message: '请输入文章摘要', trigger: 'blur' },
        ],
      },
      fileList: [],
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('上传成功！')
        } else {
          alert('填写有误，请重新填写！')
          return false
        }
      })
    },
    reset(formName) {
      this.$refs[formName].resetFields()
    },
    // formatData() {
    //   for (const item in this.form) {
    //     if (typeof this.form[item] === 'string') {
    //       this.form[item] = this.form[item].trim()
    //     }
    //   }
    //   this.form.createTime = new Date()
    //   this.form.updateTime = new Date()
    // },
    handleSuccess(data) {
      console.log(data)
      data.authors = data.authors.join()
      data.keywords = data.keywords.join()
      this.form = data
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
  },
  created() {},
}
</script>
