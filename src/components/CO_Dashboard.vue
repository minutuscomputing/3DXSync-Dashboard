<template>
 <div class="mt-6">
  <v-container class="pa-6" fluid>
    <v-card class="elevation-3 ">
      <v-card-subtitle>
        <v-text-field
          v-model="search"
          label="Search Change Orders"
          variant="outlined"
          clearable
          prepend-inner-icon="mdi-magnify"
          class="mt-2"
          hide-details
        />
      </v-card-subtitle>

      <v-card-text class="pa-4">
        <v-data-table
          :headers="headers"
          :items="coData"
          :search="search"
          :items-per-page="itemsPerPage"
          :loading="loading"
          class="elevation-1"
          density="compact"
          item-value="id"
        >
          
          <template v-slot:no-data>
            <div class="text-center text-subtitle-1 pa-4 text-grey">
              No change orders found
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</div>  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchImplementedCOs } from '@/services/ChangeOrder/ChangeOrderService' 

const coData = ref([])
const search = ref('')

onMounted(async () => {
  try {
    coData.value = await fetchImplementedCOs()
    console.log("Codata ",coData.value);
    
  } catch (error) {
    console.error('Error fetching COs:', error)
  }
})

const headers = [
  { title: 'CO Number', key: 'coNumber', sortable: true, align: 'start' },
  { title: 'Status', key: 'status', sortable: true, align: 'start' },
  { title: 'Date', key: 'date', sortable: true, align: 'start' },
]

const itemsPerPage = 10
const loading = ref(false)
</script>



<style scoped>
::v-deep(.v-data-table) {
  overflow-y: auto;
  max-height: 450px;
}

::v-deep(.v-data-table__wrapper) {
  overflow-y: auto !important;
  max-height: 400px !important;
}

::v-deep(.v-data-table thead th) {
  background-color: #f5f5f5 !important;
  position: sticky !important;
  top: 0;
  z-index: 1;
  text-align: center !important;
  font-weight: bold;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounceIn {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
}
</style>
