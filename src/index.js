import request from '@/utils/request'
export const getOssToken = () => request.get('/rest/auth/fileup/getstsinfo.do', {
});
var OSS = require('ali-oss');
export const newOSS = (response) => {
  return new OSS({
    accessKeyId: response.AccessKeyId,
    accessKeySecret: response.AccessKeySecret,
    stsToken: response.SecurityToken,
    endpoint:"oss-cn-beijing.aliyuncs.com",
    bucket:"ram-test-app-nd"
  });
};
