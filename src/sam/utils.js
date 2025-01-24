import { Vector3 } from 'three/build/three.module';
// 归一化,例如150，映射到100-200，结果为0.5
export function normalize(value, min, max) {
    return (value - min) / (max - min) || 0;
}

// 线性插值,例如将0-1的值映射到10-20的值
export function lerp(norm, min, max) {
    return (max - min) * norm + min;
}

export function smoothstep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
}

export function map(value, sourceMin, sourceMax, destMin, destMax) {
    return lerp(normalize(value, sourceMin, sourceMax), destMin, destMax);
}

export const DEG2RAD = Math.PI / 180;
export const RAD2DEG = 180 / Math.PI;
export function degreesToRadians(degrees) {
  return degrees * DEG2RAD;
}

export function radiansToDegrees(radians) {
    return radians * RAD2DEG;
}

export function latLonMidPointMul(latlonArr){
    let x = 0,y = 0, z = 0;
    let lon,lat;
    for(var i = 0; i < latlonArr.length; i++){
      let latlon = latlonArr[i];
      // lon 经度
      lon = degreesToRadians(latlon.lon);
      // lat 纬度
      lat = degreesToRadians(latlon.lat);
  
      x += Math.cos(lat) * Math.sin(lon);
      y += Math.cos(lat) * Math.cos(lon);
      z += Math.sin(lat);
    }
  
    x /= latlonArr.length;
    y /= latlonArr.length;
    z /= latlonArr.length;
  
    lon = radiansToDegrees(Math.atan2(x,y));
    lat = radiansToDegrees(Math.atan2(z,Math.sqrt(x*x + y*y)));
    return [lon, lat];
  }


/**
 * Convert [lat,lon] polar coordinates to [x,y,z] cartesian coordinates
 * @param {Number} lon
 * @param {Number} lat
 * @param {Number} radius
 * @return {Vector3}
 */
export function polarToCartesian(lat, lon, radius, out) {     //根据球的参数方程来转化
    out = out || new Vector3();
    const phi = (90 - lat) * DEG2RAD;
    const theta = (lon + 180) * DEG2RAD;
    out.set(-(radius * Math.sin(phi) * Math.cos(theta)), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
    return out;
  }