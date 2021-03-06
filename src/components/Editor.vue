<template>
  <div class="editor">
    <div class="editor-ctx">
      <div class="rec" ref="ace"></div>
      <div class="console">
        <h3 class="console-title">控制台</h3>
        <div class="console-ctx">
         <!-- #e6a23c-->
          <p :class="'c-' + (item.type || 'd')" v-for="(item, index) in console" :key="index">
            [{{item.date}}]：{{item.msg}}
          </p>
        </div>
      </div>
    </div>
    <div class="editor-panel">
      <div class="box">
        <h3 class="editor-panel__title">{{ taskInfo.tid ? '更新' : '创建' }}任务</h3>
        <div class="editor-panel__setting">
          <el-form ref="ruleForm" label-position="top" class="demo-ruleForm">
            <el-form-item label="标题" prop="pass">
              <el-input
                type="text"
                placeholder="请输入任务标题"
                maxlength="25"
                show-word-limit
                v-model="taskInfo.title"
                autocomplete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="定时" prop="pass">
              <el-input
                type="text"
                maxlength="25"
                show-word-limit
                placeholder="请输入Cron格式的时间"
                v-model="taskInfo.cron"
                autocomplete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="插入表" prop="pass">
              <el-input
                type="text"
                maxlength="25"
                show-word-limit
                placeholder="指定插入表"
                v-model="taskInfo.table"
                autocomplete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="taskInfo.type" placeholder="请选择">
                <el-option
                  v-for="item in typesOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="错误延迟" prop="pass">
              <el-input
                type="number"
                v-model.number="taskInfo.error_time"
                max="3600"
                min="0"
                step="1"
                autocomplete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="过期时间">
              <el-date-picker
                v-model="taskInfo.expire_date"
                type="datetime"
                value-format="timestamp"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-button @click="taskSubmit" type="primary" class="btn-submit">{{ taskInfo.tid ? '更新' : '创建' }}任务</el-button>
          </el-form>
        </div>
        <el-button-group class="editor-panel__btn">
          <el-button @click="testCode" size="medium" class="btn-test">测试任务</el-button>
          <el-button @click="beautifyCode" size="medium" class="btn-format">格式化</el-button>
          <el-button @click="closeEditor" size="medium" class="btn-close">关闭</el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script>
import {
  apiPutItem,
  apiAddItem
} from '@/request'
import ace from 'ace-builds'
import 'ace-builds/webpack-resolver' // 在 webpack 环境中使用必须要导入
import 'ace-builds/src-noconflict/ext-language_tools' // 提示工具
import 'ace-builds/src-noconflict/ext-beautify' // 格式工具
import 'ace-builds/src-noconflict/theme-monokai' // 默认设置的主题
import 'ace-builds/src-noconflict/mode-javascript' // 默认设置的语言模式
import 'ace-builds/src-noconflict/snippets/javascript' // 自动提示

let editor, beautify, ws

export default {
  name: 'Editor',
  model: {
    prop: 'taskInfo',
    event: 'taskInfoSave'
  },
  props: {
    taskInfo: {
      type: Object,
      default: function () {
        return {
          title: '',
          table: '',
          cron: '',
          type: 1,
          error_time: 0,
          expire_date: 1861891200,
          code: ''
        }
      }
    }
  },
  data () {
    return {
      console: [],
      typesOptions: [{
        value: 1,
        label: '未分类'
      }]
    }
  },
  mounted () {
    this.initEditor()
  },
  updated () {
    this.createWebSocket()
  },
  methods: {
    logs (msg, type = '', date = '编辑器') {
      this.console.push({
        date,
        type,
        msg
      })
    },

    // 关闭编辑器
    closeEditor () {
      ws && ws.close()
      ws = null
      this.console = []
      this.$emit('close')
    },

    // 测试代码
    testCode () {
      const code = editor.getValue()
      if (!this.checkCode(code)) {
        return
      }
      ws.send(code)
    },

    // 校验代码
    checkCode (code) {
      if (!code) {
        this.logs('你还没有编写任务代码', 'error')
        return false
      }

      try {
        const codeObj = (new Function(`const module = {}; ${code}; return module.exports`))() // eslint-disable-line
        if (!(codeObj instanceof Object) || !codeObj.onRequest) {
          this.logs('代码不合规范，或未定义onRequest方法', 'error')
          return false
        }

        return true
      } catch (e) {
        console.error(e)
        this.logs(e.message, 'error')
        return false
      }
    },

    // 创建WebSocket链接
    createWebSocket () {
      if (ws) return

      ws = new WebSocket(`ws://${window.location.hostname}:4011`)

      ws.addEventListener('open', (event) => {
        this.console.push({
          date: 'WebSocket',
          type: '',
          msg: '链接成功'
        })
      })

      ws.addEventListener('message', (event) => {
        console.log('Message from server ', event.data)
        this.console.push(JSON.parse(event.data))
      })
    },

    async taskSubmit () {
      try {
        const code = editor.getValue()
        if (!this.checkCode(code)) {
          return
        }

        this.taskInfo.code = code
        const tid = this.taskInfo.tid
        const task = JSON.parse(JSON.stringify(this.taskInfo))

        let success = false
        task.expire_date = Math.ceil(task.expire_date / 1000)
        if (tid) {
          delete task.tid
          delete task.open
          delete task.created_at
          success = await apiPutItem({
            where: {
              tid
            },
            update: {
              ...task
            }
          })
        } else {
          success = await apiAddItem(task)
        }

        if (success) {
          this.$emit('taskInfoSave', this.taskInfo)
          this.$emit('close')
          this.$message.success(`${tid ? '更新' : '创建'}任务成功！`)
        } else {
          this.$message.error(`${tid ? '更新' : '创建'}任务失败！`)
        }
      } catch (err) {
        console.error(err)
        this.$message.error(err.message)
      }
    },

    beautifyCode () {
      beautify.beautify(editor.session)
    },

    /**
     * 初始化编辑器
     */
    initEditor () {
      if (editor) return
      ace.require('ace/ext/language_tools')
      beautify = ace.require('ace/ext/beautify')
      editor = ace.edit(this.$refs.ace, {
        minLines: 10, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
        fontSize: 16, // 编辑器内字体大小
        theme: 'ace/theme/monokai', // 默认设置的主题
        mode: 'ace/mode/javascript', // 默认设置的语言模式
        tabSize: 4 // 制表符设置为 4 个空格大小
      })
      editor.setOptions({
        autoScrollEditorIntoView: true,
        copyWithEmptySelection: true,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      })
    }
  },
  watch: {
    'taskInfo.code' (to) {
      editor.setValue(to)
      beautify.beautify(editor.session)
    }
  }
}
</script>

<style lang="less">
  @import "Editor";
</style>
