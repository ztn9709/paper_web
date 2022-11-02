<template>
  <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
    All({{ total }})
  </el-checkbox>
  <el-checkbox-group v-model="checkedList" @change="handleCheckedChange">
    <el-checkbox v-for="opt in optList" :label="opt" :key="opt">
      {{ opt }}({{ optCounts[opt] }})
    </el-checkbox>
  </el-checkbox-group>
</template>

<script setup>
import { ref, watch, defineEmits, computed } from 'vue'
const props = defineProps(['optList', 'checkedList', 'optCounts', 'total'])
const emit = defineEmits(['checkedChange'])
const checkedList = ref(props.checkedList)
const optList = computed(() => {
  return props.optList.sort((a, b) => {
    let x = props.optCounts[b] ? props.optCounts[b] : 0
    let y = props.optCounts[a] ? props.optCounts[a] : 0
    return x - y
  })
})
const checkAll = ref(true)
const isIndeterminate = ref(false)
const handleCheckAllChange = val => {
  checkedList.value = []
  checkAll.value = true
  isIndeterminate.value = false
}
const handleCheckedChange = value => {
  let checkedCount = value.length
  checkAll.value = checkedCount === props.optList.length || checkedCount === 0
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.optList.length
}
watch(checkedList, newval => {
  emit('checkedChange', newval)
})
</script>
