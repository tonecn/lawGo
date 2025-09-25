import { AichatVM } from "./AichatVM";
import { ContractVM } from "./ContractVM";
import { LegalDocumentVM } from "./LegalDocumentVM";
import { UserVM } from "./UserVM";
import { VoiceChatVM } from "./VoiceChatVM";

class App {
    public user = new UserVM();
    public aichat = new AichatVM();
    public voiceChat = new VoiceChatVM();
    public contract = new ContractVM();
    public legalDocument = new LegalDocumentVM();
}

const app = new App();

export {
    app,
}