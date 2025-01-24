import Earth from './earth';

const earth = new Earth(document.getElementById('container'),{
    showGird:true, // 是否显示网格
    showAxis:true, // 是否显示坐标轴
    landColor:0x00ff00, // 陆地颜色
    waterColor:0x0A1034,
    imageAssets:['/images/earth.jpg']
});
