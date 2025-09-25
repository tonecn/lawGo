export const AuthError = {
    CAPTCHA_INVALID: {
        code: 5001,
        message: '验证码无效',
    },
    CAPTCHA_MISMATCH: {
        code: 5002,
        message: '验证码错误',
    },
    CAPTCHA_COOLDOWN: {
        code: 5003,
        message: '验证码冷却中',
    },
    CAPTCHA_MAX_ATTEMPTS: {
        code: 5004,
        message: '超过验证码尝试次数',
    },
    PASSWORD_INCORRECT: {
        code: 5005,
        message: '密码错误',
    },
}