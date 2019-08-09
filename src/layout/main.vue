<template>
  <div class="wrapper">
    <el-container>
      <el-aside width="65px">
        <el-menu :collapse="true">
          <el-menu-item index="1">
            <i class="el-icon-s-home"></i>
            <span slot="title">面板</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">任务</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-s-tools"></i>
            <span slot="title">设置</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-message-solid"></i>
            <span slot="title">消息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'layoutMain',
  components: {}
}
</script>

<style lang="less">
  .el-container,
  .el-menu,
  .wrapper {
    height: 100%;
  }

  .el-main {
    overflow: auto;
  }
</style>
