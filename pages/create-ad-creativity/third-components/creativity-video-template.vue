<!--
 * @Author: haungjianhan
 * @Date: 2021-05-26 15:23:55
 * @LastEditTime: 2021-06-16 11:13:32
 * @LastEditors: Please set LastEditors
 * @Description: 创意视频类型模板
 * @FilePath: \ads.fandow.com\pages\create-ad-creativity\third-components\creativity-video-template.vue
-->
<template>
  <div class="creativity-video" v-if="panes.length">
    <a-button
      type="primary"
      class="button-position_style"
      :disabled="panes.length >= 10 ? true : false"
      @click="addNav"
    >
      <a-icon type="plus" />
      <span class="margin-left-10">添加创意</span>
    </a-button>
    <a-tabs
      v-model="activeKey"
      hide-add
      type="editable-card"
      @edit="onEdit"
      @tabClick="setCurrentIndex"
    >
      <a-tab-pane
        v-for="(pane, index) in panes"
        :key="pane.key"
        :tab="pane.title"
        :closable="pane.closable"
        :forceRender="true"
      >
        <div class="pane-nav_content">
          <!-- 根据巨量那边的功能，这边需要分为两个部分，当前右边的部分不做，但是需要空出来，故div->div -->
          <div>
            <!-- 创意内容 -->
            <div class="component-element_adname" stlye="align-items: flex-start;">
              <span class="hint-item"></span>
              <div class="element-style">
                创意内容
                <span class="required-style"></span>
              </div>
              <div class="creative-video-card">
                <!-- 上传视频 -->
                <div class="video-card">
                  <div class="card-create">
                    <a-upload
                      style="width: 100%;word-break: break-all;"
                      list-type="picture-card"
                      :accept="rules.videoRules"
                      :file-list="fileList"
                      :before-upload="vedioBeforeUpload"
                    >
                      <Loading
                        v-if="panes[index].videoLoading"
                        :loading="panes[index].videoLoading"
                      />
                      <div v-if="!(panes[index].videoFile ? panes[index].videoFile.name : '')">
                        <a-icon type="cloud-upload" />
                        <span class="ant-upload-text">
                          上传视频
                          <br />
                          （必填）
                        </span>
                      </div>
                      <div class="video-file_style" v-else>
                        {{ panes[index].videoFile ? panes[index].videoFile.name : '' }}
                      </div>
                    </a-upload>
                    <a-button class="margin-top-10" block disabled>素材库</a-button>
                    <a-button class="margin-top-10" block disabled>制作视频</a-button>
                  </div>
                  <div class="card-tip margin-top-10">
                    宽高比9:16,视频码率≥516kbps,大小≤100M,分辨率≥720*1280,时长≥4s,时长≤300s
                  </div>
                </div>
                <!-- 上传封面 -->
                <div class="video-card">
                  <div class="card-create" v-if="!panes[index].previewImage">
                    <Loading v-if="panes[index].loading" :loading="panes[index].loading" />
                    <a-upload
                      style="width: 100%;"
                      list-type="picture-card"
                      :accept="rules.imageRules"
                      :file-list="ImageFileList"
                      :before-upload="videoUploadImage"
                    >
                      <div>
                        <a-icon type="cloud-upload" />
                        <span class="ant-upload-text">
                          上传封面
                          <br />
                          （必填）
                        </span>
                      </div>
                    </a-upload>
                    <a-button class="margin-top-10" block disabled>生成/选择封面</a-button>
                  </div>
                  <div v-else class="card-create video-card_image">
                    <img :src="panes[index].previewImage" alt="" @mouseover="showTools = true" />
                    <div v-if="showTools" class="tips-tools" @mouseout="hideToolsTips">
                      <a-upload
                        style="width: 61%;"
                        list-type="picture-card"
                        :accept="rules.imageRules"
                        :file-list="ImageFileList"
                        :before-upload="videoUploadImage"
                      >
                        更换
                      </a-upload>
                    </div>
                  </div>
                  <div class="card-tip margin-top-10">
                    建议最佳：宽高比9:16,720*1280≤尺寸≤1440*2560,支持JPG、PNG等图片格式
                  </div>
                </div>
              </div>
            </div>

            <!-- 创意标题 -->
            <div class="component-element_adname margin-top-20">
              <span class="hint-item"></span>
              <div class="element-style">
                创意标题
                <span class="required-style"></span>
              </div>
              <a-button disabled>选标题</a-button>
            </div>
            <!-- 创意标题 -->
            <div class="component-element_adname margin-top-20">
              <span class="hint-item"></span>
              <div class="element-style"></div>
              <a-form-model-item
                class="input-item"
                prop="title"
                :rules="[
                  {
                    required: true,
                    trigger: 'blur',
                    validator: checkTitle,
                  },
                ]"
              >
                <a-input allow-clear v-model.trim="vertical[index].title" style="width: 429px;" />
                <span class="margin-left-10">{{ vertical[index].title.length }}/30</span>
              </a-form-model-item>
            </div>

            <!-- 基础创意组件 -->
            <div class="component-element_adname margin-top-20">
              <span class="hint-item">
                <a-popover class="popover-style_reset" placement="topLeft">
                  <template slot="content">
                    <div class="popover-content">
                      <div class="popover-letter">
                        抖音场景下对视频素材生效的必备组件，强有效地曝光你的广告卖点信息
                      </div>
                    </div>
                  </template>
                  <a-button><a-icon type="question-circle" /></a-button>
                </a-popover>
              </span>
              <div class="element-style">
                <span>
                  基础创意组件
                </span>
                <span class="required-style"></span>
              </div>
              <div>
                <a-button disabled>素材库选择</a-button>
                <a-button @click="openPromotionDialog" disabled>手动新建</a-button>
              </div>
            </div>

            <!-- 附加创意组件 -->
            <!-- <div class="component-element_adname margin-top-20">
              <span class="hint-item">
                <a-popover class="popover-style_reset" placement="topLeft">
                  <template slot="content">
                    <div class="popover-content">
                      <div class="popover-letter">
                        广告在C端展示的附加内容，有更为创新的形态和表达样式，助力提升您的广告投放效果
                      </div>
                    </div>
                  </template>
                  <a-button><a-icon type="question-circle" /></a-button>
                </a-popover>
              </span>
              <div class="element-style">
                <span>
                  附加创意组件
                </span>
                <span class="required-style"></span>
              </div>
              <div>
                <a-button disabled>素材库选择</a-button>
              </div>
            </div> -->
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>

    <!-- 手动新建 - 新建推广卡片 -->
    <a-drawer
      title="新建推广卡片"
      placement="right"
      class="promotion-dialog"
      width="1096"
      :visible="promotionDialogStatu"
      @close="promotionDialogStatu = false"
    >
      <div class="promotion-container">
        <div class="promotion-sidebar"></div>
        <div class="promotion-content">
          <!-- 新建推广卡片 - 表单 -->
          <div class="promotion-form">
            <!-- 卡片主图 -->
            <div class="component-element_adname">
              <span class="hint-item">
                <a-popover class="popover-style_reset" placement="topLeft">
                  <template slot="content">
                    <div class="popover-content">
                      <div class="popover-letter">
                        您可上传产品图/logo/宣传图等，建议图片突出卖点。
                      </div>
                    </div>
                  </template>
                  <a-button><a-icon type="question-circle" /></a-button>
                </a-popover>
              </span>
              <div class="element-style" style="width: 80px;">
                卡片主图
                <span class="required-style"></span>
              </div>
              <a-upload
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader"
                :accept="rules.imageRules"
                :show-upload-list="false"
                :before-upload="promotionUpload"
              >
                <img
                  v-if="promotionObj.imageUrl"
                  :src="promotionObj.imageUrl"
                  style="width: 120px;height: auto;"
                  alt="avatar"
                />
                <div v-else>
                  <a-icon :type="promotionObj.loading ? 'loading' : 'cloud-upload'" />
                  <span class="ant-upload-text">
                    上传图片
                  </span>
                </div>
              </a-upload>
            </div>
            <!-- 卡片标题 -->
            <div class="component-element_adname margin-top-30">
              <span class="hint-item">
                <a-popover class="popover-style_reset" placement="topLeft">
                  <template slot="content">
                    <div class="popover-content">
                      <div class="popover-letter">
                        建议填写您推广产品的名称。如XX（您的品牌）牛奶、XX游戏；XX（抖音昵称）直播等。
                      </div>
                    </div>
                  </template>
                  <a-button><a-icon type="question-circle" /></a-button>
                </a-popover>
              </span>
              <div class="element-style" style="width: 80px;">
                <span>卡片标题</span>
                <span class="required-style"></span>
              </div>
              <a-input />
              <span class="margin-left-10">1/30</span>
            </div>
            <!-- 推广卖点 -->
            <div class="component-element_adname margin-top-30">
              <span class="hint-item">
                <a-popover class="popover-style_reset" placement="topLeft">
                  <template slot="content">
                    <div class="popover-content">
                      <div class="popover-letter">
                        在抖音信息流显示。建议填写：最能体现您推广产品特点的内容。如遮瑕防水；鲜香不腥等
                      </div>
                    </div>
                  </template>
                  <a-button><a-icon type="question-circle" /></a-button>
                </a-popover>
              </span>
              <div class="element-style" style="width: 80px;">
                <span>推广卖点</span>
                <span class="required-style"></span>
              </div>
              <a-input />
              <span class="margin-left-10">1/30</span>
            </div>
            <!-- 行动号召 -->
            <div class="component-element_adname margin-top-30">
              <span class="hint-item">
                <a-popover class="popover-style_reset" placement="topLeft">
                  <template slot="content">
                    <div class="popover-content">
                      <div class="popover-letter">
                        通过该文案内容吸引用户点击进入落地页或者打开附加创意组件，类似投放时的“查看详情”和“立即下载”
                      </div>
                    </div>
                  </template>
                  <a-button><a-icon type="question-circle" /></a-button>
                </a-popover>
              </span>
              <div class="element-style" style="width: 80px;">
                <span>行动号召</span>
                <span class="required-style"></span>
              </div>
              <!-- 下拉框 -->
              <a-select :default-value="promotionSelectData[0].value" style="width: 100%">
                <a-select-option v-for="item in promotionSelectData" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
              <span class="margin-left-10" style="opacity: 0;">1/30</span>
            </div>
            <!-- 组件名称 -->
            <div class="component-element_adname margin-top-30">
              <span class="hint-item"></span>
              <div class="element-style" style="width: 80px;">
                <span>组件名称</span>
                <span class="required-style"></span>
              </div>
              <a-input />
              <span class="margin-left-10">1/30</span>
            </div>
          </div>
          <!-- 新建推广卡片 - 效果预览 -->
          <div class="promotion-preview"></div>
          <!-- 新建推广卡片 - 底部栏 -->
          <div class="promotion-bottom">
            <div class="promotion-bottom_empty"></div>
            <div class="promotion-bottom_button">
              <a-button class="margin-right-10" @click="promotionDialogStatu = false">
                取消
              </a-button>
              <a-button type="primary">保存</a-button>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
  <div v-else class="empty-content">
    <div class="creative-none">
      <img
        src="https://sf1-scmcdn-tos.pstatp.com/goofy/oe/platform_web/static/image/none.png?a3cb5445c2ca37cfe3ca7caf16c66364"
        alt="如侵权，请联系官方进行更换"
      />
    </div>
    <div class="creative-none_operation margin-top-10">
      <span>请为竖版视频</span>
      <a-button type="primary" class="margin-left-10" @click="addNav('init')">
        <a-icon type="plus" />
        <span class="margin-left-10">添加创意</span>
      </a-button>
    </div>
  </div>
</template>

<script>
  import { debounce } from '~/utils/utils'
  export default {
    props: {
      imageMode: {
        type: String,
        default: '',
      },
    },
    watch: {
      vertical: {
        handler(newVal) {
          this.watchVerticalData(newVal)
        },
        deep: true,
        immediate: true,
      },
    },
    data() {
      this.watchVerticalData = debounce(this.watchVerticalData, 500)
      return {
        panes: [],
        activeKey: '',
        // 推广卡片状态显示值
        promotionDialogStatu: false,
        // 推广 - 行动号召下拉框数据
        promotionSelectData: [
          {
            label: '极速下载',
            value: '极速下载',
          },
          {
            label: '寻找服务',
            value: '寻找服务',
          },
          {
            label: '立即体验',
            value: '立即体验',
          },
          {
            label: '去体验',
            value: '去体验',
          },
          {
            label: '免费下载',
            value: '免费下载',
          },
          {
            label: '立即下载',
            value: '立即下载',
          },
          {
            label: '安全下载',
            value: '安全下载',
          },
          {
            label: '官方下载',
            value: '官方下载',
          },
          {
            label: '在线预订',
            value: '在线预订',
          },
          {
            label: '获取服务',
            value: '获取服务',
          },
        ],
        newTabIndex: 0,
        // 视频文件数组（提交文件时存入）
        fileList: [],
        // 上传视频文件对象
        fileObj: [],
        // 封面文件数组（提交文件时存入）
        ImageFileList: [],
        vertical: [],
        // 卡片当前选中索引值
        cardSelectedIndex: 0,
        // 显示上传图片预览框
        previewVisible: false,
        // 推广卡片 - 上传loading
        promotionLoading: [],
        // 显示隐藏工具栏
        showTools: false,
        // 规则校验
        rules: {
          imageRules: '.jpg,.png,.jpeg,.svg',
          videoRules: '.mp4,.wma,.avi,.rm,.rmvb,.flv,.mpg,.mov,.mkv',
        },
        promotionObj: {
          imageUrl: '',
          loading: false,
          imageId: null,
        },
        // 上传状态值
        loading: false,
      }
    },

    created() {},

    mounted() {},

    methods: {
      // 触发方法 切勿删除 这个方法是启动其他方法的基础（如：添加方法，不信可以试试）
      onEdit(targetKey, action) {
        this[action](targetKey)
      },

      // 添加创意选项
      addNav(statu = '') {
        if (this.vertical.length < 10) {
          ++this.newTabIndex
          const activeKey = `newTab${this.newTabIndex}`
          this.panes.push({
            title: `创意 ${this.newTabIndex}`,
            content: `Content of new Tab ${activeKey}`,
            key: this.newTabIndex,
            closable: true,
            previewImage: '',
            loading: false,
            videoLoading: false,
            // 音频文件
            videoFile: {},
          })
          // 新增创意内容元素
          this.vertical.push({
            imageMode: this.imageMode,
            title: '',
            imageId: '',
            videoId: '',
            derivePosterCid: 0,
            // promotionCard: [],
          })
          if (statu !== 'init') ++this.cardSelectedIndex
          this.activeKey = this.newTabIndex
        }
      },

      // 删除创意选项
      remove(targetKey) {
        // activeKey 是当前绑定的选中索引
        let activeKey = this.activeKey
        let lastIndex
        this.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1
          }
        })

        // 获取点击的tabs位置标签
        const panes = this.panes.filter((pane) => pane.key !== targetKey)
        if (panes.length && activeKey === targetKey) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].key
          } else {
            activeKey = panes[0].key
          }
        }

        this.vertical.splice(targetKey - 1, 1)
        panes.map((pane, i) => {
          pane.title = `创意 ${i + 1}`
          pane.key = i + 1
        })

        --this.newTabIndex
        this.panes = panes
        this.activeKey = activeKey - 1
      },

      // 显示对应创意项关闭按钮 当前鼠标事件不能使用
      closeExec(index, type) {
        if (tyre === 'open') this.panes[index].closable = true
        if (type === 'close') this.panes[index].closable = false
      },

      // 上传视频文件
      vedioBeforeUpload(file) {
        // /[a-zA-Z]\/[(mp4)|(wma)|(avi)|(rm)|(rmvb)|(flv)|(mpg)|(mov)|(mkv)]/
        if (!this.judgeFileType(file, /[a-zA-Z]\/[(mp4)|(avi)|(mpeg)]/)) return
        let form = new FormData()
        form.append('file', file)
        const advertiserId = this.$route.query.advertiserId
        this.panes[this.cardSelectedIndex].videoLoading = true
        this.$API
          .uploadVideo(form, advertiserId)
          .then(({ code, data }) => {
            if (code === 0) {
              this.panes[this.cardSelectedIndex].videoFile = file
              let videoId = data.videoId
              this.$set(this.vertical[this.cardSelectedIndex], 'videoId', videoId)
              // 该接口 巨量那边没有给出权限，暂不作处理
              // this.$API.getVideoCover(videoId, advertiserId).then(({ code, data }) => {
              //   if (!code) {
              //   }
              // })
            }
          })
          .finally(() => {
            this.panes[this.cardSelectedIndex].videoLoading = false
          })
      },

      // 数据监听
      watchVerticalData(value) {
        this.$emit('passVertical', value)
      },

      // 上传封面（图片）文件的第一步，获取接口返回的文件id
      videoUploadImage(file) {
        if (!this.judgeFileType(file, /[a-zA-Z]\/[(jpg)|(png)|(jpeg)|(svg)]/)) return
        // 图片不超过1.5M
        if (file.size > 1572864) {
          this.$message.error('图片文件过大，请重新上传')
          return
        }
        this.uploadImage(file, 'video')
      },

      // 卡片主图文件上传
      promotionUpload(file) {
        if (!this.judgeFileType(file, /[a-zA-Z]\/[(jpg)|(png)|(jpeg)|(svg)]/)) return
        // 1M = 1048576 bytes
        if (file.size > 1048576) {
          this.$message.error('文件大小大于1M，请重现选择图片！')
          return
        }
        this.uploadImage(file, 'promotion')
      },

      /**
       * 上传图片接口处理
       */
      uploadImage(...rest) {
        let file = rest[0]
        // 表单提交数据
        let form = new FormData()
        form.append('file', file)
        const advertiserId = this.$route.query.advertiserId
        this.panes[this.cardSelectedIndex].loading = true
        this.$API
          .uploadImage(form, advertiserId)
          .then(({ code, data }) => {
            if (code === 0) {
              if (rest[1] === 'video') {
                this.panes[this.cardSelectedIndex].previewImage = data.url
                this.ImageFileList = file.fileList
                this.$set(this.vertical[this.cardSelectedIndex], 'imageId', data.id)
              }
              if (rest[1] === 'promotion') {
                // this.promotionObj.imageUrl = data.url
                // this.promotionLoading[this.cardSelectedIndex] = true
                // this.$set(this.promotionObj, 'imageId', data.id)
              }
            }
          })
          .finally(() => {
            this.panes[this.cardSelectedIndex].loading = false
          })
      },

      // 文件类型判断
      judgeFileType(file, regex) {
        // 规则校验
        if (!regex.test(file.type)) {
          this.$message.error('文件类型错误，请重新上传')
          return false
        }
        return true
      },

      // 关闭预览窗口
      handleCancel() {
        this.previewVisible = false
      },

      // 校验创意标题
      checkTitle(rules, value, callback) {
        if (!this.vertical[this.cardSelectedIndex].title)
          callback('请输入创意标题，创意标题5-30个字')
        if (
          this.vertical[this.cardSelectedIndex].title.length < 5 ||
          this.vertical[this.cardSelectedIndex].title.length > 30
        )
          callback('创意标题5-30个字')
        else callback()
      },

      // 设置当前选中的卡片索引
      setCurrentIndex(...rest) {
        // 值比数组索引大1 故减一
        this.cardSelectedIndex = rest[0] - 1
      },

      // 隐藏工具栏
      hideToolsTips() {
        this.showTools = false
      },

      // 开启推广卡片弹框
      openPromotionDialog() {
        this.promotionDialogStatu = true
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../../create-ad-plan/css/component.css';
  .creativity-video {
    min-width: 950px;
    border-radius: 4px;
    border: 1px solid #dadfe3;
    min-height: 293px;
    position: relative;
    .button-position_style {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 10;
    }
    /deep/ .ant-tabs-nav-wrap {
      line-height: 0;
      border-bottom: 1px solid #dadfe3;
      padding: 12px 14px 0px 14px;
      overflow: hidden;
    }
    /deep/ .ant-tabs-bar {
      border-bottom: none;
    }
    /deep/ .ant-tabs-card-bar {
      .ant-tabs-nav-container {
        height: auto;
      }
      .ant-tabs-tab {
        font-size: 14px;
        float: left;
        position: relative;
        margin: 0;
        border-radius: 2px;
        cursor: pointer;
        border: none;
        background-color: transparent;
      }
      .ant-tabs-tab-active {
        border-bottom: 1px solid #2f88ff;
        color: #2f88ff;
        font-weight: bold;
      }
    }
    /deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
      padding: 0 12px;
    }
    .pane-nav_content {
      min-height: 100px;
      padding: 24px 24px 24px 12px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      border-radius: 4px;
      .creative-content {
        position: relative;
      }
      /deep/ .ant-upload.ant-upload-select-picture-card {
        width: 100%;
        margin: 0;
      }
      .creative-video-card {
        .video-card {
          width: 140px;
          position: relative;
          display: inline-block;
          vertical-align: top;
          color: #666;
          &:first-child {
            margin-right: 24px;
          }
        }
        .card-create {
          width: 140px;
          height: 250px;
          border: 1px solid #dadfe3;
          background-color: #fff;
          padding: 4px;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        .card-tip {
          width: 100%;
          height: 100%;
          margin-top: 10px;
        }
      }
    }
    .card-input {
      width: 429px;
    }
    .video-card_image {
      img {
        height: 100%;
        width: 100%;
        border-radius: 4px;
      }
    }
    .video-file_style {
      width: 100%;
    }
  }
  .tips-tools {
    top: 4px;
    right: 4px;
    bottom: 4px;
    left: 4px;
    border-radius: 4px;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    /deep/ .ant-upload.ant-upload-select-picture-card {
      height: 30px;
    }
  }
  .promotion-dialog {
    /deep/ .ant-drawer-close {
      position: absolute;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45px;
      height: 100%;
      font-size: 16px;
      cursor: pointer;
      background-color: #1890ff;
      color: #fff;
    }
    /deep/ .ant-drawer-header {
      padding: 16px 63px;
    }

    /deep/ .ant-drawer-body {
      padding: 0;
      height: calc(100% - 55px);
      overflow: hidden;
    }
    .promotion-container {
      display: flex;
      height: 103%;
      background-color: rgb(245, 246, 247);
    }
    .promotion-sidebar,
    .promotion-content,
    .promotion-form {
      display: inline-block;
    }
    .promotion-sidebar {
      width: 45px;
      height: 100%;
      background-color: rgb(255, 255, 255);
      border-right: 1px solid rgb(228, 233, 237);
      box-sizing: border-box;
      flex-basis: auto !important;
    }
    .promotion-content {
      padding: 12px;
      width: calc(100% - 55px);
    }
    .promotion-form {
      width: 70%;
      height: 86%;
      padding: 32px 61px 32px 32px;
      box-shadow: rgb(0 0 0 / 5%) 0px 1px 6px;
      border-radius: 4px;
      background-color: #fff;
      /deep/ .ant-upload.ant-upload-select-picture-card {
        height: auto;
        margin: 0;
      }
    }
    .promotion-bottom {
      width: 100%;
      height: 65px;
      margin-top: 24px;
      margin-bottom: 12px;
      padding: 0px 24px;
      font-size: 12px;
      border-radius: 4px;
      line-height: 20px;
    }
    .promotion-bottom {
      color: rgb(153, 153, 153);
      z-index: 10;
      box-shadow: rgb(0 0 0 / 5%) 0px 1px 6px;
      background-color: #fff;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &_empty {
        flex: 1 1 0%;
      }
      &_button {
        display: flex;
      }
    }
  }
  .empty-content {
    width: 950px;
    border-radius: 4px;
    border: 1px solid #dadfe3;
    min-height: 293px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .creative-none {
      width: 390px;
      height: 136px;
      margin: 0 auto;
      text-align: center;
      img {
        width: 240px;
        height: 136px;
      }
    }
    .creative-none_operation {
      font-size: 14px;
      height: 36px;
      line-height: 36px;
    }
  }
</style>
