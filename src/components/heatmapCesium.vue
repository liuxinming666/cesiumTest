<template>
    <div>
        <div id="cesiumContainer">
            <button class="location-bar"
                    style="left: 10px;top: 10px;font-size: larger;" @click="randomGenHeatMap">随机生成热力图</button>
        </div>
    </div>
</template>

<script>
    var g_viewer = null;
    export default {
        name: "heatmapCesium",
        data(){
            return{
                bbox:[93.412690,32.596075,108.709382,42.793593],//生成数据的边界
                heatMapParams:{},   //生成热力图的参数
                //bbox:[120.87,30.70636,121.934,31.8448],//生成数据的边界
            }
        },
        mounted:function(){
            this.initMap();
            //this.initHeatMap();
            //this.randomGenHeatMap();
        },
        methods:{
            //初始化地图
            initMap:function() {
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
            //根据geojson文件生成热力图
            initHeatMap:function () {
                let heatmap = new CesiumHeatmap(g_viewer, 'js/heatmap/tst.geojson');
            },
            //随机生成热力图
            randomGenHeatMap:function () {
                g_viewer.entities.removeAll();
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                //设置矩形的透明度
                ctx.fillStyle = "rgba(100, 40, 40, 0)";
                ctx.fillRect(10, 10, 100, 50);
                this.heatMapParams.polygonCanvas = canvas;
                //随机生成面
                let polygon = turf.randomPolygon(1,{
                    bbox:this.bbox,
                    num_vertices:6,
                    max_radial_length:10
                });
                let polygonPts = polygon.features[0].geometry.coordinates[0];
                let polygonBox = turf.bbox(polygon.features[0]);
                //热力图的多边形边界
                this.heatMapParams.bbox = polygonBox;

                g_viewer.scene.camera.moveEnd.addEventListener(this.genHeatMap);
                let rectangleChina = new Cesium.Rectangle(
                    Cesium.Math.toRadians(polygonBox[0]),
                    Cesium.Math.toRadians(polygonBox[1]),
                    Cesium.Math.toRadians(polygonBox[2]),
                    Cesium.Math.toRadians(polygonBox[3]));
                g_viewer.scene.camera.flyTo({destination: rectangleChina});

                debugger;
                /*let entityBase = g_viewer.entities.add({
                    polygon:{
                        hierarchy:new Cesium.PolygonHierarchy(
                            Cesium.Cartesian3.fromDegreesArray(_.flatten(polygonPts))
                        ),
                        material: new Cesium.ColorMaterialProperty(
                            new Cesium.Color(0, 0, 1, 0.3))
                    }
                });*/

                let entity = g_viewer.entities.add({
                    polygon:{
                        hierarchy:new Cesium.PolygonHierarchy(
                            Cesium.Cartesian3.fromDegreesArray(_.flatten(polygonPts))
                        ),
                        material: new Cesium.ImageMaterialProperty({
                            image: new Cesium.CallbackProperty(
                                () => this.heatMapParams.polygonCanvas, false
                            ),
                            transparent: true
                        })
                    }
                });

                /*let pts = turf.randomPoint(5000,
                    {
                        bbox:this.bbox
                    }).features;

                let heatMapData = [];
                for(let i=0;i<pts.length;i++){
                    heatMapData.push({
                        x:pts[i].geometry.coordinates[0],
                        y:pts[i].geometry.coordinates[1],
                        value:Math.random()
                    });
                }*/
            },
            //生成热力图
            genHeatMap:function () {
                g_viewer.scene.camera.moveEnd.removeEventListener(this.genHeatMap);
                //计算热力图画布的宽度和高度
                let leftTop = Cesium.Cartesian3.fromDegrees(
                    this.heatMapParams.bbox[0],
                    this.heatMapParams.bbox[3]);
                let screen_leftTop = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                    g_viewer.scene, leftTop);

                let rightBot = Cesium.Cartesian3.fromDegrees(
                    this.heatMapParams.bbox[2],
                    this.heatMapParams.bbox[1]);
                let screen_rightBot = Cesium.SceneTransforms.wgs84ToWindowCoordinates(g_viewer.scene, rightBot);

                this.heatMapParams.canvasWidth = screen_rightBot.x - screen_leftTop.x;
                this.heatMapParams.canvasHeight = screen_rightBot.y - screen_leftTop.y;

                let heatDoc = document.getElementById('divCanvas');
                if(!heatDoc){
                    heatDoc = document.createElement("div");
                    heatDoc.setAttribute("id","divCanvas");
                    heatDoc.setAttribute("style", "width:" + this.heatMapParams.canvasWidth
                        + "px;height:" + this.heatMapParams.canvasHeight + "px;" +
                        "margin: 0px;display: none;" + "background-color: #0000FF;");
                    document.body.appendChild(heatDoc);
                }

                let heatmapInstance = h337.create({
                    // only container is required, the rest will be defaults
                    container: heatDoc,
                    backgroundColor: 'rgba(0,0,1,.95)',
                    gradient: {
                        // enter n keys between 0 and 1 here
                        // for gradient color customization
                        //'.0': 'blue',
                        '.3': '#00FF00',
                        '.6': '#FFFF00',
                        '1': '#FF0000'
                    },
                    maxOpacity: .9,
                    minOpacity: .3,
                    blur:1
                });

                //随机生成数据
                let features = turf.randomPoint(
                    50,
                    {bbox: this.heatMapParams.bbox}).features;

                let points = [];
                for (let i=0;i<features.length;i++){
                    points.push({
                        x: features[i].geometry.coordinates[0],
                        y: features[i].geometry.coordinates[1],
                        value: Math.random()}
                    );
                }

                let heatData = this.convertHeatData(points);

                /*let points = [];
                let max = 0;
                let width = this.heatMapParams.canvasWidth;//screen_rightTop.x - screen_leftBot.x;
                let height = this.heatMapParams.canvasHeight;//screen_rightTop.y - screen_leftBot.y;
                let len = 30;
                //随机生成数据
                while (len--) {
                    let val = Math.floor(Math.random()*100);
                    let radius = Math.floor(Math.random()*100);

                    max = Math.max(max, val);
                    let point = {
                        x: Math.floor(Math.random()*width),
                        y: Math.floor(Math.random()*height),
                        value: val,
                        radius: radius
                    };
                    points.push(point);
                }

                let data = {
                    max: max,
                    data: points
                };*/

                heatmapInstance.setData(heatData);
                this.heatMapParams.polygonCanvas = heatmapInstance._renderer.canvas;
            },
            //热力图数据转换
            convertHeatData:function (points) {
                let data = [];
                let max = 1;
                debugger;
                for (let i = 0;i < points.length;i++){
                    let x = ((points[i].x - this.heatMapParams.bbox[0]) / (this.heatMapParams.bbox[2] - this.heatMapParams.bbox[0])) * this.heatMapParams.canvasWidth;
                    let y = ((points[i].y - this.heatMapParams.bbox[3]) / (this.heatMapParams.bbox[1] - this.heatMapParams.bbox[3])) * this.heatMapParams.canvasHeight;

                    max = Math.max(max, points[i].value);
                    data.push({
                        x:x.toFixed(0),
                        y:y.toFixed(0),
                        value:points[i].value
                    });
                }
                debugger;
                let heatData = {
                    max:max,
                    data:data
                };

                return heatData;
            }
        }
    }
</script>

<style scoped>
    .location-bar {
        position: absolute;
        z-index: 1;
        /*        padding: 3px 10px;
                font-size: 13px;
                color: #fff;
                text-shadow: 5px 2px 6px #000;*/
    }
</style>