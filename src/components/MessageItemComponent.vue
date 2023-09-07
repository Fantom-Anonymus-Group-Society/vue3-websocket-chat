<template>
    <div class="message-item">
        <div class="row">
            <div class="col-12 text-dark text-decoration-none p-3">
                <b>{{ message.user.first_name }} {{ message.user.last_name }}</b>
                <br>
                <p class="text-dark">{{ message.content }}</p>
                <sup>{{ message.created_at }}</sup>
                <hr>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'MessageItemComponent',
        props: {
            message: {
                type: Object,
            }
        },
        methods: {

        }
    }
</script>
