<template>
    <div class="container">
        <notifications position="bottom left"/>
        <div class="row justify-content-center align-items-center py-5 my-5">
            <div class="col-md-3 text-center">
                <h3 class="my-4">Login into your account</h3>
                <Form @submit="handleLogin" :validation-schema="schema">
                    <div class="form-group my-3">
                        <Field placeholder="Username" name="username" type="text" class="form-control text-center" />
                        <ErrorMessage name="phone" class="error-feedback" />
                    </div>
                    <div class="form-group my-3">
                        <Field placeholder="Password"  name="password" type="password" class="form-control text-center" />
                        <ErrorMessage name="password" class="error-feedback" />
                    </div>
                    <div class="form-group my-3">
                        <p class="w-100">
                            Haven't account yet? <router-link :to="{name: 'register_page'}">Register</router-link>
                        </p>
                    </div>
                    <p class="text-center">
                        <button class="btn btn-success w-100">Login</button>
                    </p>
                </Form>
            </div>
        </div>
    </div>
</template>
<script>
    import { Form, Field, ErrorMessage } from "vee-validate";
    import * as yup from "yup";

    export default {
        name: 'LoginPage',
        components: {
            Form,
            Field,
            ErrorMessage
        },
        data() {
            const schema = yup.object().shape({
                username: yup.string().required('Username is required'),
                password: yup.string().required('Password is required'),
            })
            return {
                schema,
            }
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.status.is_authenticated
            }
        },
        mounted(){
            if(this.isAuthenticated){
                this.$router.push({name:'index'})
            }
        },
        methods: {
            handleLogin(user) {
                this.$store.dispatch('auth/login', user).then(
                    (response) => {
                        this.$router.push({name:'index'})
                        setTimeout(() => {
                            window.location.reload()
                        }, 1)
                    },
                    (error) => {
                        this.$notify({
                            title: 'Auth error',
                            text: error.response.data.detail,
                            type: 'error',
                        })
                    }
                )
            }
        }
    }
</script>
