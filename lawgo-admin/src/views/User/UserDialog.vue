<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserAPI } from '@/lib/api';
import type { User } from '@/lib/types/User';
import { nextTick, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import type { UserRole } from '@/lib/types/UserRole';

const props = defineProps<{
    mode?: 'edit' | 'add',
}>()

const userModel = defineModel<User>();
const openModel = defineModel<boolean>('open');
const emit = defineEmits<{
    refresh: [],
}>()

const passwordInput = ref('');
/** 仅在编辑模式下生效 */
const showPasswordInput = ref(false);

watch(openModel, () => {
    if (openModel.value) {
        // 每次打开对话框时的初始化操作
        passwordInput.value = '';
        showPasswordInput.value = false;
    }
})

const handleSave = async () => {
    if (!userModel.value) {
        return toast.error('初始化失败，请刷新界面后重试');
    }

    let { id, phone, username, roles } = userModel.value;
    let password = passwordInput.value;

    if (props.mode === 'add') {
        // 添加模式
        const reqData: {
            phone: string;
            username?: string;
            password?: string;
            roles?: UserRole[];
        } = {
            phone,
        };

        if (!/^1[3-9]\d{9}$/.test(phone)) {
            return toast.warning('手机号不合法');
        }

        if (username) {
            username = username.trim();
            if (username.length > 20 || username.length < 1) {
                return toast.warning('用户名长度只能在1～20之间')
            }
            reqData.username = username;
        }

        if (password) {
            password = password.trim();
            if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,20}$/.test(password)) {
                return toast.warning('密码不合法，要求至少具备字母和数字，长度在6～20位之间，允许特殊字符');
            }
            reqData.password = password;
        }

        if (roles) {
            reqData.roles = roles;
        }

        // 发送添加请求
        await UserAPI.create(reqData).then(() => {
            toast.success('创建成功');
            emit('refresh');
            openModel.value = false;
        }).catch(e => toast.error(`${e.message}`))
    } else if (props.mode === 'edit') {
        // 编辑模式
        const reqData: {
            phone?: string;
            username?: string;
            password?: string;
            roles?: UserRole[];
        } = {};

        if (phone) {
            phone = phone.trim();
            if (!/^1[3-9]\d{9}$/.test(phone)) {
                return toast.warning('手机号不合法');
            }
            reqData.phone = phone;
        }

        if (username) {
            username = username.trim()
            if (username.length > 20 || username.length < 1) {
                return toast.warning('用户名长度只能在1～20之间')
            }
            reqData.username = username;
        }

        if (password) {
            password = password.trim();
            if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,20}$/.test(password)) {
                return toast.warning('密码不合法，要求至少具备字母和数字，长度在6～20位之间，允许特殊字符');
            }
            reqData.password = password;
        }

        if (roles) {
            reqData.roles = roles;
        }

        await UserAPI.update(id, reqData).then(() => {
            toast.success('修改成功');
            emit('refresh');
            openModel.value = false;
        }).catch(e => toast.error(`${e.message}`))
    } else {
        // 未定义的模式
        toast.error('错误的工作模式');
        openModel.value = false;
    }
}

const passwordInputRef = ref<HTMLInputElement | null>(null);
const handleShowPasswordInput = () => {
    showPasswordInput.value = true;
    nextTick(() => {
        passwordInputRef.value?.focus?.();
    })
}
const handlePasswordInputBlur = () => {
    if (props.mode === 'edit') {
        // 仅在编辑模式下生效
        if (!passwordInput.value.trim()) {
            passwordInput.value = '';// 保险起见，避免空串影响
            showPasswordInput.value = false;
        }
    }
}

const deleteDialogOpen = ref(false);
const handleDelete = async () => {
    if (!userModel.value) {
        return toast.error('数据管理状态异常');
    }

    await UserAPI.remove(userModel.value.id).then(() => {
        toast.success('删除成功');
        openModel.value = false;
        emit('refresh');
    }).catch(e => toast.error(`${e.message}`));
}

const handleChangeRoleValue = (newVal: boolean, role: UserRole) => {
    if (!userModel.value) {
        return;
    }

    if (newVal) {
        // 新增
        if (!userModel.value.roles.includes(role)) {
            userModel.value.roles.push(role);
        }
    } else {
        // 移除
        userModel.value.roles = userModel.value.roles.filter(r => r !== role);
    }
}

</script>
<template>
    <Dialog v-model:open="openModel">
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{{ mode === 'edit' ? '编辑' : mode === 'add' ? '添加' : '[未知定义的操作]' }}用户信息</DialogTitle>
                <DialogDescription>
                    请在提交表单前检查填写信息是否有误
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4" v-if="userModel">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="user-dialog-id" class="text-right">
                        ID
                    </Label>
                    <Input id="user-dialog-id" class="col-span-3" v-model="userModel.id" disabled />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="user-dialog-username" class="text-right">
                        用户名
                    </Label>
                    <Input id="user-dialog-username" class="col-span-3" v-model="userModel.username" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="user-dialog-phone" class="text-right">
                        手机号<span class="text-red-500">*</span>
                    </Label>
                    <Input id="user-dialog-phone" class="col-span-3" v-model="userModel.phone" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label class="text-right">
                        密码
                    </Label>
                    <Input ref="passwordInputRef" class="col-span-3" v-model="passwordInput"
                        v-show="mode === 'add' || (mode === 'edit' && showPasswordInput)"
                        @blur="handlePasswordInputBlur" />
                    <div v-show="mode === 'edit' && !showPasswordInput">
                        <Button variant="outline" @click="handleShowPasswordInput">修改新密码</Button>
                    </div>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label class="text-right">
                        角色
                    </Label>
                    <div class="flex items-center flex-wrap gap-5">
                        <div class="flex items-center gap-2">
                            <Checkbox id="role-admin" :model-value="userModel.roles?.includes('admin') || false"
                                @update:model-value="n => handleChangeRoleValue(Boolean(n), 'admin')" />
                            <label for="role-admin" class="text-sm">
                                管理员
                            </label>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="user-dialog-createdAt" class="text-right">
                        创建时间
                    </Label>
                    <Input id="user-dialog-createdAt" class="col-span-3"
                        :model-value="new Date(userModel.createdAt).toLocaleString()" disabled />
                </div>
            </div>
            <DialogFooter>
                <div class="w-full flex justify-between">
                    <div v-show="mode === 'edit'">
                        <AlertDialog v-model="deleteDialogOpen">
                            <AlertDialogTrigger>
                                <Button variant="destructive">删除</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>是否要删除该用户？</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        该操作会先进行软删除，彻底清除需要手动从数据库中移除
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction @click="handleDelete">删除</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div>
                        <Button variant="outline" @click="openModel = false">取消</Button>
                        <Button class="ml-3" @click="handleSave">保存</Button>
                    </div>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>