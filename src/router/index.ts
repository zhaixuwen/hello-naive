import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginViewVue from '@/views/LoginView.vue'
import IndexViewVue from '@/views/IndexView.vue'
import TestSuiteViewVue from '@/views/TestSuiteView.vue'
import TestSuiteDetailViewVue from '@/views/TestSuiteDetailView.vue'
import JobViewVue from '@/views/JobView.vue'
import DomainViewVue from '@/views/DomainView.vue'
import ExecuteAccountViewVue from '@/views/ExecuteAccountView.vue'
import InterfaceViewVue from '@/views/InterfaceView.vue'
import TestcaseViewVue from '@/views/TestcaseView.vue'
import TestcaseDetailViewVue from '@/views/TestcaseDetailView.vue'
import TestSuiteReportVue from '@/views/TestSuiteReport.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: LoginViewVue
  },
  {
    path: '/index',
    name: 'index',
    component: IndexViewVue
  },
  {
    path: '/testsuites',
    name: 'testsuites',
    component: TestSuiteViewVue
  },
  {
    path: '/testsuites/detail',
    name: 'testsuites-detail',
    component: TestSuiteDetailViewVue
  },
  {
    path: '/jobs',
    name: 'jobs',
    component: JobViewVue
  },
  {
    path: '/domains',
    name: 'domains',
    component: DomainViewVue
  },
  {
    path: '/execute-accounts',
    name: 'execute-accounts',
    component: ExecuteAccountViewVue
  },
  {
    path: '/interfaces',
    name: 'interfaces',
    component: InterfaceViewVue
  },
  {
    path: '/testcases',
    name: 'testcases',
    component: TestcaseViewVue
  },
  {
    path: '/testcases/detail',
    name: 'testcases-detail',
    component: TestcaseDetailViewVue
  },
  {
    path: '/testsuites/report',
    name: 'testsuites-report',
    component: TestSuiteReportVue
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // 本地存储中没有token则跳转到登录页
  if (to.path == '/login' || localStorage.getItem('access_token')) {
    next();
  } else {
    router.push('/login');
  }
})

export default router
