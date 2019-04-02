import axios from 'axios'
const qs = require('qs');
// axios.defaults.baseURL = 'https://lem.chanel.com.cn/';
axios.defaults.baseURL = 'https://homework.widiazine.cn/chanels/';
export const uploadUrl=axios.defaults.baseURL+'/api.php?entry=sys&c=account&a=upload';
// export const baseURL='https://lem.chanel.com.cn/';
export const baseURL = 'https://homework.widiazine.cn/chanels/';
export function ajaxTo(url,data){
  const requestUrl = url;
  return new Promise((resolve, reject) => {
    axios.post(requestUrl,qs.stringify(data))
    .then(function(res){
      console.log(res);
      if(res.status == 200){
        console.log('123');
        resolve(res.data);
      }
    })
    .catch(function(error){
      reject(error);
    })
  })
}
