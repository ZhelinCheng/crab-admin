<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  html,
  body,
  #app {
    height: 100%;
    width: 100%;
    color: #303133;
    overflow: hidden;
  }

  * {
    box-sizing: border-box;
    font-family: "Microsoft YaHei", Arial, "Helvetica Neue", Helvetica, sans-serif;
  }
</style>
