import { createRouter, createWebHistory } from "vue-router";
import HomePage from '../views/HomePage.vue';
import ChatDetailPage from '../views/ChatDetailPage.vue';
import LoginPage from '../views/auth/LoginPage.vue';
import RegisterPage from '../views/auth/RegisterPage.vue';
import ProfilePage from '../views/auth/ProfilePage.vue';
import {store} from "../main";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            beforeEnter: (to, from, next) => {
                if (!store.state.auth.status.is_authenticated && (to.name != 'login_page' && to.name != 'register_page')){
                    return next({name: 'login_page'})
                }
                return next()
            },
            children: [
                {
                    path: '',
                    name: 'index',
                    component: HomePage,
                },
                {
                    path: 'chats',
                    children: [
                        {
                            path: '',
                            name: 'chats.index',
                            component: HomePage,
                        },
                        {
                            path: ':id',
                            name: 'chats.show',
                            component: ChatDetailPage,
                        }
                    ],
                },
                {
                    path: 'auth',
                    children: [
                        {
                            path: 'login',
                            name: 'login_page',
                            component: LoginPage,
                        },
                        {
                            path: 'register',
                            name: 'register_page',
                            component: RegisterPage,
                        },
                    ],
                },
                {
                    path: 'profile',
                    children: [
                        {
                            path: '',
                            name: 'profile',
                            component: ProfilePage,
                        },
                    ]
                },
            ]
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top
        return { top: 0 }
    },
})

export default router;
