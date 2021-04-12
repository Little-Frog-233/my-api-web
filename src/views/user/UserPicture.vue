<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-breadcrumb separator="/" style="margin-bottom: 5px">
          <el-breadcrumb-item>用户</el-breadcrumb-item>
          <el-breadcrumb-item>头像/</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="22" :offset="1">
        <el-card shadow="always">
          <template #header>
            <el-row>
              <h1 style="margin: 0px">更换头像</h1>
            </el-row>
          </template>
          <el-row>
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :disabled="true"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-row>
          <el-row>
            <!-- <el-col></el-col> -->
            <el-upload
              class="upload-button"
              ref="upload"
              :action="apiUrl + '/upload/user/logo/'"
              :headers="headers"
              name="file"
              :multiple="false"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-change="handleChange"
              :on-success="handleAvatarSuccess"
              :auto-upload="false"
            >
              <template #trigger>
                <el-button size="small" type="primary">选取文件</el-button>
              </template>
              <el-button
                style="margin-left: 10px"
                size="small"
                type="success"
                @click="submitUpload"
                >上传到服务器</el-button
              >
            </el-upload>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script scoped>
import request from "@/network";
import { api_url, message } from "@/utils";

export default {
  name: "UserPicture",
  data() {
    return {
      headers: {
        "accept-token": localStorage.getItem("accept-token"),
      },
      apiUrl: api_url,
      imageUrl: "",
      picture: "",
      imgChanged: false,
    };
  },
  methods: {
    getUserMessage() {
      request()
        .get("/api/user/", {
          headers: {
            "accept-token": localStorage.getItem("accept-token"),
          },
        })
        .then((response) => {
          const data = response.data;
          this.picture = data.data.user_message.picture;
          this.imageUrl = this.apiUrl + "/show/logouser/" + this.picture;
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
    },
    handleChange(file, fileList) {
      this.imgChanged = true;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleAvatarSuccess(res, file) {
      message.success("更换头像成功");
      setTimeout(() => {
        this.$router.go(0);
      }, 1000);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    submitUpload() {
      if (!this.imgChanged) {
        message.error("还未选择新头像");
        return;
      }
      this.$refs.upload.submit();
    },
  },
  created() {
    this.getUserMessage();
  },
};
</script>

<style>
.upload-button {
  display: inline-block;
  margin-left: 40%;
}
.avatar-uploader {
  text-align: center;
  width: 100%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  text-align: center;
}
</style>