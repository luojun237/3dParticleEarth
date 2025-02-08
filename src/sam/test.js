const promise1 = Promise.resolve('成功1');
const promise2 = new Promise((resolve, reject) => {
  setTimeout(()=>{
    reject('失败2');
  },1000);

});
const promise3 = new Promise((resolve, reject) => {
  setTimeout(()=>{
    resolve('成功3');
  },2000);
});



Promise.allSettled([promise1, promise2, promise3]).then((values) => {
  console.log(values);
}).catch((error) => {
  console.log(error); // "error occurred"
});