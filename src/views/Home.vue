<template>
  <div class="my-head">
    <my-header></my-header>
  </div>
  <div class="my-body">
    <el-container>
      <div class="my-aside">
        <el-container>
          <el-aside style="width: 100%">
            <aside-menu></aside-menu>
          </el-aside>
        </el-container>
      </div>
      <div class="my-main">
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer>Designed by 1342468180@qq.com</el-footer>
        </el-container>
      </div>
    </el-container>
  </div>
</template>

<script>
import MyHeader from "@/components/layout/Header";
import AsideMenu from "@/components/layout/AsideMenu";

export default {
  name: "Home",
  components: {
    MyHeader,
    AsideMenu,
  },
};
</script>
<style scoped>
</style>
