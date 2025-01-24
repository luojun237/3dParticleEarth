import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


class Earth {
  constructor(container,options) {
    this.options = options;
    this.imageData = []
    this.earthPoints = null
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // 相机
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });

    this.control = new OrbitControls(this.camera, this.renderer.domElement)
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // 光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); 
    directionalLight.position.set(100, 100, 100);
    this.scene.add(directionalLight);

    // 创建地球
    this.loadAllImage().then(()=>{
      this.createEarth()
    })

    // 自适应窗口
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 开始动画
    this.animate();
  }


  // 加载图片
  loadAllImage(){
    const promises = this.options.imageAssets.map((item)=>{
      return new Promise((resolve)=>{
          const img = new Image()
          img.src = item
          img.onload = function(e){
              const canvas = document.createElement("canvas")
              canvas.width = img.width
              canvas.height = img.height
              const ctx = canvas.getContext('2d')
              ctx.drawImage(img,0,0,img.width,img.height)
              const imageData = ctx.getImageData(0,0,img.width,img.height)
              resolve({
                  img,
                  imageData
              })
          }
      })
    })

    return Promise.all(promises).then((res)=>{
        res.forEach((v,i)=>{
          this.imageData[i] = {
            width:v.img.width,
            height:v.img.height,
            data:v.imageData
          }
        })
        return
    })
  }


  isLandByUV(c, f) {
    const { width,height,data } = this.imageData[0]
    let n = parseInt(width * c) // 根据横纵百分比计算图象坐标系中的坐标
    let o = parseInt(height * f) // 根据横纵百分比计算图象坐标系中的坐标
    return 1 >= data.data[4 * (o *width + n)] // 查找底图中对应像素点的rgba值并判断
  }

  createEarth() {
    //this.earthParticles = new THREE.Object3D()
    // 创建球体几何体
    const geometry = new THREE.SphereGeometry(3, 64, 64);
    
    // 创建材质
    const material = new THREE.MeshLambertMaterial({
      color:this.options.waterColor,
    })

    // 创建网格
    this.earth = new THREE.Mesh(geometry, material);
    this.scene.add(this.earth);
    this.createParticles();
    this.createLines();
  }

  createParticles(){
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const step = 250
    for (let i = 0; i < step; i++) {
        let vec = new THREE.Vector3()
        let radians = step * (1 - Math.sin(i / step * Math.PI)) / step + .5 // 每个纬线圈内的角度均分
        for (let j = 0; j < step; j += radians) {
            let c = j / step // 底图上的横向百分比
            let f = i / step // 底图上的纵向百分比
            if (this.isLandByUV(c, f)) { // 根据横纵百分比判断在底图中的像素值
                const vec3 = new THREE.Vector3()
                var color = new THREE.Color()
                vec3.setFromSpherical(new THREE.Spherical(3.0,f * Math.PI,c * Math.PI * 2 - Math.PI / 2))
                positions.push(vec3.x,vec3.y,vec3.z)
                color.setRGB(3/255,168/255,158/255);
                colors.push(color.r, color.g, color.b);
            }
        }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    var material = new THREE.PointsMaterial({
        vertexColors:true,  // 颜色通过buffer传递进去
        size: 0.02,
        //blending:THREE.AdditiveBlending,
        transparent:false,
        depthWrite: true,
        deepTest:true
    });
    this.earthPoints = new THREE.Points(geometry, material);
    this.scene.add(this.earthPoints);
  }



  // 创建飞线
  createLines(){
    // 北极
    const s1 = [0.0,90.0]
    // 南极 
    const s2 = [0.0,-90.0]

    // 将经纬度转换为3D坐标
    const s1Vector = this.latLongToVector3(s1[1],s1[0],3)
    const s2Vector = this.latLongToVector3(s2[1],s2[0],3)

    // 创建一条曲线
    const curve = new THREE.CubicBezierCurve3(
        s1Vector,
        new THREE.Vector3(3.0,3.5,0.0),
        new THREE.Vector3(3.0,-3.5,0.0),
        s2Vector
    );

    // 根据曲线生成几何体
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // 创建线条材质
    const material = new THREE.LineBasicMaterial({
        color: 0x00ffff,  // 青色
        transparent: true,
        opacity: 0.8,
        linewidth: 1
    });

    // 创建线条
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }

  // 经纬度转换为3D空间坐标,lat纬度，lng经度，radius半径,南半球纬度为负，东半球经度为正
  latLongToVector3(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }

  // 动画循环
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // 地球自转
    if(this.earthPoints) {
      //this.earthPoints.rotation.y += 0.005;
    }

    this.renderer.render(this.scene, this.camera);
  }

  // 销毁
  dispose() {
    this.renderer.dispose();
    this.scene.clear();
    window.removeEventListener('resize', this.onWindowResize);
  }
}

export default Earth;
