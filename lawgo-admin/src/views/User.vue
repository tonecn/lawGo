<script setup lang="ts">
import { onMounted, ref } from 'vue';
import UserList from './User/UserList.vue';
import { UserAPI } from '@/lib/api';
import { toast } from 'vue-sonner';
import type { User } from '@/lib/types/User';
import UserDialog from './User/UserDialog.vue';
import { Button } from '@/components/ui/button';

const userListErrorMessage = ref('');
const userList = ref<User[]>();
onMounted(() => {
    handleLoadUserList();
})

const handleLoadUserList = async () => {
    userList.value = undefined;
    userListErrorMessage.value = '';
    await UserAPI.list().then((data) => {
        userList.value = data;
    }).catch(e => {
        userListErrorMessage.value = `${e.message}`;
        toast.error(`${e.message}`);
    })
}

const userDialogData = ref<User>();
const userDialogMode = ref<'add' | 'edit'>('add');
const userDialogOpen = ref(false);
const handleEdit = async (id: string) => {
    await UserAPI.get(id).then(data => {
        userDialogData.value = data;
        userDialogMode.value = 'edit';
        userDialogOpen.value = true;
    }).catch(e => toast.error(`${e.message}`));
}

const handleAdd = async () => {
    userDialogData.value = {
        id: '',
        username: '',
        phone: '',
        createdAt: new Date().toLocaleString(),
        updatedAt: null,
        deletedAt: null,
        roles: [],
    };
    userDialogMode.value = 'add';
    userDialogOpen.value = true;
}

</script>
<template>
    <div class="flex-1 overflow-hidden flex flex-col">
        <div>
            <Button @click="handleAdd">新增</Button>
        </div>
        <div class="flex-1 overflow-x-hidden overflow-y-auto">
            <UserList :data="userList" @edit="id => handleEdit(id)" :error-message="userListErrorMessage" />
        </div>
        <UserDialog :mode="userDialogMode" v-model="userDialogData" v-model:open="userDialogOpen"
            @refresh="handleLoadUserList" />
    </div>
</template>