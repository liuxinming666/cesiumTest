<template>
    <div id="cesiumContainer">
        <button class="location-bar" style="top:10px;left: 10px;" @click="onLoadImageBtnClick">加载图片</button>
    </div>
</template>

<script>
    var g_viewer = null;
    export default {
        name: "imagesCesium",
        data(){
            return{
                bbox:[120.87,30.70636,121.934,31.8448]      //生成数据的边界
            }
        },
        mounted:function(){
            this.initMap();
        },
        methods:{
            //初始化地图
            initMap:function(){
                let viewerOption = {
                    imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
                        url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=3b6e1ded5e34e4a985ce9167106c62a0",
                        layer: "tdtBasicLayer",
                        style: "default",
                        format: "image/jpeg",
                        tileMatrixSetID: "GoogleMapsCompatible",
                        maximumLevel: 18
                    }),
                    terrainProvider:new Cesium.CesiumTerrainProvider({
                        url:"https://lab.earthsdk.com/terrain/577fd5b0ac1f11e99dbd8fd044883638",
                        requestVertexNormals: true,
                        requestWaterMask: true
                    }),
                    /*imageryProvider: new Cesium.UrlTemplateImageryProvider({
                        url: 'http://115.29.141.58:8098/MapData/china/{z}/{x}/{y}.png',
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        minimumLevel: 0,
                        maximumLevel: 8
                    }),
                    terrainProvider:new Cesium.CesiumTerrainProvider({
                        url: 'http://115.29.141.58:8098/MapData/hongshuiDEM',
                        requestVertexNormals: true,
                        requestWaterMask: true
                    }),*/
                    geocoder: true,
                    baseLayerPicker: false,
                    fullscreenButton: false,
                    homeButton: false,
                    infoBox: false,
                    selectionIndicator: false,
                    timeline: false,
                    navigationHelpButton: false,
                    navigationInstructionsInitiallyVisible: false,
                    animation: false,
                    sceneMode: Cesium.SceneMode.SCENE3D//SCENE2D
                };
                g_viewer = new Cesium.Viewer('cesiumContainer', viewerOption);

                g_viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权
            },
            onLoadImageBtnClick:function () {
                let rectangleChina = new Cesium.Rectangle(
                    Cesium.Math.toRadians(this.bbox[0]),
                    Cesium.Math.toRadians(this.bbox[1]),
                    Cesium.Math.toRadians(this.bbox[2]),
                    Cesium.Math.toRadians(this.bbox[3]));
                g_viewer.scene.camera.flyTo({destination: rectangleChina});

                let entity = g_viewer.entities.add({
                    rectangle:{
                        coordinates:rectangleChina,
                        material:new Cesium.ImageMaterialProperty({
                            image:'jksp.png',
                            transparent:true
                        })
                    }
                });

            }
        }
    }
</script>

<style scoped>
    #cesiumContainer {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    .location-bar {
        position: absolute;
        z-index: 1;
        /*        padding: 3px 10px;
                font-size: 13px;
                color: #fff;
                text-shadow: 5px 2px 6px #000;*/
    }
</style>