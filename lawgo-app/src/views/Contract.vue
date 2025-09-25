<script setup lang="ts">
import Footer from '@/components/Footer.vue';
import { FileCheck, Plus } from 'lucide-vue-next';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ref } from 'vue';
import { cn } from '@/lib/utils';
import { toast } from 'vue-sonner';
import { HuaweiAPI } from '@/lib/api';
import { app } from '@/lib/app-vm/app';
import { useRouter } from 'vue-router';

const router = useRouter();

const selectedFile = ref<File | null>(null);
const selectedType = ref<string>('');

const handleFileSelected = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target.files || !target.files.length) return;

    selectedFile.value = target.files[0];
}

const isDrawerOpen = ref(false);
const isProcessing = ref(false);
const handleSubmit = async () => {
    isDrawerOpen.value = true;
    if (isProcessing.value) {
        return toast.warning('处理中，请稍后...')
    }

    const file = selectedFile.value;
    if (!file) {
        return toast.info('请先选择文件');
    }

    const contractType = selectedType.value;
    if (!contractType) {
        return toast.info('请选择场景');
    }

    // 判断文件是否超过10MB
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_SIZE) {
        return toast.error('文件大小不能超过10MB');
    }

    const imageBase64: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const bytes = new Uint8Array(arrayBuffer);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            const base64 = btoa(binary);
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });

    // OCR
    isProcessing.value = true;
    await HuaweiAPI.ocr(imageBase64).then((data) => {
        app.contract.setOcrResult(data.result[0].ocr_result);
        app.contract.setContractScnario(selectedType.value)
        router.push({ name: 'contractResult' });
    }).catch(e => {
        toast.error(`${e.message}`);
    }).finally(() => {
        isProcessing.value = false;
    })
}

</script>
<template>
    <div class="flex flex-col justify-between h-[100dvh]"
        style="background: linear-gradient(to bottom, #3d374b, #191b23 20%)">
        <div class="flex-1 overflow-x-hidden overscroll-y-auto flex flex-col">
            <div class="h-5"></div>
            <div class="p-3">
                <div class="flex items-end justify-between font-light text-zinc-300">
                    <!-- <div class="flex-1">示例</div> -->
                    <div class="flex-1 text-center font-bold text-xl">合同审查</div>
                    <!-- <div class="flex-1 text-end">审查记录 ></div> -->
                </div>
                <div class="h-5"></div>
                <div class="flex items-center">
                    <span>合同场景:</span>
                    <div class="flex-1 ml-5">
                        <Select v-model:model-value="selectedType">
                            <SelectTrigger class="w-full border-2 rounded-lg border-[#465980]">
                                <SelectValue placeholder="请选择场景" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="买卖合同">买卖合同</SelectItem>
                                    <SelectItem value="租赁合同">租赁合同</SelectItem>
                                    <SelectItem value="技术开发合同">技术开发合同</SelectItem>
                                    <SelectItem value="劳动合同">劳动合同</SelectItem>
                                    <SelectItem value="委托合同">委托合同</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <div class="h-10"></div>
            <div class="flex flex-col items-center">
                <label for="file-upload" :class="cn(
                    'p-10 border-2 border-dashed border-zinc-400',
                    selectedFile && 'bg-[#ffffff22] rounded-xl'
                )">
                    <Plus v-if="!selectedFile" class="size-15 text-zinc-300" />
                    <div v-else class="size-15 flex flex-col items-center text-zinc-300">
                        <FileCheck class="size-10" />
                        <span class="text-sm font-light text-nowrap mt-2 text-zinc-400">已选择</span>
                    </div>
                </label>
                <input id="file-upload" type="file" class="hidden" v-on:change="handleFileSelected"
                    accept=".png,.jpg,.jpeg,.bmp,.gif,.tiff,.webp,.pcx,.ico,.psd">
                <div v-if="!selectedFile" class="text-center">
                    <div class="mt-5 text-zinc-200">点击上传合同文件</div>
                    <div class="mt-3 text-zinc-400 text-sm">
                        <div>推荐使用jpg格式，不超过10MB</div>
                        <div>格式支持：png/jpg/jpeg/bmp/gif/tiff/webp</div>
                    </div>
                </div>
                <div v-else class="w-full px-10">
                    <div class="text-zinc-200 mt-5 truncate max-w-full text-center">
                        {{ selectedFile.name }}
                    </div>
                </div>
            </div>

            <div class="mt-auto px-3 mb-10">
                <button :class="cn('w-full h-12 rounded-full')"
                    style="background: linear-gradient(to right, #4684d6, #c35cf3);" @click="handleSubmit">{{
                        isProcessing ? '处理中...' : '开始审查' }}</button>
            </div>
        </div>
        <Footer />
    </div>
</template>