import { createRouter, createWebHistory } from 'vue-router'
import { userVM } from './lib/app_vm/userVM';
import { toast } from 'vue-sonner';


const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/User.vue'),
        meta: { withSideBar: true, requiresAuth: true, },
    },
    {
        path: '/user',
        name: 'user',
        component: () => import('@/views/User.vue'),
        meta: { withSideBar: true, requiresAuth: true, },
    },
    {
        path: '/chatHistory',
        name: 'chatHistory',
        component: () => import('@/views/ChatHistory.vue'),
        meta: { withSideBar: true, requiresAuth: true, },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
        meta: { withSideBar: false },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

/** @ts-ignore */
router.beforeEach(async (to, from, next) => {
    if (to.meta?.requiresAuth) {
        let user = userVM.data.user;
        if (!user) {
            // 尝试进行登录
            await userVM.loadUserMe().catch(e => toast.error(`${e.message}}`));
            user = userVM.data.user;
            if (!user) {
                // 无登录凭证
                next({
                    name: 'login',
                });
                return;
            }
        }
    }

    if (to.meta?.title) {
        document.title = `${to.meta.title}`;
    }

    next();
})

export default router;