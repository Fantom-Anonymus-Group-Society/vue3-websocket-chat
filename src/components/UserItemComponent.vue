<template>
    <div class="user-item cursor-pointer" @click="userClicked()">
            <div class="row">
                <div class="col-12 text-dark text-decoration-none p-3">
                    <b>{{ user.first_name }} {{ user.last_name }}</b>
                    <br>
                    <sup class="text-secondary">{{ user.username }}</sup>
                </div>
            </div>
        </div>
</template>
<script>
    export default {
        name: 'UserItemComponent',
        props: {
            user: {
                type: Object,
            }
        },
        methods: {
            userClicked(){
                this.$emit('userTriggered', this.user)
            }
        }
    }
</script>
