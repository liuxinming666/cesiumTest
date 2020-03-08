<template>
  <div id="app">
      <echarts-cesium3></echarts-cesium3>
      <!--<echarts-cesium2></echarts-cesium2>-->
      <!--<EchartsCesium></EchartsCesium>-->
      <!--<heatmap-cesium></heatmap-cesium>-->
    <!--<img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import EchartsCesium from "./components/echartsCesium";
import HeatmapCesium from "./components/heatmapCesium";
import EchartsCesium2 from "./components/echartsCesium2";
import EchartsCesium3 from "./components/echartsCesium3";

export default {
  name: 'App',
  components: {
      EchartsCesium3,
      EchartsCesium2,
      HeatmapCesium,
      EchartsCesium,
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
