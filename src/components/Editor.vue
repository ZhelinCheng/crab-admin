<template>
  <div class="editor">
    <div id="ace-editor" ref="ace" class="editor-ctx">
      const task = {
      save () {
      // 保存数据
      console.log(111)
      }
      }
    </div>
    <div class="editor-panel">
      <div class="box">
        <h3 class="editor-panel__title">创建任务</h3>
        <div class="editor-panel__setting">
          <el-form ref="ruleForm" label-position="top" class="demo-ruleForm">
            <el-form-item label="标题" prop="pass">
              <el-input type="text"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="插入表" prop="pass">
              <el-input type="text"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="定时" prop="pass">
              <el-input type="text"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="pass">
              <el-input type="text"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="错误延迟" prop="pass">
              <el-input type="text"  autocomplete="off"></el-input>
            </el-form-item>
            <el-button type="primary" class="btn-submit">创建任务</el-button>
          </el-form>
        </div>
        <el-button-group class="editor-panel__btn">
          <el-button size="medium" class="btn-format">格式化</el-button>
          <el-button size="medium" class="btn-close">关闭</el-button>
        </el-button-group>
      </div>

    </div>
  </div>
</template>

<script>
import ace from 'ace-builds'
import 'ace-builds/webpack-resolver' // 在 webpack 环境中使用必须要导入
import 'ace-builds/src-noconflict/ext-language_tools' // 提示工具
import 'ace-builds/src-noconflict/ext-beautify' // 格式工具
import 'ace-builds/src-noconflict/theme-monokai' // 默认设置的主题
import 'ace-builds/src-noconflict/mode-javascript' // 默认设置的语言模式
import 'ace-builds/src-noconflict/snippets/javascript' // 自动提示

let editor, beautify

export default {
  name: 'Editor',
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
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

      beautify.beautify(editor.session)
    }
  }
}
</script>

<style lang="less">
  @import "Editor";
</style>
