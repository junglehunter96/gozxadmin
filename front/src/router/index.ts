import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { useAdminStore } from '@/store/modules/useAdminStore'; 

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login.vue"), // 这里假设您的登录 Vue 文件位于 src/views 目录
  },
];
// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes, //路由表
});


router.beforeEach((to, from, next) => {
  const adminStore = useAdminStore();
  const isAuthenticated = adminStore.token; // 假设你的 token 存放在这里

  if (to.name !== 'login' && !isAuthenticated) {
    // 如果用户未认证并且尝试访问非登录页面，重定向到登录页面
    next({ name: 'login' });
  } else {
    // 否则，正常导航
    next();
  }
});

export default router;
