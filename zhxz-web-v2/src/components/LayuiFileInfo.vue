<template>
    <div>

      <layui-fieldset label="附件信息">
        <i id="uploadFiles" class="fa fa-plus text-warning select-pros" style="font-size: 16px; cursor: pointer;"></i>
      </layui-fieldset>
      <div class="file-box">
        <div class="file">
          <a href="#">
            <span class="corner"></span>
            <div class="icon">
              <i class="fa fa-file-powerpoint-o text-warning"></i>
            </div>
            <div class="file-name">
              <p>业务需求与流程梳理</p>
              <p>20180622.ppt</p>
              <p>上传者：戚威</p>
              <small>上传时间：2017-10-12</small>
            </div>
          </a>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "LayuiFileInfo"
    }
</script>

<style scoped >
  .icon{
    display: inline-block!important;
    /*height: 90px!important;*/
    width: 150px!important;
    margin-top: 12px!important;
    margin-bottom: 5px!important;
  }

  /* COLORS */
  .file .icon i.text-success {
    color: #009688;
  }
  .file .icon i.text-info {
    color: #01aaed;
  }
  .file .icon i.text-warning {
    color: #f8ac59;
  }
  .file .icon i.text-danger {
    color: #ed5565;
  }
  .file .icon i.text-blue{
    color: #1e9fff;
  }
  .file .icon i.text-yellow{
    color: #ffb800;
  }

</style>
