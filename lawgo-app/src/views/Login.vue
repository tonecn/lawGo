<script setup lang="ts">
import IconButton from '@/components/IconButton.vue';
import { Checkbox } from '@/components/ui/checkbox';
import { AuthAPI } from '@/lib/api';
import { ArrowLeft, KeyRound, Phone, Smartphone } from 'lucide-vue-next';
import { computed, onActivated, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const route = useRoute();
const router = useRouter();

const redirectPath = computed(() => route.query.redirect as string || '/');

const loginMode = ref<'sms' | 'password'>('sms')

const userAgree = ref(false);

const formData = reactive({
    phone: '',
    smsCode: '',
    password: '',
});
const formatFormData = () => {
    formData.phone = formData.phone.trim();
    formData.smsCode = formData.smsCode.trim();
    formData.password = formData.password.trim();
}

const status = reactive({
    sendSms: false,
    login: false,
})

const handleSendSms = async () => {
    if (status.sendSms) {
        return toast.info('正在请求中，请稍后');
    }

    if (!userAgree.value) {
        return toast.warning('请先勾选已阅读并同意《用户协议》和《隐私协议》')
    }

    formatFormData();
    if (!formData.phone) {
        return toast.info('请输入手机号');
    }

    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
        return toast.info('请输入正确的中国大陆手机号');
    }

    status.sendSms = true;
    await AuthAPI.sendSmsCode(formData.phone).then(() => {
        toast.success('发送成功，验证码10分钟内有效');
    }).catch(e => {
        toast.error(`${e.message}`);
    }).finally(() => status.sendSms = false)
}

const handleLogin = async () => {
    if (status.login) {
        return toast.info('正在请求中，请稍后');
    }

    if (!userAgree.value) {
        return toast.warning('请先勾选已阅读并同意《用户协议》和《隐私协议》')
    }

    formatFormData();
    if (!formData.phone) {
        toast.info('请输入手机号');
        return;
    }

    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
        return toast.info('请输入正确的中国大陆手机号');
    }

    if (loginMode.value === 'sms') {
        // 短信验证码登录
        if (!formData.smsCode) {
            return toast.info('请填写短信验证码');
        }

        if (!/^\d{6}$/.test(formData.smsCode)) {
            return toast.info('验证码必须是6位数字');
        }

        status.login = true;
        await AuthAPI.login(formData.phone, formData.smsCode).then((data) => {
            if (!data.token) {
                throw new Error('异常错误');
            }
            localStorage.setItem('token', data.token);
            toast.success('登录成功');
            router.replace(redirectPath.value);
        }).catch(e => {
            toast.error(`${e.message}`);
        }).finally(() => status.login = false);
    } else {
        // 密码登录
        if (!formData.password) {
            return toast.info('请填写密码');
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,20}$/.test(formData.password)) {
            return toast.info('密码必须包含字母和数字，长度6-20位');
        }

        status.login = true;
        await AuthAPI.loginByPassword(formData.phone, formData.password).then(async (data) => {
            if (!data.token) {
                throw new Error('异常错误');
            }
            localStorage.setItem('token', data.token);
            toast.success('登录成功');
            router.replace(redirectPath.value);
        }).catch(e => {
            toast.error(`${e.message}`);
        }).finally(() => status.login = false);
    }
}

onActivated(() => {
    formData.password = '';
    formData.phone = '';
    formData.smsCode = '';
    userAgree.value = false;
})

</script>
<template>
    <div class="p-4 bg-[#191b24] h-[100dvh]">
        <div class="h-5"></div>
        <div>
            <IconButton @click="$router.back()">
                <ArrowLeft class="size-5" />
            </IconButton>
        </div>
        <div class="px-3">
            <div class="mt-5 text-2xl">Hi,欢迎来到LawGo</div>
            <div class="mt-10">
                <div>
                    <div class="text-lg">手机号</div>
                    <div class="border-b pb-3 mt-3 w-full border-zinc-500 ">
                        <input class="outline-none text-lg w-full" type="phone" placeholder="请输入手机号"
                            v-model="formData.phone">
                    </div>
                </div>
                <div class="mt-10" v-if="loginMode === 'sms'">
                    <div>验证码</div>
                    <div class="border-b pb-3 mt-3 w-full border-zinc-500 flex items-center gap-3">
                        <input class="outline-none text-lg flex-1" type="text" placeholder="请输入验证码"
                            v-model="formData.smsCode">
                        <div class="h-4 border-r border-zinc-500"></div>
                        <button class="text-[#f4b941]" @click="handleSendSms">获取验证码</button>
                    </div>
                </div>
                <div class="mt-10" v-else-if="loginMode == 'password'">
                    <div>密码</div>
                    <div class="border-b pb-3 mt-3 w-full border-zinc-500 flex items-center gap-3">
                        <input class="outline-none text-lg flex-1" type="password" placeholder="请输入密码"
                            v-model="formData.password">
                    </div>
                </div>
            </div>
            <div class="mt-15">
                <button @click="handleLogin"
                    class="w-full rounded-full bg-[#f3b43f] h-12 text-zinc-700 font-bold flex items-center justify-center">
                    <Smartphone class="size-5" />
                    <span class="ml-1">{{ loginMode === 'sms' ? '注册并登录' : '登录' }}</span>
                </button>
                <div class="mt-5 flex items-center">
                    <Checkbox id="terms" class="border-zinc-400" v-model="userAgree" />
                    <label for="terms"
                        class="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        已阅读并同意《用户协议》及《隐私协议》
                    </label>
                </div>
            </div>
        </div>
        <div class="mt-15">
            <div class="flex items-center">
                <div class="flex-1 border-t border-zinc-400"></div>
                <div class="text-sm mx-2 text-zinc-200">其他登录方式</div>
                <div class="flex-1 border-t border-zinc-400"></div>
            </div>
            <div class="flex justify-center mt-5">
                <IconButton @click="loginMode = 'password'" v-if="loginMode === 'sms'">
                    <KeyRound class="size-5 m-0.5" />
                </IconButton>
                <IconButton @click="loginMode = 'sms'" v-else-if="loginMode === 'password'">
                    <Phone class=" size-5 m-0.5" />
                </IconButton>
            </div>
        </div>
    </div>
</template>