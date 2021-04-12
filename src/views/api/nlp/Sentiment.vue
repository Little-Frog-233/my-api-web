<template>
  <el-row>
    <el-col :span="18">
      <el-breadcrumb separator="/" style="margin-bottom: 5px">
        <el-breadcrumb-item>api</el-breadcrumb-item>
        <el-breadcrumb-item>nlp</el-breadcrumb-item>
        <el-breadcrumb-item>sentiment</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
  </el-row>
  <el-row style="margin-top: 10px">
    <el-col :span="22">
      <el-card shadow="always">
        <template #header>
          <el-row>
            <h1 style="margin: 0px">测试情感分析API</h1>
          </el-row>
        </template>
        <el-row>
          <el-input
            placeholder="请输入测试文本"
            v-model="text"
            clearable
            style="width: 60%"
          >
          </el-input>
          <el-button type="primary" v-if="!submited" @click="getSentiment()"
            >提交</el-button
          >
          <el-button type="primary" v-else disabled>提交</el-button>
        </el-row>
        <el-row>
          <pre id="jsonShow" v-html="html" v-if="html != ''"></pre>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { reactive, toRefs } from "vue";
import request from "@/network";
import { message, jsonShowFn } from "@/utils";

export default {
  name: "Sentiment",
  setup() {
    function applyJsonShow(html) {
      state.html = html;
    }

    const state = reactive({
      text: "",
      nowText: "",
      submited: false,
      html: "",
    });

    function getSentiment() {
      if (state.text == "") {
        message.error("文本不能为空");
        return;
      }
      if (state.text.length > 150) {
        message.error("文本过长，请保持在150个字符以下");
        return;
      }
      if (state.nowText == state.text && state.html != "") {
        return;
      }
      state.submited = true;
      let postData = new URLSearchParams();
      postData.append("text", state.text);
      request()
        .post("/api/nlp/sentiment/", postData, {
          headers: {
            "accept-token": localStorage.getItem("accept-token"),
          },
        })
        .then((response) => {
          state.submited = false;
          state.nowText = state.text;
          const data = response.data;
          const html = jsonShowFn(data.data);
          applyJsonShow(html);
        })
        .catch((error) => {
          state.submited = false;
          state.html = "";
          message.error("网络出现问题，稍后重试");
        });
    }

    return { ...toRefs(state), getSentiment };
  },
};
</script>

<style scoped>
.el-button {
  margin-left: 5px;
}

pre {
  outline: 1px solid #ccc;
  width: 50%;
}

.string {
  color: green;
}

.number {
  color: darkorange;
}

.boolean {
  color: blue;
}

.null {
  color: magenta;
}

.key {
  color: red;
}
</style>