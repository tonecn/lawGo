import { request } from "../request"

export const sendSmsCode = async (phone: string): Promise<null> =>
    request.post('/auth/sms-code', { phone })

export const login = async (phone: string, code: string): Promise<{ token: string }> =>
    request.post('/auth/login', { phone, code })

export const loginByPassword = async (phone: string, password: string): Promise<{ token: string }> =>
    request.post('/auth/login-by-password', { phone, password })
