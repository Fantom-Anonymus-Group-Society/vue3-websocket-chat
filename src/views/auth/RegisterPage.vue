<template>
    <div class="container">
        <notifications position="bottom left"/>
        <div class="row justify-content-center align-items-center py-5 my-5">
            <div class="col-md-3 text-center">
                <h3 class="my-4">Register new user</h3>
                <Form @submit="handleRegister" :validation-schema="schema">
                    <div class="form-group my-3 row">
                        <div class="col-6">
                            <Field placeholder="First name" name="first_name" type="text" class="form-control text-center" />
                            <ErrorMessage name="first_name" class="error-feedback" />
                        </div>
                        <div class="col-6">
                            <Field placeholder="Last name" name="last_name" type="text" class="form-control text-center" />
                            <ErrorMessage name="last_name" class="error-feedback" />
                        </div>
                    </div>
                    <div class="form-group my-3">
                        <Field placeholder="Username" name="username" type="text" class="form-control text-center" />
                        <ErrorMessage name="phone" class="error-feedback" />
                    </div>
                    <div class="form-group my-3">
                        <Field placeholder="Password"  name="password" type="password" class="form-control text-center" />
                        <ErrorMessage name="password" class="error-feedback" />
                    </div>
                    <div class="form-group my-3">
                        <Field placeholder="Confirm password"  name="confirmation" type="password" class="form-control text-center" />
                        <ErrorMessage name="confirmation" class="error-feedback" />
                    </div>
                    <div class="form-group my-3">
                        <p>
                            Already have account? <router-link :to="{name: 'login_page'}">Login</router-link>
                        </p>
                    </div>
                    <p class="text-center">
                        <button class="btn btn-success w-100">Register</button>
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
        name: 'RegisterPage',
        components: {
            Form,
            Field,
            ErrorMessage
        },
        data() {
            const schema = yup.object().shape({
                username: yup.string().required('Username is required'),
                password: yup.string().required('Password is required'),
                first_name: yup.string().required('First name is required'),
                last_name: yup.string().required('Last name is required'),
                confirmation: yup.string().required('Password confirmation is required')
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
            handleRegister(user) {
                if(user.password != user.confirmation){
                    this.$notify({
                            title: 'Auth error',
                            text: "Password and its confirmation are don't match",
                            type: 'error',
                        })
                    return
                }
                this.$store.dispatch('auth/register', user).then(
                    (response) => {
                        this.$router.push({name:'login_page'})
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
