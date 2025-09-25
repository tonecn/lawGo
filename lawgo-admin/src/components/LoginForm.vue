<script setup lang="ts">
import { reactive, ref, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { KeyRound, Mail, Phone } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { NormalAuthAPI } from '@/lib/api'
import { useRouter } from 'vue-router'

const router = useRouter();
const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const loginMode = ref<'sms' | 'password'>('sms');
const formData = reactive({
  phone: '',
  password: '',
  code: '',
})

const handleSendSms = async () => {
  const phone = formData.phone;
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return toast.warning('手机号不合法，请输入正确的中国大陆手机号')
  }

  // 发送请求
  NormalAuthAPI.sendSmsCode(phone).then(() => {
    toast.success('发送成功，10分钟内有效');
  }).catch(e => toast.error(`${e.message}`));
}

const handleLogin = async () => {
  // 表单验证
  const phone = formData.phone;
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return toast.warning('手机号不合法，请输入正确的中国大陆手机号')
  }

  const password = formData.password;
  const code = formData.code;
  if (loginMode.value === 'sms') {
    // 短信验证码
    if (!/\d{6}$/.test(code)) {
      return toast.warning('短信验证码不合法');
    }
  }
  if (loginMode.value === 'password') {
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,20}$/.test(password)) {
      return toast.warning('密码必须包含字母和数字，长度6-20位')
    }
  }

  const loginAPI = loginMode.value === 'sms'
    ? () => NormalAuthAPI.login(phone, code)
    : () => NormalAuthAPI.loginByPassword(phone, password)

  await loginAPI().then(async data => {
    const token = data.token;
    localStorage.setItem('token', token);
    toast.success('登录成功');
    await router.replace({ name: 'home' });
  }).catch(e => toast.error(`${e.message}`));
}

</script>
<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-2 md:w-160">
        <form class="p-6 md:p-8">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col items-center text-center">
              <h1 class="text-2xl font-bold">
                欢迎回来
              </h1>
              <p class="text-muted-foreground text-balance">
                登录您的管理员账户
              </p>
            </div>
            <div class="grid gap-3">
              <Label for="phome">手机号</Label>
              <Input id="phome" type="phome" placeholder="请输入手机号" required v-model="formData.phone" />
            </div>
            <div class="grid gap-3" v-if="loginMode === 'password'">
              <div class="flex items-center">
                <Label for="password">密码</Label>
              </div>
              <Input id="password" type="password" required v-model="formData.password" />
            </div>
            <div class="grid gap-3" v-else-if="loginMode === 'sms'">
              <div class="flex items-center">
                <Label for="code">验证码</Label>
              </div>
              <div class="flex">
                <Input id="code" type="text" required v-model="formData.code" />
                <Button variant="link" type="button" @click="handleSendSms">发送验证码</Button>
              </div>
            </div>
            <Button type="button" class="w-full" @click="handleLogin">
              登录
            </Button>
            <div
              class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span class="bg-card text-muted-foreground relative z-10 px-2">
                其他登录方式
              </span>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <Button :variant="loginMode === 'sms' ? 'default' : 'outline'" type="button" class="w-full"
                @click="loginMode = 'sms'">
                <Phone />
                <span class="sr-only">短信登录</span>
              </Button>
              <Button :variant="loginMode === 'password' ? 'default' : 'outline'" type="button" class="w-full"
                @click="loginMode = 'password'">
                <KeyRound />
                <span class="sr-only">密码登录</span>
              </Button>
              <Button variant="outline" type="button" class="w-full">
                <Mail />
                <span class="sr-only">邮箱登录</span>
              </Button>
            </div>
          </div>
        </form>
        <div class="bg-muted relative hidden md:block">
          <img src="../assets/placeholder.svg" alt="Image"
            class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale">
        </div>
      </CardContent>
    </Card>
    <div
      class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
      By clicking continue, you agree to our <a href="#">Terms of Service</a>
      and <a href="#">Privacy Policy</a>.
    </div>
  </div>
</template>
