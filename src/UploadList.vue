<template>
<div class="upload-dialog">
  <div class="dialog-top">
    <span style="float:left">正在上传（1/2）</span>
    <i style="float:right" class="el-icon-minus"></i>
    <i style="float:right" class="el-icon-close"></i>
  </div>
  <el-table :data="fileList" style="width: 100%">
    <el-table-column prop="file.name" label="文件名" width="200" align="center">
    </el-table-column>
    <el-table-column label="大小" width="80" align="center">
      <template slot-scope="scope">
          <span>{{scope.row.file.size | formatFileSize}}M</span>
      </template>
    </el-table-column>
    <el-table-column prop="dirName" label="上传目录" align="center">
    </el-table-column>
    <el-table-column label="状态" align="center">
      <template slot-scope="scope">
          <span>{{(Math.floor(((scope.row.p.toFixed(2) * 10000) / 100)))}}%</span>
      </template>
    </el-table-column>
    <el-table-column prop="" label="操作" align="center">
      <template slot-scope="scope">
        <div v-if="!(scope.row.p==1)">
          <span @click="startUplod(scope.row.index)" v-if='scope.row.isPause'><svg-icon  :icon-class="'play'"  ></svg-icon></span>
          <span @click="pauseUplod(scope.row.time,scope.row.index)" v-if='!scope.row.isPause'><svg-icon  :icon-class="'pause'" ></svg-icon></span>
          <span @click="delUplod(scope.row.time,scope.$index)"><svg-icon  :icon-class="'del'"></svg-icon></span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>
<script>
import {
  getOssToken,
  newOSS
} from './';
let co = require('co');
export default {
  name: 'UploadList',
  data() {
    return {
      fileList: [],
      client: {},
      checkpoint: {},
    }
  },
  props: {
    cachFiles: {
      type: Object,
      // default: function() {
      //   return {}
      // }
    },
  },
  // computed: {
  //   cachFiles() {
  //     return ｛｝
  //   }
  // },
  methods: {
    handleUplod() {
      let $this = this;
      let cachFiles = $this.cachFiles;
      let file = cachFiles.file,
        path = cachFiles.path,
        index = cachFiles.index,
        time = cachFiles.time;
      // console.log("index:"+index);
      // console.log("checkpoint:" + $this.checkpoint[time]);
      // $this.fileList.splice(index, 1, cachFiles)
      getOssToken().then(response => {
        $this.client[time] = newOSS(response)
        co(function*() {
          var result = yield $this.client[time].multipartUpload(path + file.name, file, {
            checkpoint: $this.checkpoint[time],
            // partSize: 102400,
            progress: function*(p, cpt, response) {
              $this.checkpoint[time] = cpt;
              // p = (Math.floor(((p.toFixed(2) * 10000) / 100))) + "%";
              // p = p == "100%" ? "完成" : p;
              // console.log("进度：" + p);
              if (p == 1) {
                $this.fileList[index].isPause = -1;

              }
              cachFiles.p = p;
              console.log("进度：" + p);
              // console.log("index:"+index);
              $this.fileList[index].p = p;
            },
            meta: {
              year: 2017,
              people: 'test'
            },
            headers: {
              year: 2017,
            },
            mime: file.type
          });
          // console.log(result);
        }).catch(function(err) {
          console.log(err);
        });
      })
    },
    startUplod(index) {
      this.fileList[index].isPause = false;
      this.cachFiles = this.fileList[index];
      this.handleUplod()
    },
    pauseUplod(time, index) {
      this.client[time].cancel();
      this.fileList[index].isPause = true;
    },
    delUplod(time, index) {
      this.pauseUplod(time, index)
      this.fileList.splice(index, 1)
    }
  },
  watch: {
    cachFiles: function() {
      console.log("有变化");
      let index = this.cachFiles.index;
      if (index == undefined) {
        this.cachFiles.index = this.fileList.length;
        this.fileList.push(this.cachFiles);
      } else {
        this.fileList[index].isPause = false;
      }
      this.handleUplod()
    }
  },
}
</script>
