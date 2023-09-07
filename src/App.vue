<script>
  import { RouterView } from 'vue-router'
  import { Form, Field, ErrorMessage } from 'vee-validate'
  import * as yup from 'yup'
  import UsersService from './services/api_services/users_service'
  import ChatsService from './services/api_services/chats_service'
  import ChatItemComponent from './components/ChatItemComponent.vue'
  import UserItemComponent from './components/UserItemComponent.vue'
  import JwtService from './services/jwt_service'
  import { SOCKET_HOST } from '../env'
  import { arrayRemove } from './helpers'

  export default {
    components: {
      'Form': Form,
      'Field': Field,
      'ErrorMessage': ErrorMessage,
      'ChatItem': ChatItemComponent,
      'UserItem': UserItemComponent,
    },
    data(){
      const schema = yup.object().shape({

      })
      return {
        schema,
        modal: null,
        users: [],
        chats: [],
      }
    },
    mounted(){
      if (this.isAuthenticated){
        this.modal = new bootstrap.Modal('#modalCreateChat', {})
        ChatsService.get_list()
          .then(
            response => {
              this.chats = response
            },
            error => Promise.reject(error)
          )
        const connection = new WebSocket(`${SOCKET_HOST}/api/chats/?authorization=${JwtService.getTokenHeader()?.Authorization}`)
        connection.onmessage = this.chatListUpdate
      }
    },
    computed:{
      isAuthenticated(){
        return this.$store.state.auth.status.is_authenticated
      },
      getUserName(){
        return `${this.$store.state.auth.user.first_name} ${this.$store.state.auth.user.last_name}`
      }
    },
    methods: {
      openModal(){
        this.loadUsers()
        this.modal.show()
      },
      openProfile(){
        this.$router.push({
          name: 'profile'
        })
      },
      async createChat(receiver){
        let result = await ChatsService.store(receiver.id).then(
          response => {
            this.modal.hide()
            return response
          },
          error => {
            this.$notify({
              title: 'API Error',
              text: 'Chat cannot be created',
              type: 'error'
            })
            return Promise.reject(error)
          }
        )
        this.$router.push({name: 'chats.show', params: {id: result.id}})
      },
      loadUsers(){
        UsersService.get_list()
          .then(
            response => {
              this.users = response
            },
            error => Promise.reject(error)
          )
      },
      logout() {
        this.$store.dispatch('auth/logout').then(
          () => {
            this.$router.push({
              name: 'login_page',
            })
          }
        )
      },
      chatListUpdate(response){
        let chat = JSON.parse(response.data)

        if(chat.to_delete){
          this.chats = arrayRemove(this.chats, chat)
          return
        }

        let isInList = this.chats.filter(elem => {
          if(elem.id == chat.id){
            return elem
          }
        }).length > 0

        if (isInList){
          this.chats = arrayRemove(this.chats, chat)
        }
        this.chats.unshift(chat)
      }
    }
  }
</script>

<template>
  <notifications position="bottom left" />
  <div class="container-fluid">
    <div class="row" v-if="isAuthenticated">
      <aside class="col-3 px-3 py-5 bg-light sidebar">
        <div class="row">
          <div class="col-12">
            <ul class="navbar-nav mr-auto">
              <li @click="openProfile()" class="cursor-pointer">
                <b>{{ getUserName }}</b>
              </li>
            </ul>
          </div>
          <div class="col-12 mt-3">
            <button class="btn btn-outline-secondary w-100" type="button" @click="logout()">Logout</button>
          </div>
        </div>
        <hr>
        <ul class="navbar-nav mr-auto">
          <li @click="openModal()" class="cursor-pointer">
            <b>Create new chat</b>
          </li>
        </ul>
        <hr>
        <div class="chat-list">
          <ul class="navbar-nav mr-auto" v-for="chat in chats" :key="chat.id">
            <ChatItem :chat="chat" />
          </ul>
        </div>
      </aside>
      <section class="col-9" style="overflow: hidden;">
        <RouterView :key="$route.fullPath" />
      </section>
    </div>
    <div v-else>
      <RouterView :key="$route.fullPath" />
    </div>
  </div>
  <div v-if="isAuthenticated" class="modal fade" id="modalCreateChat" tabindex="-1" aria-labelledby="modalCreateChatLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
          <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Create new chat with user</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
            <div class="modal-body">
              <div class="row" v-for="user in users" :key="user.id">
                <UserItem @userTriggered="createChat" :user="user" />
              </div>
            </div>
          </div>
      </div>
    </div>
</template>
