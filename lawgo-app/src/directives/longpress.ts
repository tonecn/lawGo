export const longpress = {
    mounted(el: HTMLElement, binding: any) {
        if (typeof binding.value !== 'function') {
            console.warn('v-longpress expects a function')
            return
        }

        let pressTimer: number | null = null
        const duration = binding.arg || 500 // 默认500ms

        const start = (e: TouchEvent | MouseEvent) => {
            if (pressTimer === null) {
                pressTimer = window.setTimeout(() => {
                    binding.value(e)
                }, duration)
            }
        }

        const cancel = () => {
            if (pressTimer !== null) {
                clearTimeout(pressTimer)
                pressTimer = null
            }
        }

        // 添加事件监听器
        el.addEventListener('touchstart', start)
        el.addEventListener('touchend', cancel)
        el.addEventListener('touchmove', cancel)
        el.addEventListener('mousedown', start)
        el.addEventListener('mouseup', cancel)
        el.addEventListener('mouseleave', cancel);

        // 保存清理函数
        (el as any)._longpress_cleanup = () => {
            el.removeEventListener('touchstart', start)
            el.removeEventListener('touchend', cancel)
            el.removeEventListener('touchmove', cancel)
            el.removeEventListener('mousedown', start)
            el.removeEventListener('mouseup', cancel)
            el.removeEventListener('mouseleave', cancel)
        }
    },

    unmounted(el: HTMLElement) {
        if ((el as any)._longpress_cleanup) {
            (el as any)._longpress_cleanup()
        }
    }
}