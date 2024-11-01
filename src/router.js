import {createRouter, createWebHistory} from 'vue-router';
import PublishPage from '@/views/PublishView.vue';
import ConfigPage from '@/views/Config.vue';

const routes = [
    {
        path: '/',
        redirect: '/config', // 默认跳转到配置页面
    },
    {
        path: '/publish',
        component: PublishPage,
    },
    {
        path: '/config',
        component: ConfigPage,
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
