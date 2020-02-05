<template>
  <div class="hello" :style="{height: fullHeight + 'px'}">
    <div class="header">
      <img class="hx-logo" src="../assets/images/logo.png" alt="logo">
    </div>
    <div class="main">
      <div class="btn-groups">
        <button @click="changeMinute(3)" :class="{'layui-btn time-btn': true, 'active': minute == 3}"><span class="time">3</span>分钟</button>
        <button @click="changeMinute(5)" :class="{'layui-btn time-btn': true, 'active': minute == 5}"><span class="time">5</span>分钟</button>
        <button @click="changeMinute(8)" :class="{'layui-btn time-btn': true, 'active': minute == 8}"><span class="time">8</span>分钟</button>
        <button @click="changeMinute(10)" :class="{'layui-btn time-btn': true, 'active': minute == 10}"><span class="time">10</span>分钟</button>
        <div style="display: inline-block;padding-right:20px;">
          <!-- <input type="text" name="title" autocomplete="off" placeholder="请输入标题" class="layui-input">
          <span>min</span> -->
          <span>
            <input type="number" class="layui-input input" v-model="inputMinute">
          </span>
          <span>
              min
          </span>
        </div>
        <button @click="customMinute" :class="{'layui-btn custom-btn': true}">定制</button>
      </div>
      <div class="group">
        <div>
          <div class="countdown">
            <div class="box left">
              <span>{{ hour2 }}</span>
            </div>
          </div>
          <div class="countdown">
            <div class="box">
              <span>{{ hour1 }}</span>
            </div>
          </div>
        </div>
        <span>hour</span>
      </div>
      <div class="group" style="vertical-align: top">
        <div>
          <img src="../assets/images/point.png" alt="" height="224">
        </div>
        <span style="height: 40px"></span>
      </div>
      <div class="group">
        <div>
          <div class="countdown">
            <div class="box left">
              <span>{{ minute2 }}</span>
            </div>
          </div>
          <div class="countdown">
            <div class="box">
              <span>{{ minute1 }}</span>
            </div>
          </div>
        </div>
        <span>minute</span>
      </div>
      <div class="group" style="vertical-align: top">
        <div>
          <img src="../assets/images/point.png" alt="" height="224">
        </div>
        <span style="height: 40px"></span>
      </div>
      <div class="group">
        <div>
          <div class="countdown">
            <div class="box left">
              <span>{{ second2 }}</span>
            </div>
          </div>
          <div class="countdown">
            <div class="box">
              <span>{{ second1 }}</span>
            </div>
          </div>
        </div>
        <span>second</span>
      </div>
    </div>
    <div class="countdown-footer" :style="{'padding-bottom': fBottom + 'px'}">
      <div class="functional-area">
        <img v-if="enableVoice" @click="enableVoice = !enableVoice" src="../assets/images/voice.png" alt="" title="关闭声音提醒">
        <img v-if="!enableVoice" @click="enableVoice = !enableVoice" src="../assets/images/mute.png" alt="" title="开启声音提醒">
        <img v-if="!starting" @click="start" src="../assets/images/play.png" alt="" title="开始计时">
        <img v-if="starting" @click="stop" src="../assets/images/stop.png" alt="" title="停止计时">
        <img @click="refresh" src="../assets/images/refresh.png" alt="" style="padding-right: 0px" title="重新计时">
      </div>
      <!-- <img v-if="fullHeight >= 900" src="../assets/images/microphone.png" alt=""> -->
    </div>
    <audio id="voice30">   
      <source src="/audio/voice30.mp3" type="audio/mpeg">
    </audio>
    <audio id="voice3">   
      <source src="/audio/voice3.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      fullHeight: document.documentElement.clientHeight,
      fBottom: 20,
      hour1: 0,
      hour2: 0,
      minute1: 0,
      minute2: 0,
      second1: 0,
      second2:0,
      minute: 3,
      timer: null,
      second: 0,
      starting: false,
      enableVoice: true,
      inputMinute: ''
    }
  },
  props: ['min', 'isStart'],
  mounted () {
    this.minute = this.min || this.minute;
    this.second = this.minute * 60;
    var timeVals = this.formatSeconds(this.second);
    this.second1 = timeVals[0];
    this.second2 = timeVals[1];
    this.minute1 = timeVals[2];
    this.minute2 = timeVals[3];
    this.hour1 = timeVals[4];
    this.hour2 = timeVals[5];

    if(this.fullHeight <= 700){
      this.fBottom = 20;
    } else {
      this.fBottom = 39;
    }

    window.addEventListener('resize', this.handleResize);

    if(this.isStart){
      this.start();
    }
  },
  watch: {
    minute: function(){
      this.second = this.minute * 60;
      var timeVals = this.formatSeconds(this.second);
      this.second1 = timeVals[0];
      this.second2 = timeVals[1];
      this.minute1 = timeVals[2];
      this.minute2 = timeVals[3];
      this.hour1 = timeVals[4];
      this.hour2 = timeVals[5];
    }
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize: function (event) {
      this.fullHeight = document.documentElement.clientHeight;
      if(this.fullHeight <= 700){
        this.fBottom = 20;
      } else {
        this.fBottom = 39;
      }
    },
    changeMinute: function(minute) {
      this.minute = minute;
      this.second = this.minute * 60;
      this.starting = false;
      clearInterval(this.timer);
      this.timer = null;
    },
    customMinute: function(){
      if(!/^\d+$/.test(this.inputMinute)){
        alert("请输入整数。");
      } else {
        this.changeMinute(this.inputMinute);
      }
    },
    start: function(){
      
      this.starting = !this.starting;
      if(this.timer != null){
        return;
      }

      //this.second = this.minute * 60;
      var timeVals = this.formatSeconds(this.second);
      this.second1 = timeVals[0];
      this.second2 = timeVals[1];
      this.minute1 = timeVals[2];
      this.minute2 = timeVals[3];
      this.hour1 = timeVals[4];
      this.hour2 = timeVals[5];
      this.timer =  setInterval(() => {
        if(!this.starting){
          return;
        }
        this.second = this.second - 1;
        if(this.second == 30 && this.enableVoice){
          // 提示声音
          document.getElementById('voice30').play();
        } else if(this.second == 4 && this.enableVoice){
           // 提示声音
          document.getElementById('voice3').play();
        }
        var timeVals = this.formatSeconds(this.second);
        this.second1 = timeVals[0];
        this.second2 = timeVals[1];
        this.minute1 = timeVals[2];
        this.minute2 = timeVals[3];
        this.hour1 = timeVals[4];
        this.hour2 = timeVals[5];
        if(this.second == 0){
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);


    },
    stop: function(){
      this.starting = false;
    },
    refresh: function(){
      this.second = this.minute * 60;
      this.starting = false;
      clearInterval(this.timer);
      this.timer = null;
      var timeVals = this.formatSeconds(this.second);
      this.second1 = timeVals[0];
      this.second2 = timeVals[1];
      this.minute1 = timeVals[2];
      this.minute2 = timeVals[3];
      this.hour1 = timeVals[4];
      this.hour2 = timeVals[5];
      //this.start();
    },
    formatSeconds: function(value) {
      var timeVals = [];
      var secondTime = parseInt(value);// 秒
      
      var minuteTime = 0;// 分
      var hourTime = 0;// 小时
      if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
          //获取分钟，除以60取整数，得到整数分钟
          minuteTime = parseInt(secondTime / 60);
          //获取秒数，秒数取佘，得到整数秒数
          secondTime = parseInt(secondTime % 60);
          //如果分钟大于60，将分钟转换成小时
          if(minuteTime > 60) {
              //获取小时，获取分钟除以60，得到整数小时
              hourTime = parseInt(minuteTime / 60);
              //获取小时后取佘的分，获取分钟除以60取佘的分
              minuteTime = parseInt(minuteTime % 60);
          }
      }
      var result = "" + parseInt(secondTime) + "秒";
      if(secondTime > 0){
        var secondTimeStr = secondTime >= 10 ? (secondTime + "") : ("0" + secondTime);
        timeVals.push(secondTimeStr.charAt(1));
        timeVals.push(secondTimeStr.charAt(0));
      } else {
        timeVals.push(0);
        timeVals.push(0);
      }

      if(minuteTime > 0) {
        //result = "" + parseInt(minuteTime) + "分" + result;
        var minuteTimeStr = minuteTime >= 10 ? (minuteTime + "") : ("0" + minuteTime);
        timeVals.push(minuteTimeStr.charAt(1));
        timeVals.push(minuteTimeStr.charAt(0));
      } else {
        timeVals.push(0);
        timeVals.push(0);
      }
      if(hourTime > 0) {
        result = "" + parseInt(hourTime) + "小时" + result;
        var hourTimeStr = hourTime >= 10 ? (hourTime + "") : ("0" + hourTime);
        timeVals.push(hourTimeStr.charAt(1));
        timeVals.push(hourTimeStr.charAt(0));
      } else {
        timeVals.push(0);
        timeVals.push(0);
      }
      return timeVals;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello {
    background: -webkit-linear-gradient(#ffffff, #d7d7d7); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#ffffff, #d7d7d7); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#ffffff, #d7d7d7); /* Firefox 3.6 - 15 */
    background: linear-gradient(#ffffff, #d7d7d7); /* 标准的语法 */
    position: relative;
    font-family: 'Helvetica Neue';
  }
  .header {
    text-align: left;
    padding-top: 20px;
    margin-left: 50px;
  }
  .logo {

  }
  .main {
    padding-top: 20px;
    text-align: center;
  }
  .layui-btn {
    color: #f1f3f6;
    font-size: 14px;
    margin-right: 20px;
    line-height: 42px;
    height: 42px;
  }
  .time-btn {
    background: #cbd2db;
    width: 90px;
  }
  .time-btn.active {
    background-color: #e93e47;
  }
  .custom-btn {
    background-color: #469dee;
  }
  .btn-groups input {
    display: inline-block;
    width: 80px;
    height: 42px;
    line-height: 42px;
  }
  .btn-groups > div > span {
    border: 1px solid #e1e6eb;
    display: inline-block;
    height: 42px;
    line-height: 40px;
    width: 74px;
    background: #f0f3f6;
    font-weight: bold;
  }
  .time {
    font-size: 22px;
  }
  .group {
    display: inline-block;
    margin-top: 60px;
  }
  .group > div {
    margin-bottom: 26px;
  }
  .group > span {
    color: #82878d;
    font-size: 30px;
  }
  .countdown {
    display: inline-block;
  }
  .box {
    width: 120px;
    height: 210px;
    border: 1px solid #a8aeb5;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box.left {
    margin-right: 12px;
  }
  .box span {
    font-size: 160px;
    color: #000000;
  }
  .countdown-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    clear:both;
    text-align: center;
  }
  .functional-area {
    margin-bottom: 30px;
  }
  .functional-area img {
    padding-right: 50px;
    cursor: pointer;
  }
</style>
