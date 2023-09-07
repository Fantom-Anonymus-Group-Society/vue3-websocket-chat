import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Notifications from '@kyvg/vue3-notification'
import NProgress from 'nprogress'
import './assets/css/style.css'
import { createStore } from 'vuex'
import JwtService from './services/jwt_service'
import { auth } from "./modules/auth_module";
import qs from 'qs'
import '../node_modules/nprogress/nprogress.css' 


export const store = createStore({
    modules: {
      auth,
    }
  })


const app = createApp(App)

router.beforeEach(async (to, from, next) => {
    JwtService.checkTokenAndDeleteItIfItIsExpired()
    
    return next()
})

router.beforeResolve((to, from, next) => {
    if (to.name) {
        NProgress.start()
    }
    next()
})

router.afterEach((to, from) => {
    NProgress.done()
})

app.use(Notifications)
app.use(store)
app.use(router)
app.use(qs)

app.mount('#app')
