import { ElMessage } from "element-plus";

// const api_url = 'http://127.0.0.1:8051'
const api_url = 'http://api.zndex.com/back'

const url2activeIndex = {
    "/index": "1",
    "/api/nlp/sentiment": "2-1-1",
    "/api/spider/zhihu": "2-2-1",
    "/api/spider/kuaishou": "2-2-2",
}

let GetQueryValue = function (queryName) {
    var query = decodeURI(window.location.search.substring(1));
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == queryName) {
            return pair[1];
        }
    }
    return '';
}

let getCookie = function (name) {
    console.log(document.cookie);
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;

}

const message = {
    success(message) {
        ElMessage({
            message: message,
            showClose: true,
            type: "success",
        })
    },
    error(message) {
        ElMessage({
            message: message,
            showClose: true,
            type: "error",
        });
    },
    warning(message) {
        ElMessage({
            message: message,
            showClose: true,
            type: "warning",
        });
    },
    info(message) {
        ElMessage({
            message: message,
            showClose: true,
        });
    }
}

const jsonShowFn = function (json) {
    // if (!json.match("^\{(.+:.+,*){1,}\}$")) {
    //     return json           //判断是否是json数据，不是直接返回
    // }

    if (typeof json != "string") {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
            var cls = "number";
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = "key";
                } else {
                    cls = "string";
                }
            } else if (/true|false/.test(match)) {
                cls = "boolean";
            } else if (/null/.test(match)) {
                cls = "null";
            }
            return '<span class="' + cls + '">' + match + "</span>";
        }
    );
}

export { GetQueryValue, getCookie, api_url, message, url2activeIndex, jsonShowFn }