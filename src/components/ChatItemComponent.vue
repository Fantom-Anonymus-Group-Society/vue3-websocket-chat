<template>
        <li @click="selectChat()" class="chat-item cursor-pointer">
            <b>{{ getCompanionName }}</b>
            <br>
            <span>
                {{ getLastMessage }}
            </span>
            <br>
            <sup class="text-secondary">{{ getLastMessageDate }}</sup>
        </li>
</template>
<script>
    import ChatsService from '../services/api_services/chats_service'

    export default {
        name: 'ChatItemComponent',
        props: {
            chat: {
                type: Object,
            }
        },
        computed: {
            getCompanionName(){
                if (this.$store.state.auth.user.sub == this.chat.sender.id){
                    return `${this.chat.receiver.first_name} ${this.chat.receiver.last_name}`
                }
                return `${this.chat.sender.first_name} ${this.chat.sender.last_name}`
            },
            getLastMessage(){
                if(this.chat.last_message == null){
                    return ''
                }
                let message = this.chat.last_message.content
                if (message.length > 20){
                    message = message.slice(0, 20) + '...'
                }
                return message
            },
            getLastMessageDate(){
                if(this.chat.last_message == null){
                    return ''
                }
                let date = this.chat.last_message?.created_at

                date = Date.parse(date)
                date = new Date(date)

                let day = date.getDay().toString().length < 2 ? `0${date.getDay()}` : date.getDay() 

                let month = date.getMonth().toString().length < 2 ? `0${date.getMonth()}` : date.getMonth() 

                date = `${day}.${month}.${date.getFullYear()}`
                return date
            }
        },
        methods: {
            selectChat(){
                this.$router.push({name: 'chats.show', params:{id: this.chat.id}})
            },
            destroyEmergency(){
                ChatsService.destroy(this.chat.id).then(
                    response => {
                        return response
                    },
                    error => {
                        return Promise.reject(error)
                    }
                )
            }
        }
    }
</script>
