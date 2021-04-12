<template>
  <div class="lowin">
    <div class="lowin-brand">
      <img :src="apiUrl + '/show/logo/311566293312_pic.png'" alt="logo" />
    </div>
    <div class="lowin-wrapper" style="min-height: 460px">
      <div class="lowin-box lowin-login">
        <div class="lowin-box-inner">
          <form id="login">
            <p>请注册</p>
            <div class="lowin-group">
              <label>用户名</label>
              <input
                type="text"
                name="username"
                class="lowin-input"
                autocomplete="off"
                v-model="username"
              />
            </div>
            <div class="lowin-group password-group">
              <label>密码</label>
              <input
                type="password"
                name="password"
                class="lowin-input"
                v-model="password"
              />
            </div>
            <div class="lowin-group password-group">
              <label>重复密码</label>
              <input
                type="password"
                name="password"
                class="lowin-input"
                v-model="repassword"
              />
            </div>
            <div class="lowin-group password-group">
              <label>验证码</label>
              <div style="width: 100%">
                <div style="float: left; display: inline-block">
                  <input
                    type="text"
                    name="captcha"
                    class="lowin-input"
                    style="width: 180px"
                    autocomplete="off"
                    v-model="captcha"
                  />
                </div>
                <img
                  style="height: 100%"
                  id="captcha_img"
                  title="点击更换验证码"
                  class="captcha-img"
                  :src="captcha_url"
                  @click="getCaptcha()"
                />
              </div>
            </div>

            <button
              class="lowin-btn login-btn"
              @click.prevent="loginPost()"
              v-if="!isSubmited"
            >
              注册
            </button>
            <button
              class="lowin-btn login-btn lowin-btn-disable"
              v-else
              disabled
            >
              注册
            </button>
            <div class="text-foot">
              已有账户?
              <router-link :to="'/login?path=' + toPath">登陆</router-link>
            </div>
          </form>
          <div class="text-foot"></div>
          <div>
            <footer class="lowin-footer">Design By 1342468180@qq.com</footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api_url } from "@/utils";
import request from "@/network";
import { ElMessage } from "element-plus";

export default {
  name: "Register",
  data() {
    return {
      apiUrl: api_url,
      isSubmited: false,
      username: "",
      password: "",
      repassword: "",
      captcha: "",
      captcha_token: "",
      captcha_url: "",
      //   toPath: this.$route.query.path,
    };
  },
  computed: {
    toPath() {
      let p = this.$route.query.path;
      if (p != undefined && p != null && p != undefined) {
        return p;
      } else {
        return "/";
      }
    },
  },
  methods: {
    loginPost() {
      let postData = new URLSearchParams();
      postData.append("captcha", this.captcha);
      postData.append("captcha_token", this.captcha_token);
      request()
        .post("/api/captcha/", postData)
        .then((response) => {
          if (this.password != this.repassword) {
            ElMessage({
              message: "两次密码不一致",
              showClose: true,
              type: "error",
            });
            return;
          }
          this.isSubmited = true;
          let loginData = new URLSearchParams();
          loginData.append("username", this.username);
          loginData.append("password", this.password);
          request()
            .post("/api/user/register/", loginData)
            .then((response) => {
              let data = response.data;
              ElMessage({
                message: "注册成功，即将跳转到登陆页面",
                showClose: true,
                type: "success",
              });
              setTimeout(() => {
                if (
                  this.toPath !== undefined &&
                  this.toPath !== "" &&
                  this.toPath !== null
                ) {
                  this.$router.push({
                    path: "/login",
                    query: { path: this.toPath },
                  });
                } else {
                  this.$router.push({ path: "/login" });
                }
              }, 1000);
            })
            .catch((error) => {
              this.isSubmited = false;
              if (error.response.data) {
                ElMessage({
                  message: error.response.data.message,
                  showClose: true,
                  type: "error",
                });
              } else {
                alert("请求失败");
              }
            });
        })
        .catch((error) => {
          this.isSubmited = false;
          if (error.response.data) {
            ElMessage({
              message: error.response.data.message,
              showClose: true,
              type: "error",
            });
          } else {
            alert("请求失败");
          }
        });
    },
    getCaptcha() {
      request()
        .get("/api/captcha/")
        .then((response) => {
          let data = response.data;
          this.captcha_token = data.data.captcha_token;
          this.captcha_url = data.data.url;
        })
        .catch((error) => {
          alert("发生错误，稍后重试");
        });
    },
  },
  created() {
    this.getCaptcha();
  },
};
</script>

<style scoped>
body {
  margin: 0;
  background-color: #fbfbfb;
  text-align: center;
}

.lowin {
  --color-primary: #44a0b3;
  --color-grey: rgba(68, 160, 179, 0.06);
  --color-dark: rgba(68, 160, 179, 0.5);
  --color-semidark: rgba(68, 160, 179, 0.5);

  text-align: center;
  margin: 60px 0 0 0;
  font-family: "Verdana";
  font-size: 14px;
}

.lowin .lowin-wrapper {
  -webkit-transition: all 1s;
  -o-transition: all 1s;
  transition: all 1s;
  -webkit-perspective: 1000px;
  perspective: 1000px;
  position: relative;
  height: 100%;
  width: 360px;
  margin: 0 auto;
}

.lowin.lowin-red {
  --color-primary: #ff6464;
  --color-grey: rgba(255, 100, 100, 0.06);
  --color-dark: rgba(255, 100, 100, 0.8);
  --color-semidark: rgba(255, 100, 100, 0.55);
}

.lowin.lowin-green {
  --color-primary: #d0ef84;
  --color-grey: rgba(208, 239, 132, 0.15);
  --color-dark: rgba(208, 239, 132, 1);
  --color-semidark: rgba(208, 239, 132, 0.6);
}

.lowin.lowin-purple {
  --color-primary: #6c567b;
  --color-grey: rgba(108, 86, 123, 0.08);
  --color-dark: rgba(108, 86, 123, 0.7);
  --color-semidark: rgba(108, 86, 123, 0.45);
}

.lowin.lowin-blue {
  --color-primary: #0081c6;
  --color-grey: rgba(0, 129, 198, 0.05);
  --color-dark: rgba(0, 129, 198, 0.7);
  --color-semidark: rgba(0, 129, 198, 0.45);
}

.lowin a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px dashed var(--color-semidark);
  margin-top: -3px;
  padding-bottom: 2px;
}

.lowin * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.lowin .lowin-brand {
  overflow: hidden;
  width: 150px;
  height: 150px;
  margin: 0 auto -50px auto;
  border-radius: 50%;
  -webkit-box-shadow: 0 4px 40px rgba(0, 0, 0, 0.07);
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.07);
  padding: 20px;
  background-color: #fff;
  z-index: 1;
  position: relative;
}

.lowin .lowin-brand img {
  width: 100%;
  height: 100%;
}

.lowin .lowin-box {
  width: 100%;
  position: absolute;
  left: 0;
}

.lowin .lowin-box-inner {
  background-color: #fff;
  -webkit-box-shadow: 0 7px 25px rgba(0, 0, 0, 0.08);
  box-shadow: 0 7px 25px rgba(0, 0, 0, 0.08);
  padding: 60px 25px 25px 25px;
  text-align: left;
  border-radius: 3px;
}

.lowin .lowin-box.lowin-flip {
  -webkit-transform: rotate3d(0, 1, 0, -180deg);
  transform: rotate3d(0, 1, 0, -180deg);
  display: none;
  opacity: 0;
}

.lowin .lowin-box p {
  color: var(--color-semidark);
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
}

.lowin .lowin-box .lowin-group {
  margin-bottom: 30px;
}

.lowin .lowin-box label {
  margin-bottom: 5px;
  display: inline-block;
  width: 100%;
  color: var(--color-semidark);
  font-weight: 700;
}

.lowin .lowin-box label a {
  float: right;
}

.lowin .lowin-box .lowin-input {
  background-color: var(--color-grey);
  color: var(--color-dark);
  border: none;
  border-radius: 3px;
  padding: 15px 20px;
  width: 100%;
  outline: 0;
  -webkit-box-shadow: 0 2px 7px var(--color-semidark);
  box-shadow: 0 2px 7px var(--color-grey);
}

.lowin .lowin-box .lowin-btn {
  display: inline-block;
  width: 100%;
  border: none;
  color: #fff;
  padding: 15px;
  border-radius: 3px;
  background-color: rgb(132, 0, 220);
  -webkit-box-shadow: 0 2px 7px var(--color-grey);
  box-shadow: 0 2px 7px var(--color-grey);
  font-weight: 700;
  outline: 0;
  cursor: pointer;
  -webkit-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}

.lowin .lowin-box .lowin-btn-disable {
  background-color: rgb(132, 0, 220, 0.5);
}

.lowin-btn-disable[disabled]:hover {
  cursor: not-allowed;
}

.lowin .lowin-box .lowin-btn:active {
  -webkit-box-shadow: none;
  box-shadow: none;
}

.lowin .text-foot {
  text-align: center;
  padding: 10px;
  font-weight: 700;
  color: var(--color-semidark);
}

.lowin .lowin-footer {
  text-align: center;
  font-size: 12px;
  color: var(--color-semidark);
  font-weight: 700;
}

.lowin .login-back-link {
  -webkit-transition: all 1s;
  -o-transition: all 1s;
  transition: all 1s;
  display: none;
  opacity: 0;
}

.lowin .lowin-box.lowin-animated {
  -webkit-animation-name: LowinAnimated;
  animation-name: LowinAnimated;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
}

.lowin .lowin-box.lowin-animatedback {
  -webkit-animation-name: LowinAnimatedBack;
  animation-name: LowinAnimatedBack;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
}

.lowin .lowin-box.lowin-animated-flip {
  -webkit-animation-name: LowinAnimatedFlip;
  animation-name: LowinAnimatedFlip;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
}

.lowin .lowin-box.lowin-animated-flipback {
  -webkit-animation-name: LowinAnimatedFlipBack;
  animation-name: LowinAnimatedFlipBack;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
}

.lowin .lowin-brand.lowin-animated {
  -webkit-animation-name: LowinBrandAnimated;
  animation-name: LowinBrandAnimated;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
}

.lowin .lowin-group.password-group {
  -webkit-transition: all 1s;
  -o-transition: all 1s;
  transition: all 1s;
}

.lowin .lowin-group.password-group.lowin-animated {
  -webkit-animation-name: LowinPasswordAnimated;
  animation-name: LowinPasswordAnimated;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  -webkit-transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  transform-origin: 0 0;
}

.lowin .lowin-group.password-group.lowin-animated-back {
  -webkit-animation-name: LowinPasswordAnimatedBack;
  animation-name: LowinPasswordAnimatedBack;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  -webkit-transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  transform-origin: 0 0;
}

/* @-webkit-keyframes LowinAnimated {
  0% {
    -webkit-transform: rotate3d(0);
    transform: rotate3d(0);
  }
  99% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -webkit-transform: rotate3d(0, 1, 0, 180deg);
    transform: rotate3d(0, 1, 0, 180deg);
  }
}
@keyframes LowinAnimated {
  0% {
    -webkit-transform: rotate3d(0);
    transform: rotate3d(0);
  }
  99% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -webkit-transform: rotate3d(0, 1, 0, 180deg);
    transform: rotate3d(0, 1, 0, 180deg);
  }
}

@-webkit-keyframes LowinAnimatedBack {
  0% {
    opacity: 0;
    -webkit-transform: rotate3d(0, 1, 0, 180deg);
    transform: rotate3d(0, 1, 0, 180deg);
  }
  99% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    -webkit-transform: rotate3d(0);
    transform: rotate3d(0);
  }
}

@keyframes LowinAnimatedBack {
  0% {
    opacity: 0;
    -webkit-transform: rotate3d(0, 1, 0, 180deg);
    transform: rotate3d(0, 1, 0, 180deg);
  }
  99% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    -webkit-transform: rotate3d(0);
    transform: rotate3d(0);
  }
}

@-webkit-keyframes LowinAnimatedFlip {
  0% {
    -webkit-transform: rotate3d(0, 1, 0, -180deg);
    transform: rotate3d(0, 1, 0, -180deg);
    opacity: 0;
  }
  99% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    -webkit-transform: rotate3d(0, 0, 0, 180deg);
    transform: rotate3d(0, 0, 0, 180deg);
  }
}

@keyframes LowinAnimatedFlip {
  0% {
    -webkit-transform: rotate3d(0, 1, 0, -180deg);
    transform: rotate3d(0, 1, 0, -180deg);
    opacity: 0;
  }
  99% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    -webkit-transform: rotate3d(0, 0, 0, 180deg);
    transform: rotate3d(0, 0, 0, 180deg);
  }
}

@-webkit-keyframes LowinAnimatedFlipBack {
  0% {
    opacity: 1;
    -webkit-transform: rotate3d(0, 0, 0, 180deg);
    transform: rotate3d(0, 0, 0, 180deg);
  }
  95% {
    opacity: 0;
  }
  100% {
    -webkit-transform: rotate3d(0, 1, 0, -180deg);
    transform: rotate3d(0, 1, 0, -180deg);
    opacity: 0;
  }
}

@keyframes LowinAnimatedFlipBack {
  0% {
    opacity: 1;
    -webkit-transform: rotate3d(0, 0, 0, 180deg);
    transform: rotate3d(0, 0, 0, 180deg);
  }
  95% {
    opacity: 0;
  }
  100% {
    -webkit-transform: rotate3d(0, 1, 0, -180deg);
    transform: rotate3d(0, 1, 0, -180deg);
    opacity: 0;
  }
}

@-webkit-keyframes LowinBrandAnimated {
  0% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  50% {
    -webkit-transform: translate(0, -120px);
    transform: translate(0, -120px);
  }
  100% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
}

@keyframes LowinBrandAnimated {
  0% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  50% {
    -webkit-transform: translate(0, -120px);
    transform: translate(0, -120px);
  }
  100% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
}

@-webkit-keyframes LowinPasswordAnimated {
  0% {
    -webkit-transform: rotate3d(0, 0, 0, 0);
    transform: rotate3d(0, 0, 0, 0);
  }
  30% {
    opacity: 1;
  }
  60% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    -webkit-transform: rotate3d(1, 0, 0, -180deg);
    transform: rotate3d(1, 0, 0, -180deg);
    z-index: -1;
  }
}

@keyframes LowinPasswordAnimated {
  0% {
    -webkit-transform: rotate3d(0, 0, 0, 0);
    transform: rotate3d(0, 0, 0, 0);
  }
  30% {
    opacity: 1;
  }
  60% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    -webkit-transform: rotate3d(1, 0, 0, -180deg);
    transform: rotate3d(1, 0, 0, -180deg);
    z-index: -1;
  }
}

@-webkit-keyframes LowinPasswordAnimatedBack {
  0% {
    opacity: 0;
    -webkit-transform: rotate3d(1, 0, 0, -180deg);
    transform: rotate3d(1, 0, 0, -180deg);
  }
  40% {
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate3d(0, 0, 0, 0);
    transform: rotate3d(0, 0, 0, 0);
  }
}

@keyframes LowinPasswordAnimatedBack {
  0% {
    opacity: 0;
    -webkit-transform: rotate3d(1, 0, 0, -180deg);
    transform: rotate3d(1, 0, 0, -180deg);
  }
  40% {
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate3d(0, 0, 0, 0);
    transform: rotate3d(0, 0, 0, 0);
  }
} */

@media screen and (max-width: 320px) {
  .lowin .lowin-wrapper {
    width: 100%;
  }
  .lowin .lowin-box {
    padding: 0 10px;
  }
}
</style>