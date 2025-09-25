<script setup lang="ts">
import IconButton from '@/components/IconButton.vue';
import { HuaweiAPI } from '@/lib/api';
import { app } from '@/lib/app-vm/app';
import { AudioRecorder } from '@/lib/utils';
import { ArrowLeft, MessageSquareText, Mic } from 'lucide-vue-next';
import { onActivated, reactive, ref } from 'vue';
import { toast } from 'vue-sonner';

/** @todo 需要根据标识位进行状态管理 */

const voiceChat = app.voiceChat;
const audioRecorder = new AudioRecorder();

const status = reactive({
    isInputing: false,// 用户语音输入
    userInputParsing: false,// 用户语音解析
    llmGenerating: false,// 大预言模型生成
    ttsOutputing: false,// 文本转语音
})

// 用户语音输入
let stopCurrentSpeak: undefined | (() => void);
const handleTouchStart = async () => {
    if (status.isInputing) {
        return;
    }

    if (status.userInputParsing) {
        return toast.warning('解析中，请稍后');
    }

    if (status.llmGenerating) {
        return toast.warning('AI正在思考中，请稍后...')
    }

    if (status.ttsOutputing) {
        stopCurrentSpeak?.();
    }

    status.isInputing = true;
    await audioRecorder.start().catch(e => {
        toast.error(`${e.message}`);
        status.isInputing = false;
    })
}

const handleTouchEnd = async () => {
    if (!status.isInputing) {
        return;
    }

    try {
        const res = await audioRecorder.stop().finally(() => {
            status.isInputing = false;
        });
        // 用户语音解析
        status.userInputParsing = true;
        const sstRes = await HuaweiAPI.sst(res).finally(() => {
            status.userInputParsing = false
        });
        const inputRes = sstRes.result.text;
        // 更新视图
        userInput.value = inputRes;

        if (!inputRes.trim()) {
            return;
        }

        // 大预言模型生成
        status.llmGenerating = true;
        await voiceChat.chat(inputRes, {
            onComplete: async (content) => {
                status.ttsOutputing = true;
                await HuaweiAPI.tts(content).then(async (res) => {
                    const audioData = res.result.data;

                    try {
                        // 将base64转换为ArrayBuffer
                        const binaryString = atob(audioData);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }

                        // 创建AudioContext
                        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

                        // 解码音频数据
                        const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);

                        // 创建音频源并播放
                        const source = audioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(audioContext.destination);
                        source.start();

                        // 设置停止播放的函数
                        stopCurrentSpeak = () => {
                            try {
                                source.stop();
                                audioContext.close();
                                status.ttsOutputing = false;
                                stopCurrentSpeak = undefined;
                            } catch (error) { }
                        };

                        // 监听播放结束
                        source.onended = () => {
                            audioContext.close();
                        };

                    } catch (audioError) {
                        toast.error('音频播放失败');
                    }
                }).catch(e => {
                    toast.error(`${e.message}`)
                    status.ttsOutputing = false;
                });
            }
        }).finally(() => {
            status.llmGenerating = false;
        });
    } catch (error) {
        toast.error(`${(error as any).message || '异常错误'}`);
    }
}

onActivated(() => {
    voiceChat.init();
})

const userInput = ref('');

</script>
<template>
    <div class="flex flex-col justify-between h-[100dvh]"
        style="background: linear-gradient(to bottom, #3d374b, #191b23 20%)">
        <div class="p-3">
            <div class="h-5"></div>
            <div class="flex items-center">
                <span class="flex-1">
                    <IconButton @click="!status.isInputing && $router.push({ name: 'home' })">
                        <ArrowLeft class="size-5" />
                    </IconButton>
                </span>
                <span class="flex-1 text-center text-xl">语音对话</span>
                <span class="flex-1"></span>
            </div>
            <div class="h-3"></div>
        </div>
        <div class="flex-1 overflow-x-hidden overflow-y-auto flex flex-col justify-center">
            <div class="flex-1 flex flex-col justify-center overflow-hidden text-zinc-200 text-sm px-5">
                <div
                    class="my-5 whitespace-pre-wrap break-all overflow-y-auto rounded-xl bg-[#ffffff22] mx-auto px-3 py-1.5">
                    {{ voiceChat.data.context.length > 1 ? (voiceChat.data.llmLastOutput || '...') : '你说，我在听...👂' }}
                </div>
            </div>
            <div class="border-t-2 border-dashed border-[#3a82f6]"></div>
            <div class="flex-1 flex flex-col-reverse justify-center overflow-hidden text-zinc-200 text-sm">
                <div class="m-5 text-center whitespace-pre-wrap break-all overflow-y-auto mx-auto px-5 py-1.5 mb-8">
                    {{ userInput }}
                </div>
                <div></div>
            </div>
        </div>
        <div class="p-3">
            <div class="relative w-full">
                <div class="absolute mx-auto bottom-3 text-zinc-300 text-center w-full" v-show="status.isInputing">
                    松手 发送内容
                </div>
                <div class="absolute mx-auto bottom-3 text-zinc-300 text-center w-full"
                    v-show="status.userInputParsing">
                    解析中...
                </div>
            </div>
            <div class="h-2"></div>
            <div class="flex">
                <IconButton type="highlight"
                    @click="!status.isInputing && $router.push({ name: 'intelligentConversation' })">
                    <MessageSquareText class="size-7" />
                </IconButton>
                <div class="flex-1 flex justify-center items-center ml-3 border border-zinc-500 text-zinc-300 rounded-full py-1 bg-[#ffffff22] select-none"
                    @touchstart="handleTouchStart" @touchend="handleTouchEnd" @mousedown="handleTouchStart"
                    @mouseup="handleTouchEnd">
                    <Mic class="size-5" />
                    <span class="ml-1">按住说话</span>
                </div>
            </div>
        </div>
    </div>
</template>