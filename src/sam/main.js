import Earth from './earth';

const earth = new Earth(document.getElementById('container'),{
    showGird:true, // 是否显示网格
    showAxis:true, // 是否显示坐标轴
    landColor:0x00ff00, // 陆地颜色
    waterColor:0x0A1034,
    imageAssets:['/images/earth.jpg'],
    lines:[
        // 北极-南极
        // {
        //     start:[0.0,90.0],
        //     end:[0.0,-90.0]
        // },
        // 东京-纽约
        // {
        //     start:[0.0,90.0],
        //     end:[0,-60]
        // },
        // 北京-雅加达
        {
            start:[116.39,39.90],
            end:[106.82,1.25]
        },
    ]
});
