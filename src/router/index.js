import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import request from '@/network'

const Login = () => import('@/views/user/Login')
const Register = () => import('@/views/user/Register')
const UserPicture = () => import('@/views/user/UserPicture')

const Sentiment = () => import('@/views/api/nlp/Sentiment')
const Zhihu = () => import('@/views/api/spider/Zhihu')
const Kuaishou = () => import('@/views/api/spider/Kuaishou')

const Index = () => import('@/views/Index')

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        redirect: '/index',
        children: [
            {
                path: '/index',
                name: 'Index',
                component: Index,
                meta: {
                    title: '首页'
                }
            },
            {
                path: '/user/picture',
                name: 'UserPicture',
                component: UserPicture,
                meta: {
                    title: '用户头像'
                }
            },
            {
                path: '/api/nlp/sentiment',
                name: 'Sentiment',
                component: Sentiment,
                meta: {
                    title: '情感分析'
                }
            },
            {
                path: '/api/spider/zhihu',
                name: 'Zhihu',
                component: Zhihu,
                meta: {
                    title: '知乎'
                }
            },
            {
                path: '/api/spider/kuaishou',
                name: 'Kuaishou',
                component: Kuaishou,
                meta: {
                    title: '快手'
                }
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: '登陆'
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            title: '注册'
        }
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    let title = to.meta.title;
    if (title != undefined) {
        document.title = to.meta.title;
    } else {
        document.title = 'zndex-chart'
    }
    if (to.path != '/login' && to.path != '/register') {
        // 首先检查临时登录状态
        if (sessionStorage.getItem('isLogined') == '1') {
            next()
        } else {
            //再检查是否有token
            if (localStorage.getItem('accept-token') == null) {
                let p = "/"
                if (to.path != undefined && to.path != null && to.path != "") {
                    p = to.path
                }
                next({ path: '/login', query: { path: p } }) //没有token跳转到登录页面
            } else {
                // 最后检查token合法性
                request().get('/api/user/', {
                    headers: {
                        'accept-token': localStorage.getItem('accept-token')
                    }
                }).then(response => {
                    // token合法，设置临时登录状态为1
                    sessionStorage.setItem('isLogined', '1')
                    next()
                }).catch(err => {
                    alert('登录状态失效')
                    sessionStorage.setItem('isLogined', '0')
                    let p = "/"
                    if (to.path != undefined && to.path != null && to.path != "") {
                        p = to.path
                    }
                    next({ path: '/login', query: { path: p } })
                })
            }
        }
    } else {
        // if (checkUser()) {
        //     next({ path: '/index' })
        // } else {
        //     next()
        // }
        request().get('/api/user/', {
            headers: {
                'accept-token': localStorage.getItem('accept-token')
            }
        }).then(response => {
            sessionStorage.setItem('isLogined', '1')
            next({ path: '/' })
        }).catch(err => {
            localStorage.removeItem('accept-token');
            sessionStorage.setItem('isLogined', '0')
            next()
        })
    }
})

export default router
