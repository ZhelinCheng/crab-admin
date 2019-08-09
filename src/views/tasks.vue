<template>
  <div class="tasks">
    <div class="tasks-panel"></div>
    <el-table
      class="tasks-list"
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="created_at"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        prop="title"
        label="任务名"
      >
      </el-table-column>
      <el-table-column
        prop="cron"
        label="定时">
      </el-table-column>
      <el-table-column
        prop="table"
        label="插入表">
      </el-table-column>
      <el-table-column
        prop="error_time"
        label="错误延迟">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型">
      </el-table-column>
      <el-table-column
        label="启动"
      >
        <template slot-scope="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.open"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'tasks',
  data () {
    return {
      tableData: [{
        created_at: '2016-05-02',
        title: '测试任务',
        table: 'tt_test',
        cron: '* * * * * *',
        type: '所有',
        error_time: null,
        open: 0
      }]
    }
  },
  methods: {
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete () {}
  }
}
</script>

<style lang="less" scoped>
  @import "tasks";
</style>
