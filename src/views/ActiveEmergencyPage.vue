<template>
    <div class="d-flex">
        <div class="col-9">
            <div v-if="!is_location_permitted">
                <h1 class="text-center">{{ $t('set_geolocation_on') }}</h1>
            </div>
            <div v-else>
                <div>
                    <div style="overflow:hidden;resize:none;max-width:100%;width:100%;height:100vh;">
                        <div id="google-maps-canvas" style="height:100%; width:100%;max-width:100%;">
                            <iframe style="height:100%;width:100%;border:0;" frameborder="0" :src="mapSrc(emergency)" :key="map_key"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-3 p-3">
            <h3>
                #{{ emergency.id }}: {{ emergency.address }}
            </h3>
            <h3>
                <ul>
                    <li>
                        <a class="text-decoration-none" :href="`tel:${cropPlusPhone(emergency.phone)}`">
                            +{{ cropPlusPhone(emergency.phone) }}
                        </a>
                    </li>
                    <li>
                        {{ emergency.address }}
                    </li>
                    <li>
                        {{ $t('operator') }}: {{ emergency.operator?.first_name }} {{ emergency.operator?.last_name }}
                    </li>
                    <li>
                        {{ $t('fighter') }}: {{ emergency.responsible?.first_name }} {{ emergency.responsible?.last_name }}
                    </li>
                </ul>
            </h3>
            <button type="button" @click="finish()" class="w-100 btn btn-success">{{ $t('finish') }}</button>
        </div>
    </div>
</template>

<script>
    import {SOCKET_HOST} from '../../env'
    import EmergenciesService from '../services/api_services/emergencies_service'

    export default {
        data() {
            return {
                emergency: {
                    id: 0,
                    destination: null,
                    car_origin: null,
                    phone: null,
                    address: null,
                    operator: {
                        first_name: null,
                        last_name: null,
                    },
                    responsible: {
                        first_name: null,
                        last_name: null,
                        car_number: null
                    },
                    is_active: null,
                    created_at: null,
                    finished_at: null,
                },
                map_key: 0,
                current_coordinates: null,
                is_location_permitted: navigator.geolocation ? true : false,
                interval: null
            }
        },
        async created(){
            let emergency = await this.loadEmergency()
            if(this.$store.state.auth.user.is_superuser || this.$store.state.auth.user.is_staff){
                this.$router.push({
                    name: 'home_page',
                    params: {
                        lang: this.$i18n.locale
                    }
                })
            }
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.setCurrentLocation, this.returnToMainPage);
            }
            const connection = new WebSocket(`${SOCKET_HOST}/api/emergencies/id=${emergency.id}`)
            connection.onmessage = this.updateLocationMap
            connection.onopen = this.interval = setInterval(() => {
                connection.send(this.current_coordinates)
            }, 5000)
        },
        methods: {
            mapSrc(emergency){
                return `https://www.google.com/maps/embed/v1/directions?origin=${emergency.car_origin}&destination=${emergency.destination}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`
            },
            cropPlusPhone(phone){
                return phone != null ? phone.replace('+', '') : phone
            },
            async loadEmergency() {
                let result = await EmergenciesService.get_active().then(
                    response => {
                        return response
                    },
                    error => {
                        this.$router.push({
                            name: 'home_page',
                            params: {
                                lang: this.$i18n.locale
                            }
                        })
                        return Promise.reject(error)
                    }
                )
                this.emergency = result
                return result
            },
            setCurrentLocation(location){
                this.is_location_permitted = true
                this.current_coordinates = location.coords.latitude.toString() + ',' + location.coords.longitude.toString()
            },
            updateLocationMap(response){
                let emergency = JSON.parse(response.data)
                this.current_coordinates = emergency.car_origin
                this.mapSrc(emergency)
                this.map_key += 1
            },
            finish(){
                if(confirm(this.$t('are_you_sure'))){
                    clearInterval(this.interval)
                    EmergenciesService.update({
                        id: this.emergency.id,
                        is_active: false,
                    }).then(
                        response => {
                            this.$router.push({
                                name: 'home_page',
                                params: {
                                    lang: this.$i18n.locale
                                }
                            })
                            return response
                        },
                        error => Promise.reject(error)
                    )
                }
            }
        }
    }
</script>
<style scoped>
    #google-maps-canvas .text-marker{}
    .map-generator{max-width: 100%; max-height: 100%; background: none;}
</style>
