import { reactive } from "vue";
import type { User } from "../types/User";
import { NormalUserAPI } from "../api";

const CacheKey = {
    UserMe: 'user-me',
    AuthToken: 'token',
}

export class UserVM {

    public data = reactive<{
        user: User | null
    }>({
        user: null
    })

    constructor() {

    }

    async loadUserMe({ withCache }: { withCache?: boolean } = {}) {
        if (!localStorage.getItem(CacheKey.AuthToken)) {
            this.data.user = null;
            return;
        }

        if (withCache === false) {
            // 跳过缓存直接请求
        } else {
            // 加载缓存
            try {
                const userCache = JSON.parse(localStorage.getItem(CacheKey.UserMe) ?? '{}')
                if (userCache.id && userCache.username && userCache.phone) {
                    this.data.user = userCache;
                }
            } catch (error) { localStorage.removeItem(CacheKey.UserMe); }
        }

        // 请求
        return NormalUserAPI.me().then((data) => {
            if (data) {
                this.data.user = data;
                localStorage.setItem(CacheKey.UserMe, JSON.stringify(data));
                return;
            }
            throw new Error('未知错误');
        }).catch(e => {
            this.data.user = null;
            throw e;
        })
    }

    async logout() {
        this.data.user = null;
        localStorage.removeItem(CacheKey.UserMe);
        localStorage.removeItem(CacheKey.AuthToken);
    }

}

const userVM = new UserVM();
export {
    userVM,
}