import Earth from './earth';

const earth = new Earth(document.getElementById('container'),{
    showGird:true, // 是否显示网格
    showAxis:true, // 是否显示坐标轴
    landColor:0x00ff00, // 陆地颜色
    waterColor:0x0A1034,
    imageAssets:['/images/earth.jpg'],
    lineColor:0xff00ff, // 飞线颜色,粉色
    lines:[
        // 北极-南极
        {
            start:[0.0,90.0],
            end:[0.0,-90.0]
        },
        {
            start:[0.0,0.0],
            end:[180,1]
        },
        // 北京-新德里
        {
            start:[116.39,39.90],
            end:[77.17,28.61]
        },
        // 北京-东京
        {
            start:[116.39,39.90],
            end:[139.77,35.68]
        },
        // 巴黎-纽约
        {
            start:[2.35,48.85],
            end:[-74.00,40.71]
        },
        // 莫斯科到悉尼
        {
            start:[37.62,55.75],
            end:[151.21,-33.87]
        },   
    ]
});
