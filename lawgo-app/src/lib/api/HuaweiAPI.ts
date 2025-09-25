import { request } from "../request";

export const sst = async (audioBase64: string): Promise<{
    httpStatusCode: number;// 200
    result: {
        score: number;// 0~1
        text: string;
    },
    trace_id: string;
}> =>
    request.post('huawei/sst', { audioBase64 })

export const tts = async (text: string): Promise<{
    httpStatusCode: number;// 200
    result: {
        data: string;// base64 audio
    },
    trace_id: string;
}> =>
    request.post('huawei/tts', { text })

export const ocr = async (imageBase64: string): Promise<{
    httpStatusCode: number;// 200
    'X-Request-Id': string;
    result: [{
        ocr_result: {
            direction: number;
            words_block_count: number;
            words_block_list: {
                confidence: number;// 0~1
                location: [number, number][]
                words: string;
            }[]
        }
    }]
}> =>
    request.post('huawei/ocr', { imageBase64 })