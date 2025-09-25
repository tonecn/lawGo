import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { HuaweiService } from './huawei.service';
import { AuthGuard } from '@nestjs/passport';
import { SstDto } from './dto/sst.dto';
import { TtsDto } from './dto/tts.dto';
import { OcrDto } from './dto/ocr.dto';

@Controller('huawei')
@UseGuards(AuthGuard('jwt'))
export class HuaweiController {

    constructor(
        private readonly huaweiService: HuaweiService,
    ) { }

    @Post('sst')
    async sst(@Body() dto: SstDto) {
        return this.huaweiService.recognizeShortAudio(dto.audioBase64);
    }


    @Post('tts')
    async tts(@Body() dto: TtsDto) {
        return this.huaweiService.runTts(dto.text);
    }


    @Post('ocr')
    async ocr(@Body() dto: OcrDto) {
        return this.huaweiService.runOcr(dto.imageBase64);
    }

}
