//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    item: 0,
    tab: 0,
    playlist: [
      {
        id: 1,
        title: "钢琴协奏曲",
        singer: "肖邦",
        src:
          "https://webfs.yun.kugou.com/202005201031/3d82760223b72cb551a93bd9aaa2788b/G053/M00/18/18/FZQEAFZ6IoiAfr-qAG7ARxml_ww466.mp3",
        coverImgUrl: "/images/music.png",
      },
      {
        id: 2,
        title: "奏鸣曲",
        singer: "Mozart",
        src:
          "https://webfs.yun.kugou.com/202005201037/09f7de8844a0138f4478beb362c0013d/G028/M00/00/19/XA0DAFWiou2AEPV0AC_bnV55GpY405.mp3",
        coverImgUrl: "/images/music.png",
      },
      {
        id: 3,
        title: "欢乐颂",
        singer: "贝多芬",
        src:
          "https://webfs.yun.kugou.com/202005201038/43d1377738c5d72e6fc6557942b26272/G057/M00/0C/09/GZQEAFaLjA-AEORbAFysYBAILd8406.mp3",
        coverImgUrl: "/images/music.png",
      },
      {
        id: 4,
        title: "爱之梦",
        singer: "李斯特",
        src:
          "https://webfs.yun.kugou.com/202005201039/2741fcbfee18007890a80ed5f266e342/G127/M08/19/05/X5QEAFyAz1OAUn64ACsYoqMaB0I867.m4a",
        coverImgUrl: "/images/music.png",
      },
    ],
    state: "paused",
    playIndex: 0,
    play: {
      currentTime: "00:00",
      duration: "00:00",
      percent: 0,
      title: "",
      singer: "",
      coverImgUrl: "/images/music.png",
    },
  },
  changeItem: function (e) {
    this.setData({
      item: e.target.dataset.item,
    });
  },
  changeTab: function (e) {
    this.setData({
      tab: e.detail.current,
    });
  },
  audioCtx: null,
  onReady: function () {
    this.audioCtx = wx.createInnerAudioContext();
    var that = this;
    this.audioCtx.onError(function () {
      console.log("播放失败：" + that.audioCtx.src);
    });
    // 播放完成自动换下一曲
    this.audioCtx.onEnded(function () {
      that.next();
    });
    //自动更新播放进度
    this.audioCtx.onPlay(function () {});
    this.audioCtx.onTimeUpdate(function () {
      that.setData({
        "play.duration": formatTime(that.audioCtx.duration),
        "play.currentTime": formatTime(that.audioCtx.currentTime),
        "play.percent":
          (that.audioCtx.currentTime / that.audioCtx.duration) * 100,
      });
    });
    //默认选择第1曲
    this.setMusic(0);
    // 格式化时间
    function formatTime(time) {
      var minute = Math.floor(time / 60) % 60;
      var second = Math.floor(time) % 60;
      return (
        (minute < 10 ? "0" + minute : minute) +
        ":" +
        (second < 10 ? "0" + second : second)
      );
    }
  },
  setMusic: function (index) {
    var music = this.data.playlist[index];
    this.audioCtx.src = music.src;
    this.setData({
      playIndex: index,
      "play.title": music.title,
      "play.singer": music.singer,
      "play.coverImgUrl": music.coverImgUrl,
      "play.currentTime": "00:00",
      "play.duration": "00:00",
      "play.percent": 0,
    });
  },
  play: function () {
    this.audioCtx.play();
    this.setData({ state: "running" });
  },
  pause: function () {
    this.audioCtx.pause();
    this.setData({ state: "paused" });
  },
  next: function () {
    var index =
      this.data.playIndex >= this.data.playlist.length - 1
        ? 0
        : this.data.playIndex + 1;
    this.setMusic(index);
    if (this.data.state === "running") {
      this.play();
    }
  },
  sliderChange: function (e) {
    var second = (e.detail.value * this.audioCtx.duration) / 100;
    this.audioCtx.seek(second);
  },
});
