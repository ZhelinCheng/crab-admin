<template>
  <div class="tasks">
    <div class="tasks-panel">
      <el-input placeholder="搜索任务" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button @click="newAddTask" type="primary" icon="el-icon-edit">新建任务</el-button>
    </div>
    <el-table
      class="tasks-list"
      height="82%"
      :data="table.list"
      stripe
      v-loading="table.loading"
      style="width: 100%">
      <el-table-column
        prop="created_at"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        prop="expire_date"
        label="过期时间"
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
        label="错误延迟">
        <template slot-scope="scope">
          {{ scope.row.error_time }}s
        </template>
      </el-table-column>
      <el-table-column
        prop="type_lable"
        label="类型">
      </el-table-column>
      <el-table-column
        label="启动"
      >
        <template slot-scope="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            @change="onOpenChange(scope.row)"
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
    <el-pagination
      v-show="table.pages"
      class="tasks-pager"
      background
      layout="prev, pager, next"
      @current-change="getTasksList"
      :page-count="table.pages">
    </el-pagination>
    <Editor
      v-show="editor.show"
      v-model="editor.task"
      :newItem="editor.new"
      @close="editor.show = false"
    />
  </div>
</template>

<script>
import Editor from '@/components/Editor.vue'
import {
  apiGetTasks,
  apiPutItem,
  apiDelItem,
  apiGetItem
} from '@/request'

const _TASK_TPL = JSON.stringify({
  title: '',
  table: '',
  cron: '',
  type: 1,
  error_time: 0,
  expire_date: 1861891200000,
  code: ''
})

export default {
  name: 'tasks',
  components: {
    Editor
  },
  data () {
    return {
      editor: {
        show: false,
        task: JSON.parse(_TASK_TPL)
      },
      table: {
        list: [],
        pages: 0
      }
    }
  },
  async created () {
    await this.getTasksList()
  },
  methods: {
    /**
     * 改变启动状态
     * @param item
     * @returns {Promise<void>}
     */
    async onOpenChange (item) {
      try {
        this.table.loading = true
        let success = await apiPutItem({
          where: {
            tid: item.tid
          },
          update: {
            open: item.open
          }
        })

        if (success) {
          this.$message.success(`启动状态修改成功，当前状态：${item.open ? '开启' : '关闭'}`)
        } else {
          item.open = item.open ? 0 : 1
          this.$message.error(`启动状态修改失败`)
        }
        this.table.loading = false
      } catch (e) {
        this.table.loading = false
      }
    },

    /**
     * 获取任务列表
     * @param page
     * @param limit
     * @returns {Promise<void>}
     */
    async getTasksList (page = 1, limit = 16) {
      try {
        this.table.loading = true
        const data = await apiGetTasks({
          page,
          limit
        })
        this.table = {
          loading: false,
          ...data
        }
      } catch (e) {
        this.table.loading = false
      }
    },

    /**
     * 新添加任务
     */
    newAddTask () {
      this.editor.show = true
      this.editor.task = JSON.parse(_TASK_TPL)
    },

    /**
     * 更新任务
     * @param index
     * @param row
     * @returns {Promise<void>}
     */
    async handleEdit (index, row) {
      try {
        const res = await apiGetItem({
          tid: row.tid
        })
        this.editor.show = true
        this.editor.task = {
          ...res,
          expire_date: res.expire_date * 1000
        }
      } catch (e) {}
    },

    /**
     * 删除
     * @param index
     * @param row
     * @returns {Promise<void>}
     */
    async handleDelete (index, row) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const success = await apiDelItem({
          tid: row.tid
        })

        if (success) {
          this.table.list.splice(index, 1)
          this.$message.success(`删除成功`)
        } else {
          // eslint-disable-next-line
          throw '删除错误'
        }
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error(`删除失败`)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "tasks";
</style>
