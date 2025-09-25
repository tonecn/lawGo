import { reactive } from "vue";
import { ChatAPI } from "../api";
import type { ChatIndex } from "../types/ChatIndex";
import type { User } from "../types/User";

export class ChatHistoryVM {

    data = reactive<{
        chatIndexs?: {
            indexs: ChatIndex[];
            users: {
                [userId: string]: User;
            };
        };

    }>({

    })

    constructor() {

    }


    async loadIndexList() {
        this.data.chatIndexs = undefined;
        return ChatAPI.listIndexs().then(data => {
            const { indexs, users: userRaw } = data;
            this.data.chatIndexs = {
                indexs: indexs,
                users: userRaw.reduce((us, u) => {
                    us[u.id] = u;
                    return us;
                }, {} as { [userId: string]: User })
            }
        });
    }
}

const chatHistoryVM = new ChatHistoryVM();
export {
    chatHistoryVM,
}