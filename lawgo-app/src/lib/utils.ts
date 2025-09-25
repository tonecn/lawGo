import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export class AudioRecorder {
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private mimeType: string | null = null;

  /**
   * 开始录制音频
   * @throws {DOMException} 用户拒绝授权或设备不可用
   * @throws {Error} 浏览器不支持录音功能
   */
  async start(): Promise<void> {
    // 停止现有录制（如果正在进行）
    if (this.isRecording) {
      await this._safeStop();
    }

    try {
      // 请求麦克风权限并获取媒体流
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });

      // 确定最佳音频格式
      this.mimeType = this.selectBestMimeType();

      // 创建媒体录制器
      this.mediaRecorder = new MediaRecorder(this.mediaStream, {
        mimeType: this.mimeType
      });

      // 初始化数据存储
      this.audioChunks = [];

      // 设置数据收集处理程序
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // 开始录制（每1秒存储一次数据块）
      this.mediaRecorder.start(1000);
      this.isRecording = true;

    } catch (error) {
      this._cleanup();
      this.handleStartError(error as Error);
    }
  }

  /**
   * 停止录制并返回音频的Base64编码
   * @returns {Promise<string>} 音频数据的Base64编码（不含DataURL前缀）
   * @throws {Error} 未开始录制或转换失败
   */
  async stop(): Promise<string> {
    if (!this.isRecording || !this.mediaRecorder) {
      throw new Error("Recording not started");
    }

    return new Promise<string>((resolve, reject) => {
      // 设置停止后的最终处理
      this.mediaRecorder!.onstop = async () => {
        try {
          // 合并所有音频数据块
          const audioBlob = new Blob(this.audioChunks, {
            type: this.mimeType || 'audio/webm'
          });

          // 转换为Base64
          const base64String = await this.blobToBase64(audioBlob);
          resolve(base64String);

        } catch (error) {
          reject(new Error("Audio conversion failed: " + (error as Error).message));
        } finally {
          this._cleanup();
        }
      };

      // 停止录制
      try {
        this.mediaRecorder?.stop();
      } catch (error) {
        reject(new Error("Failed to stop recording: " + (error as Error).message));
      }
    });
  }

  /** 安全停止当前录制（不抛出错误） */
  private async _safeStop(): Promise<void> {
    try {
      if (this.isRecording && this.mediaRecorder) {
        await this.stop();
      }
    } catch {
      // 忽略停止过程中的错误
    }
  }

  /** 清理资源 */
  private _cleanup(): void {
    // 停止所有媒体轨道
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }

    // 重置状态
    this.mediaStream = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.mimeType = null;
  }

  /**
   * 选择最佳的MIME类型
   * @private
   */
  private selectBestMimeType(): string {
    // 按优先级测试支持的格式
    const supportedTypes = [
      'audio/webm;codecs=opus',  // 最通用的现代格式
      'audio/webm',              // 无编码器指定的WebM
      'audio/mp4',               // MP4容器
      'audio/ogg;codecs=opus',   // Ogg容器
      'audio/wav'                // WAV格式
    ];

    // 找到第一个支持的格式
    for (const type of supportedTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    // 如果没有支持的格式，使用浏览器默认
    return '';
  }

  /**
   * 将Blob转换为Base64字符串
   * @private
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        // 移除DataURL前缀（data:audio/webm;base64,）
        const result = reader.result as string;
        const base64Data = result.split(',')[1];

        if (base64Data) {
          resolve(base64Data);
        } else {
          reject(new Error("Invalid base64 data"));
        }
      };

      reader.onerror = () => {
        reject(new Error("File read error"));
      };

      reader.readAsDataURL(blob);
    });
  }

  /**
   * 处理启动错误
   * @private
   */
  private handleStartError(error: Error): void {
    const err = error as DOMException;

    if (err.name === 'NotAllowedError') {
      throw new Error("Microphone access denied by user");
    } else if (err.name === 'NotFoundError') {
      throw new Error("No microphone available");
    } else if (err.name === 'NotSupportedError') {
      throw new Error("Audio recording not supported in this browser");
    } else {
      throw new Error("Recording failed: " + err.message);
    }
  }
}