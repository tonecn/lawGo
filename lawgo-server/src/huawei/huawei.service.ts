import { Injectable } from '@nestjs/common';
import { ListVpcsRequest, VpcClient } from "@huaweicloud/huaweicloud-sdk-vpc";
import { BasicCredentials } from "@huaweicloud/huaweicloud-sdk-core/auth/BasicCredentials";
import { Config, PostCustomTTSReq, PostShortAudioReq, RecognizeShortAudioRequest, RunTtsRequest, SisClient } from '@huaweicloud/huaweicloud-sdk-sis'
import { OcrClient, RecognizeSmartDocumentRecognizerRequest, SmartDocumentRecognizerRequestBody } from '@huaweicloud/huaweicloud-sdk-ocr'

@Injectable()
export class HuaweiService {

    private credentials: BasicCredentials;
    private sisClient: SisClient;
    private ocrClient: OcrClient;

    constructor() {
        this.credentials = new BasicCredentials()
            .withAk(process.env.HUAWEICLOUD_SDK_AK)
            .withSk(process.env.HUAWEICLOUD_SDK_SK)
            .withProjectId(process.env.HUAWEICLOUD_PROJECT_ID);

        this.sisClient = SisClient.newBuilder()
            .withCredential(this.credentials)
            .withEndpoint(`https://sis-ext.cn-north-4.myhuaweicloud.com`)
            .build();

        this.ocrClient = OcrClient.newBuilder()
            .withCredential(this.credentials)
            .withEndpoint(`https://ocr.cn-north-4.myhuaweicloud.com`)
            .build();
    }

    async recognizeShortAudio(audioBase64: string) {
        const request = new RecognizeShortAudioRequest();
        const body = new PostShortAudioReq();
        const configbody = new Config();
        configbody.withAudioFormat("auto")
            .withProperty("chinese_16k_general")
            .withAddPunc("yes")
            .withDigitNorm("yes");
        body.withData(`${audioBase64}`);
        body.withConfig(configbody);
        request.withBody(body);
        return this.sisClient.recognizeShortAudio(request);
    }

    async runTts(text: string) {
        const request = new RunTtsRequest();
        const body = new PostCustomTTSReq();
        body.withText(`${text}`);
        request.withBody(body);
        return this.sisClient.runTts(request);
    }

    async runOcr(imageBase64: string) {
        const request = new RecognizeSmartDocumentRecognizerRequest();
        const body = new SmartDocumentRecognizerRequestBody();
        body.withData(`${imageBase64}`);
        request.withBody(body);
        return this.ocrClient.recognizeSmartDocumentRecognizer(request);
    }
}
