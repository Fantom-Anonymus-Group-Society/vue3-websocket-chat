<template>
    <notifications position="bottom left"/>
    <div class="container mt-5" style="overflow-x: hidden;">
      <h1 class="text-center">
        {{ $t('users') }}
      </h1>
      <div class="row justify-content-center align-items-center">
          <div class="col-md-9">
            <h3 class="text-center my-3">
                <button type="button" @click="openModalCreate()" class="btn btn-success w-100"><i class="fa fa-plus"></i></button>
            </h3>
          </div>
        <div class="col-md-9 cursor-pointer" @click="openModalEdit(user)" v-for="user in users" :key="user">
          <UserItem :user="user" @removeUser="removeUserFromList"/>
        </div>
        <div class="col-md-9 my-5">
            <PaginationComponent @changePage="reloadUsers" :key="dynamic_key" :pagination="pagination" :current_page="current_page" />
        </div>
      </div>
    </div>
    <div class="modal fade" id="modalCreate" tabindex="-1" aria-labelledby="modalCreateLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel"><i class="fa fa-user-plus"></i></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6 my-3">
                        <div class="form-group">
                            <label for="username_create">{{ $t('username') }}</label>
                            <input id="username_create" type="text" v-model="modal_form.username" class="my-2 form-control">
                        </div>
                    </div>
                    <div class="col-md-6 my-3">
                        <div class="form-group">
                            <label for="password_create">{{ $t('password') }}</label>
                            <input id="password_create" type="password" v-model="modal_form.password" class="my-2 form-control">
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="form-group">
                            <label for="first_name_create">{{ $t('first_name') }}</label>
                            <input id="first_name_create" type="text" v-model="modal_form.first_name" class="my-2 form-control">
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="form-group">
                            <label for="last_name_create">{{ $t('last_name') }}</label>
                            <input id="last_name_create" type="text" v-model="modal_form.last_name" class="my-2 form-control">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="is_staff_create">
                                <input id="is_staff_create" type="checkbox" v-model="modal_form.is_staff" class="my-2">
                                {{ $t('staff') }}
                            </label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="is_superuser_create">
                                <input id="is_superuser_create" type="checkbox" v-model="modal_form.is_superuser" class="my-2">
                                {{ $t('superuser') }}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" @click="create()" class="btn btn-success w-100">{{ $t('save') }}</button>
            </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="modalEdit" tabindex="-1" aria-labelledby="modalEditLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">#{{ modal_form.id }} {{ modal_form.first_name }} {{ modal_form.last_name }}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6 my-3">
                        <div class="form-group">
                            <label for="username">{{ $t('username') }}</label>
                            <input id="username" type="text" v-model="modal_form.username" class="my-2 form-control">
                        </div>
                    </div>
                    <div class="col-md-6 my-3">
                        <div class="form-group">
                            <label for="password">{{ $t('password') }}</label>
                            <input id="password" type="password" v-model="modal_form.password" class="my-2 form-control">
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="form-group">
                            <label for="first_name">{{ $t('first_name') }}</label>
                            <input id="first_name" type="text" v-model="modal_form.first_name" class="my-2 form-control">
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="form-group">
                            <label for="last_name">{{ $t('last_name') }}</label>
                            <input id="last_name" type="text" v-model="modal_form.last_name" class="my-2 form-control">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="is_staff">
                                <input id="is_staff" type="checkbox" v-model="modal_form.is_staff" class="my-2">
                                {{ $t('staff') }}
                            </label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="is_superuser">
                                <input id="is_superuser" type="checkbox" v-model="modal_form.is_superuser" class="my-2">
                                {{ $t('superuser') }}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" @click="update()" class="btn btn-success w-100">{{ $t('save') }}</button>
            </div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import UserItemComponent from '../../components/UserItemComponent.vue'
  import PaginationComponent from '../../components/PaginationComponent.vue'
  import UserService from '../../services/api_services/users_service'
  
  export default {
    data(){
      return {
        users: [],
        selected_user: {
            id: 0,
            first_name: null,
            last_name: null,
            is_staff: null,
            is_superuser: null,
            username: null,
            password: null,
        },
        pagination: null,
        current_page: this.$route.query.page || 1,
        dynamic_key: 0,
        modal: null,
        create_modal: null,
        modal_form: {
            id: 0,
            first_name: null,
            last_name: null,
            is_staff: null,
            is_superuser: null,
            username: null,
            password: null,
        },
      }
    },
    mounted() {
        this.loadUsers()
        this.create_modal = new bootstrap.Modal('#modalCreate', {})
        this.modal = new bootstrap.Modal('#modalEdit', {})
    },
    components: {
      'UserItem': UserItemComponent,
      'PaginationComponent': PaginationComponent,
    },
    methods: {
        reloadUsers(page){
            this.current_page = page
            window.scrollTo(0,0)
            this.loadUsers()
        },
        async loadUsers(){
            let result = await UserService.get_list({page: this.current_page}).then(
                response => {
                    return response
                },
                error => {
                    this.$router.push({
                        name: 'home_page',
                        params: {lang: this.$i18n.locale}
                    })
                    return Promise.reject(error)
                }
            )
            this.users = result.users
            this.pagination = result.pagination
            this.dynamic_key += 1
        },
        openModalCreate(){
            this.create_modal.show()
        },
        openModalEdit(user){
            this.selected_user = user
            this.modal_form = {...this.selected_user}
            this.modal.show()
        },
        logout() {
            this.$store.dispatch('auth/logout').then(
            () => {
                this.$router.push({
                    name: 'login_page',
                    params: {
                        lang: this.$i18n.locale
                    }
                })
            }
            )
        },
        removeUserFromList(user){
            let index = this.users.indexOf(user)
            if (index > -1){
                this.users.splice(index, 1)
            }
        },
        async create(){
            if(
                this.modal_form.first_name == null ||
                this.modal_form.last_name == null ||
                this.modal_form.username == null ||
                this.modal_form.password == null 
                ){
                    this.$notify({
                        title: 'Form error',
                        text: this.$t('fill_data'),
                        type: 'error',
                    })
                    return
                }
                let {id, ...params} = this.modal_form
                params.is_staff = this.modal_form.is_staff == null || this.modal_form.is_staff == undefined || ! this.modal_form.is_staff ? false : true
                params.is_superuser = this.modal_form.is_superuser == null || this.modal_form.is_superuser == undefined || ! this.modal_form.is_superuser ? false : true
                let user = await UserService.store(params).then(
                    response => {
                        return response
                    },
                    error => {
                        return Promise.reject(error)
                    }
                )
                this.users.push(user)
                this.modal_form = {
                    id: 0,
                    first_name: null,
                    last_name: null,
                    is_staff: null,
                    is_superuser: null,
                    username: null,
                    password: null,
                }
                this.create_modal.hide()
        },
        update(){
            UserService.update(this.modal_form).then(
                response => {
                    if(this.selected_user.id == this.$store.state.auth.user.id){
                        this.logout()
                    }

                    this.selected_user.first_name = this.modal_form.first_name
                    this.selected_user.last_name = this.modal_form.last_name
                    this.selected_user.is_staff = this.modal_form.is_staff
                    this.selected_user.is_superuser = this.modal_form.is_superuser
                    this.selected_user.username = this.modal_form.username

                    this.modal_form = {
                        id: 0,
                        first_name: null,
                        last_name: null,
                        is_staff: null,
                        is_superuser: null,
                        username: null,
                        password: null,
                    }
                    this.modal.hide()
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
  