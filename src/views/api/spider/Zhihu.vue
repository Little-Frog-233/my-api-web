<template>
  <el-row>
    <el-col :span="18">
      <el-breadcrumb separator="/" style="margin-bottom: 5px">
        <el-breadcrumb-item>api</el-breadcrumb-item>
        <el-breadcrumb-item>spider</el-breadcrumb-item>
        <el-breadcrumb-item>zhihu</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
  </el-row>
  <el-row style="margin-top: 10px">
    <el-col :span="22">
      <el-card shadow="always" :body-style="{ padding: 0 }">
        <template #header>
          <el-row>
            <h1 style="margin: 0px">测试知乎爬虫API</h1>
          </el-row>
        </template>
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
          type="border-card"
        >
          <el-tab-pane label="问题" name="question">
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
                  <el-form-item label="页码">
                    <el-input
                      placeholder="请输入页码"
                      v-model="page"
                      type="number"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item style="margin-left: 30%">
                    <el-button
                      type="primary"
                      v-if="!q_submited"
                      @click="getZhihuQuestion()"
                      >提交</el-button
                    >
                    <el-button type="primary" v-else disabled>提交</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <pre id="jsonShow" v-html="q_html" v-if="q_html != ''"></pre>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="回答" name="answer">
            <el-row>
              <el-col :span="12">
                <el-form label-width="auto">
                  <el-form-item label="q_id">
                    <el-input
                      placeholder="请输入问题id"
                      v-model="q_id"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="页码">
                    <el-input
                      placeholder="请输入页码"
                      v-model="page"
                      type="number"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item style="margin-left: 30%">
                    <el-button
                      type="primary"
                      v-if="!a_submited"
                      @click="getZhihuAnswer()"
                      >提交</el-button
                    >
                    <el-button type="primary" v-else disabled>提交</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <pre id="jsonShow" v-html="a_html" v-if="a_html != ''"></pre>
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
  name: "Zhihu",
  setup() {
    const state = reactive({
      activeName: "question",
      kw: "",
      page: 1,
      q_id: "",
      q_submited: false,
      a_submited: false,
      q_html: "",
      a_html: "",
    });

    function getZhihuQuestion() {
      if (state.kw == "") {
        message.error("关键词不能为空");
        return;
      }
      if (state.page < 1) {
        message.error("页码不能小于1");
        return;
      }
      state.q_submited = true;
      let postData = new URLSearchParams();
      postData.append("kw", state.kw);
      postData.append("page", state.page);
      request()
        .post("/api/spider/zhihu/question/", postData, {
          headers: {
            "accept-token": localStorage.getItem("accept-token"),
          },
        })
        .then((response) => {
          state.q_submited = false;
          const data = response.data;
          const html = jsonShowFn(data.data);
          state.q_html = html;
        })
        .catch((error) => {
          state.q_submited = false;
          const html = "";
          state.q_html = html;
          message.error("网络出现问题，稍后重试");
        });
    }

    function getZhihuAnswer() {
      if (state.q_id == "") {
        message.error("问题id不能为空");
        return;
      }
      if (state.page < 1) {
        message.error("页码不能小于1");
        return;
      }
      state.a_submited = true;
      let postData = new URLSearchParams();
      postData.append("q_id", state.q_id);
      postData.append("page", state.page);
      request()
        .post("/api/spider/zhihu/answer/", postData, {
          headers: {
            "accept-token": localStorage.getItem("accept-token"),
          },
        })
        .then((response) => {
          state.a_submited = false;
          const data = response.data;
          const html = jsonShowFn(data.data);
          state.a_html = html;
        })
        .catch((error) => {
          state.a_submited = false;
          const html = "";
          state.a_html = html;
          message.error("网络出现问题，稍后重试");
        });
    }

    return { ...toRefs(state), getZhihuQuestion, getZhihuAnswer };
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

pre {
  outline: 1px solid #ccc;
  overflow-x: scroll;
}

pre .string {
  color: green;
}

pre .number {
  color: darkorange;
}

pre .boolean {
  color: blue;
}

pre .null {
  color: magenta;
}

pre .key {
  color: red;
}
</style>