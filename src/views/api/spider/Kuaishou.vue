<template>
  <el-row>
    <el-col :span="18">
      <el-breadcrumb separator="/" style="margin-bottom: 5px">
        <el-breadcrumb-item>api</el-breadcrumb-item>
        <el-breadcrumb-item>spider</el-breadcrumb-item>
        <el-breadcrumb-item>kuaishou</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
  </el-row>
  <el-row style="margin-top: 10px">
    <el-col :span="22">
      <el-card shadow="always" :body-style="{ padding: 0 }">
        <template #header>
          <el-row>
            <h1 style="margin: 0px">测试快手爬虫API</h1>
          </el-row>
        </template>
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
          type="border-card"
        >
          <el-tab-pane label="搜索" name="search">
            <el-row>
              <el-col :span="12">
                <el-form label-width="auto">
                  <el-form-item label="关键词">
                    <el-input
                      placeholder="请输入问题搜索关键词"
                      v-model="kw"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="cookie">
                    <el-input
                      placeholder="请输入cookie"
                      v-model="cookie"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="pcursor">
                    <el-input
                      placeholder="请输入pcursor"
                      v-model="s_pcursor"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item style="margin-left: 30%">
                    <el-button
                      type="primary"
                      v-if="!s_submited"
                      @click="getKuaishouSearch()"
                      >提交</el-button
                    >
                    <el-button type="primary" v-else disabled>提交</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <pre id="jsonShow" v-html="s_html" v-if="s_html != ''"></pre>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="视频" name="video">
            <el-row>
              <el-col :span="12">
                <el-form label-width="auto">
                  <el-form-item label="user_id">
                    <el-input
                      placeholder="请输入用户id"
                      v-model="u_id"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="cookie">
                    <el-input
                      placeholder="请输入cookie"
                      v-model="cookie"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="pcursor">
                    <el-input
                      placeholder="请输入pcursor"
                      v-model="v_pcursor"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item style="margin-left: 30%">
                    <el-button
                      type="primary"
                      v-if="!v_submited"
                      @click="getKuaishouVideo()"
                      >提交</el-button
                    >
                    <el-button type="primary" v-else disabled>提交</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <pre id="jsonShow" v-html="v_html" v-if="v_html != ''"></pre>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="评论" name="comment">
            <el-row>
              <el-col :span="12">
                <el-form label-width="auto">
                  <el-form-item label="video_id">
                    <el-input
                      placeholder="请输入视频id"
                      v-model="v_id"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="cookie">
                    <el-input
                      placeholder="请输入cookie"
                      v-model="cookie"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="pcursor">
                    <el-input
                      placeholder="请输入pcursor"
                      v-model="c_pcursor"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item style="margin-left: 30%">
                    <el-button
                      type="primary"
                      v-if="!c_submited"
                      @click="getKuaishouComment()"
                      >提交</el-button
                    >
                    <el-button type="primary" v-else disabled>提交</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <pre id="jsonShow" v-html="c_html" v-if="c_html != ''"></pre>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { reactive, toRefs } from "vue";
import request from "@/network";
import { message, jsonShowFn } from "@/utils";

export default {
  name: "Kuaishou",
  setup() {
    const state = reactive({
      activeName: "search",
      kw: "",
      cookie: "",
      v_id: "",
      u_id: "",
      s_pcursor: "",
      v_pcursor: "",
      c_pcursor: "",
      s_submited: false,
      v_submited: false,
      c_submited: false,
      s_html: "",
      v_html: "",
      c_html: "",
    });

    function getKuaishouSearch() {
      if (state.cookie == "") {
        message.error("cookie不能为空");
        return;
      }
      if (state.kw == "") {
        message.error("关键词不能为空");
        return;
      }
      state.s_submited = true;
      let postData = new URLSearchParams();
      postData.append("kw", state.kw);
      postData.append("cookie", state.cookie);
      postData.append("pcursor", state.s_pcursor);
      request()
        .post("/api/spider/kuaishou/search/", postData, {
          headers: {
            "accept-token": localStorage.getItem("accept-token"),
          },
        })
        .then((response) => {
          state.s_submited = false;
          const data = response.data;
          const html = jsonShowFn(data.data);
          state.s_html = html;
        })
        .catch((error) => {
          state.s_submited = false;
          const html = "";
          state.s_html = html;
          message.error("网络出现问题，稍后重试");
        });
    }

    function getKuaishouVideo() {
      if (state.cookie == "") {
        message.error("cookie不能为空");
        return;
      }
      if (state.u_id == "") {
        message.error("user_id不能为空");
        return;
      }
      state.v_submited = true;
      let postData = new URLSearchParams();
      postData.append("user_id", state.u_id);
      postData.append("cookie", state.cookie);
      postData.append("pcursor", state.v_pcursor);
      request()
        .post("/api/spider/kuaishou/video/", postData, {
          headers: {
            "accept-token": localStorage.getItem("accept-token"),
          },
        })
        .then((response) => {
          state.v_submited = false;
          const data = response.data;
          const html = jsonShowFn(data.data);
          state.v_html = html;
        })
        .catch((error) => {
          state.v_submited = false;
          const html = "";
          state.v_html = html;
          message.error("网络出现问题，稍后重试");
        });
    }

    function getKuaishouComment() {
      if (state.cookie == "") {
        message.error("cookie不能为空");
        return;
      }
      if (state.v_id == "") {
        message.error("video_id不能为空");
        return;
      }
      state.c_submited = true;
      let postData = new URLSearchParams();
      postData.append("video_id", state.v_id);
      postData.append("cookie", state.cookie);
      postData.append("pcursor", state.c_pcursor);
      request()
        .post("/api/spider/kuaishou/comment/", postData, {
          headers: {
            "accept-token": localStorage.getItem("accept-token"),
          },
        })
        .then((response) => {
          state.c_submited = false;
          const data = response.data;
          const html = jsonShowFn(data.data);
          state.c_html = html;
        })
        .catch((error) => {
          state.c_submited = false;
          const html = "";
          state.c_html = html;
          message.error("网络出现问题，稍后重试");
        });
    }

    return {
      ...toRefs(state),
      getKuaishouSearch,
      getKuaishouVideo,
      getKuaishouComment,
    };
  },
};
</script>

<style scoped>
.el-button {
  margin-left: 5px;
}
.el-card__body {
  padding: 0;
}
</style>