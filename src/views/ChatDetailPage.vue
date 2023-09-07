<template>
    <div>
        <div class="h-10 p-3">
            <h3>{{ getCompanionName }}</h3>
            <hr>
        </div>
        <div id="bottomLine" ref="bottomLine" class="h-80 p-3 message-list">
            <div v-for="message in messages" :key="message.id">
                <MessageItem :message="message" />
            </div>
        </div>
        <div class="h-10 p-3 bg-light d-flex align-items-center">
            <input type="text" v-model="message_to_send" class="form-control">
            <button type="button" @click="sendMessage()" class="btn btn-outline-info">
                <i class="fa-solid fa-share"></i>
            </button>
        </div>
    </div>
</template>

<script>
    import {SOCKET_HOST} from '../../env'
    import ChatsService from '../services/api_services/chats_service'
    import MessageItemComponent from '../components/MessageItemComponent.vue'
    import MessagesService from '../services/api_services/messages_service'
    import JwtService from '../services/jwt_service'
    import { arrayRemove } from '../helpers'
    
    export default {
        data() {
            return {
                chat: {
                    id: 0,
                    receiver: {
                        id: 0,
                        first_name: null,
                        last_name: null,
                        username: null,
                    },
                    sender: {
                        id: 0,
                        first_name: null,
                        last_name: null,
                        username: null,
                    },
                    created_at: null,
                },
                messages: [],
                message_to_send: null,
            }
        },
        components: {
            'MessageItem': MessageItemComponent
        },
        async created(){
            let chat = await this.loadChat()
            this.loadMessages(chat)
            const connection = new WebSocket(`${SOCKET_HOST}/api/messages/${chat.id}/?authorization=${JwtService.getTokenHeader()?.Authorization}`)
            connection.onmessage = this.updateMessageList
        },
        mounted(){
            setTimeout(() => {
                let elem = document.querySelector('#bottomLine')
                elem.scrollTop = elem.scrollHeight
            }, 500)
        },
        computed: {
            getCompanionName(){
                if (this.$store.state.auth.user.sub == this.chat.sender.id){
                    return `${this.chat.receiver.first_name} ${this.chat.receiver.last_name}`
                }
                return `${this.chat.sender.first_name} ${this.chat.sender.last_name}`
            },
        },
        methods: {
            async loadChat() {
                let result = await ChatsService.get_one({
                    id: this.$route.params.id
                }).then(
                    response => {
                        return response
                    },
                    error => {
                        this.$router.push({name: 'home_page'})
                        return Promise.reject(error)
                    }
                )
                this.chat = result
                return result
            },
            loadMessages(chat){
                MessagesService.get_list(chat.id)
                    .then(
                        response => {
                            this.messages = response
                        },
                        error => Promise.reject(error)
                    )
            },
            sendMessage(){
                if(!this.message_to_send){
                    return
                }
                MessagesService.store({
                    chat_id: this.chat.id,
                    content: this.message_to_send
                }).then(
                    response => {
                        this.message_to_send = null
                        return response
                    },
                    error => Promise.reject(error)
                )
            },
            updateMessageList(response){
                let message = JSON.parse(response.data)

                if(message.to_delete){
                    this.messages = arrayRemove(this.messages, message)
                    return
                }

                this.messages.push(message)
            },
        }
    }
</script>
