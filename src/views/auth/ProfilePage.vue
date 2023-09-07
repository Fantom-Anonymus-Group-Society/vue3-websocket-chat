<template>
    <div class="container mt-5" style="overflow-x: hidden;">
        <h1 class="text-center">
            Profile
        </h1>
        <div class="row justify-content-center">
            <div class="col-md-9">
                <ul style="list-style-type: none">
                    <li class="my-3"><b># </b>{{ user.id }}</li>
                    <li class="my-3"><b>IFO </b><br>{{ user.first_name }} {{ user.last_name }}</li>
                    <li class="my-3"><b><i class="fa fa-user"></i> </b><br>{{ user.username }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import ProfileService from "../../services/api_services/profile_service"

    export default {
        name: 'ProfilePage',
        data() {
            return {
                user: {
                    id: 0,
                    first_name: null,
                    last_name: null,
                    username: null,
                },
            }
        },
        mounted(){
            this.loadUser()
        },
        methods: {
            async loadUser(){
                let result = await ProfileService.get_me().then(
                    response => response,
                    error => Promise.reject(error)
                )
                this.user = result
            },
        }
    }
</script>
