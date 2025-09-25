import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { app } from './lib/app-vm/app';
import { toast } from 'vue-sonner';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: '首页' }
    },
    {
        path: '/contract',
        name: 'contract',
        component: () => import('@/views/Contract.vue'),
        meta: { title: '合同审查' }
    },
    {
        path: '/mine',
        name: 'mine',
        component: () => import('@/views/Mine.vue'),
        meta: { title: '我的' }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
        meta: { title: '登录' }
    },
    {
        path: '/intelligent-conversation/:indexId?',
        name: 'intelligentConversation',
        component: () => import('@/views/IntelligentConversation.vue'),
        meta: { requiresAuth: true, title: '智能对话' }
    },
    {
        path: '/contract-templates',
        name: 'contractTemplates',
        component: () => import('@/views/ContractTemplates.vue'),
        meta: { requiresAuth: true, title: '合同模板' }
    },
    {
        path: '/contract-template-download',
        name: 'contractTemplateDownload',
        component: () => import('@/views/ContractTemplateDownload.vue'),
        meta: { requiresAuth: true, title: '下载确认' }
    },
    {
        path: '/legal-document-creation',
        name: 'legalDocumentCreation',
        component: () => import('@/views/LegalDocumentCreation.vue'),
        meta: { requiresAuth: true, title: '文书撰写' }
    },
    {
        path: '/regulatory-search',
        name: 'regulatorySearch',
        component: () => import('@/views/RegulatorySearch.vue'),
        meta: { requiresAuth: true, title: '法规搜索' }
    },
    {
        path: '/case-law-search',
        name: 'caseLawSearch',
        component: () => import('@/views/CaseLawSearch.vue'),
        meta: { requiresAuth: true, title: '类案例法搜索' }
    },
    {
        path: '/voice-conversation',
        name: 'voiceConversation',
        component: () => import('@/views/VoiceConversation.vue'),
        meta: { requiresAuth: true, title: '语音对话' }
    },
    {
        path: '/user-agreement',
        name: 'userAgreement',
        component: () => import('@/views/UserAgreement.vue'),
        meta: { requiresAuth: false, title: '用户协议' }
    },
    {
        path: '/user-privacy-policy',
        name: 'userPrivacyPolicy',
        component: () => import('@/views/UserPrivacyPolicy.vue'),
        meta: { requiresAuth: false, title: '隐私政策' }
    },
    {
        path: '/contract-result',
        name: 'contractResult',
        component: () => import('@/views/ContractResult.vue'),
        meta: { requiresAuth: true, title: '合同审查结果' }
    },
    {
        path: '/user-profile',
        name: 'userProfile',
        component: () => import('@/views/UserProfile.vue'),
        meta: { requiresAuth: true, title: '个人资料' }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

/** @ts-ignore */
router.beforeEach(async (to, from, next) => {
    if (to.meta?.requiresAuth) {
        let user = app.user.data.user;
        if (!user) {
            // 尝试进行登录
            await app.user.loadUserMe().catch(e => {
                toast.error(`${e.message}`);
            });
            user = app.user.data.user;
            if (!user) {
                // 无登录凭证
                next({
                    path: '/login',
                    query: { redirect: to.fullPath }
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