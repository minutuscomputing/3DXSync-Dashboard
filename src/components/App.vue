<template>
 <v-app>
        <v-container  class="pa-6" style="max-width: 80%;">
            <v-card class="pa-9 elevation-3">
                <HeaderContainer />
                <CO_Dashboard />
             </v-card>
            <v-snackbar v-model="snackbar.visible" :color="snackbar.color" :timeout="snackbar.timeout" location="top center">
              {{ snackbar.message }}
           </v-snackbar>
        </v-container>

    </v-app>
</template>

<script setup>
import CO_Dashboard from './CO_Dashboard.vue';
import HeaderContainer from './HeaderContainer.vue';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global';
const globalStore = useGlobalStore();
        const { snackbar } = storeToRefs(globalStore);
</script>

<style scoped>

</style>

