<template>
  <el-menu
    :default-active="nowActive"
    :default-openeds="nowOpens"
    class="el-menu-vertical-demo"
  >
    <el-menu-item index="1" @click="router.push({ path: '/index' })">
      <i class="iconfont icon-item icon-item-aside">&#xe7c6;</i>
      <template #title
        ><span class="my-aside-menu-span"> 首页 </span>
      </template>
    </el-menu-item>
    <el-submenu index="2">
      <template #title>
        <i class="iconfont icon-item icon-item-aside">&#xe652;</i>
        <span class="my-aside-menu-span">API</span>
      </template>
      <el-submenu index="2-1">
        <template #title>
          <i class="iconfont icon-item icon-item-aside">&#xe93b;</i>
          <span class="my-aside-menu-span">NLP</span>
        </template>
        <el-menu-item
          index="2-1-1"
          class="my-aside-menu-item"
          @click="router.push({ path: '/api/nlp/sentiment' })"
        >
          sentiment
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2-2">
        <template #title>
          <i class="iconfont icon-item icon-item-aside">&#xe8ed;</i>
          <span class="my-aside-menu-span">SPIDER</span>
        </template>
        <el-menu-item
          index="2-2-1"
          class="my-aside-menu-item"
          @click="router.push({ path: '/api/spider/zhihu' })"
        >
          zhihu
        </el-menu-item>
        <el-menu-item
          index="2-2-2"
          class="my-aside-menu-item"
          @click="router.push({ path: '/api/spider/kuaishou' })"
        >
          kuaishou
        </el-menu-item>
      </el-submenu>
    </el-submenu>
  </el-menu>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { url2activeIndex } from "@/utils";
import router from "@/router";

export default defineComponent({
  name: "AsideMenu",
  setup() {
    function getActiveIndex() {
      let url = window.location.href;
      let host = document.domain;
      let url_list = url.replace("http://", "").split("/");
      url_list.shift();
      url = "/" + url_list.join("/");
      url = url.split("?")[0];
      let active_index = url2activeIndex[url];
      if (active_index == undefined) {
        return "";
      } else {
        return active_index;
      }
    }

    function getDefaultOpeneds() {
      let url = window.location.href;
      let host = document.domain;
      let url_list = url.replace("http://", "").split("/");
      url_list.shift();
      url = "/" + url_list.join("/");
      url = url.split("?")[0];
      let active_index = url2activeIndex[url];
      if (active_index == undefined) {
        return ["1"];
      } else {
        let open_index = [active_index.split("-")[0]];
        return open_index;
      }
    }

    const state = reactive({
      nowActive: getActiveIndex(),
      nowOpens: getDefaultOpeneds(),
    });

    return { ...toRefs(state), router };
  },
});
</script>

<style scoped>
a:link {
  color: #000000;
  text-decoration: none;
}
a:visited {
  color: #000000;
  text-decoration: none;
}

.el-menu-item.is-active {
  background-color: #ecf5ff;
}
</style>