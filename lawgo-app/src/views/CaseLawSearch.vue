<script setup lang="ts">
import IconButton from '@/components/IconButton.vue';
import { ArrowLeft, WandSparkles } from 'lucide-vue-next';
import {
    Stepper,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
} from '@/components/ui/stepper'

</script>
<template>
    <div class="flex flex-col justify-between h-[100dvh]"
        style="background: linear-gradient(to bottom, #3d374b, #191b23 20%)">
        <div class="flex-1 overflow-x-hidden overscroll-y-auto p-3 flex flex-col">
            <div>
                <div class="h-5"></div>
                <div class="flex items-center">
                    <span class="flex-1">
                        <IconButton @click="$router.back()">
                            <ArrowLeft class="size-5" />
                        </IconButton>
                    </span>
                    <span class="flex-1 text-center text-xl">类判案例检索</span>
                    <span class="flex-1"></span>
                </div>
                <div class="h-3"></div>
            </div>
            <div class="flex-1 flex justify-center items-center">
                <Stepper>
                    <StepperItem :step="1">
                        <StepperTrigger>
                            <StepperIndicator class="size-20">
                                <WandSparkles class="size-10" />
                            </StepperIndicator>
                            <StepperTitle class="mt-3">开发中</StepperTitle>
                            <StepperDescription>程序员正在挥舞魔杖，该功能即将上线~</StepperDescription>
                        </StepperTrigger>
                        <StepperSeparator />
                    </StepperItem>
                </Stepper>
            </div>
        </div>
    </div>
</template>