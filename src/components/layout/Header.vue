<template>
  <div>
    <el-container>
      <el-header>
        <div style="margin: 0 2%">
          <el-row>
            <el-col :span="16">
              <p class="my-logo">
                <a
                  href="javascript:void(0);"
                  style="text-decoration: none; color: #2c3e50"
                  >my-api</a
                >
              </p>
            </el-col>
            <el-col :span="8">
              <el-menu class="el-menu-demo" mode="horizontal">
                <el-menu-item index="3">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="点击更换头像"
                    placement="bottom"
                  >
                    <router-link to="/user/picture">
                      <img
                        :src="apiUrl + '/show/logouser/' + user.picture"
                        alt=""
                        class="my-user-logo"
                      />
                    </router-link>
                  </el-tooltip>
                </el-menu-item>
                <el-submenu index="4">
                  <template #title>
                    <span class="my-user-nickname">{{ user.username }}</span>
                  </template>
                  <el-menu-item index="4-2" @click="logout()">
                    <i class="iconfont icon-item">&#xe669;</i>
                    退出
                  </el-menu-item>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </div>
      </el-header>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import request from "@/network";
import router from "@/router";
import { api_url, message } from "@/utils";

export default defineComponent({
  name: "Header",
  setup(props, ctx) {
    const apiUrl = ref(api_url);

    // user handler
    let user = reactive({
      username: "unknown",
      picture: "user_undefined.png",
      admin: 0,
    });

    function getUserMessage() {
      request()
        .get("/api/user/", {
          headers: {
            "accept-token": localStorage.getItem("accept-token"),
          },
        })
        .then((response) => {
          const data = response.data;
          const usermessage = data.data.user_message;
          user.username = usermessage.username;
          user.picture = usermessage.picture;
          user.admin = usermessage.admin;
        })
        .catch((error) => {
          if (error.response.data) {
            if (error.response.data) {
              message.error(error.response.data.message);
            } else {
              message.error("网络请求失败");
            }
          } else {
            message.error("网络请求失败");
          }
        });
    }

    function logout() {
      request()
        .delete("/api/user/", {
          headers: {
            "accept-token": localStorage.getItem("accept-token"),
          },
        })
        .then((response) => {
          message.success("退出登录成功");
        })
        .catch((error) => {
          message.error("网络请求失败");
        });
      localStorage.removeItem("accept-token");
      sessionStorage.setItem("isLogined", "0");
      setTimeout(() => {
        router.push({ path: "/login" });
      }, 1000);
    }

    onMounted(() => {
      getUserMessage();
    });

    return { apiUrl, user, logout };
  },
});
</script>

<style scoped>
/* .el-page-header__left {
  margin-left: 10px;
} */
.el-menu-item.is-active {
  background-color: white;
}

.el-menu-item {
  padding: 0 5px;
}

/* .el-menu--popup {
  min-width: 120px;
} */

/* .el-menu-item {
  width: 120px;
} */

.el-menu-demo {
  float: right;
}

.el-header {
  /* background-color: #2b0056; */
  background-color: white;
  text-align: center;
  line-height: 60px;
  border-bottom: 1px solid rgb(241, 241, 241);
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  z-index: 1000;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  display: inline-block;
}

.el-menu {
  /* background-color: #2b0056; */
  line-height: 60px;
  height: 59px;
}

.el-menu-item.is-active {
  border-bottom: 0px solid #409eff;
  /* color: #20fdc3; */
}

.el-menu.el-menu--horizontal {
  border-bottom: solid 0px #e6e6e6;
}

.alarm {
  position: relative;
}

.divright {
  position: absolute;
  color: white;
  font-size: 12px;
  font-weight: bold;
  background-color: red;
  width: 15px;
  height: 15px;
  line-height: 15px;
  left: 60%;
  top: 10px;
  text-align: center;
  -webkit-border-radius: 14px;
  border-radius: 14px;
}
</style>