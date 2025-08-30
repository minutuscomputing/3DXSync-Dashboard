<template>
  <div class="mt-6">
    <v-container class="pa-6" fluid>
      
      <v-dialog v-model="showFilterDialog" max-width="500">
        <v-card>
          <v-card-title class="dialog-title">Select Date Range</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="startDate"
              label="Start Date"
              type="date"
              variant="outlined"
              class="mb-4"
              density="comfortable"
            />
            <v-text-field
              v-model="endDate"
              label="End Date"
              type="date"
              variant="outlined"
              density="comfortable"
            />
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="primary" variant="flat" @click="showFilterDialog = false">
              Apply
            </v-btn>
            <v-btn variant="text" @click="showFilterDialog = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

     
      <v-card class="elevation-3">
        <v-card class="elevation-0">
          <div class="d-flex align-center justify-space-between px-4 py-3 border-bottom">
            <h2 class="text-h6 font-weight-bold mb-0">Dashboard</h2>
            <v-btn color="primary" prepend-icon="mdi-calendar" @click="showFilterDialog = true">
              Filter by Date
            </v-btn>
          </div>
        </v-card>

      
        <v-card-subtitle class="pt-2 px-4">
          <v-text-field
            v-model="search"
            label="Search Change Orders"
            variant="outlined"
            clearable
            prepend-inner-icon="mdi-magnify"
            hide-details
            density="compact"
          />
        </v-card-subtitle>

       
        <v-card-text class="pa-4">
          <v-data-table
            :headers="tableHeaders"
            :items="filteredItems"
            :search="search"
            :items-per-page="itemsPerPage"
            :loading="loading"
            class="elevation-1 rounded-lg"
            density="compact"
            item-value="id"
          >
            <template #no-data>
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

<style scoped>
  .v-data-table {
    border-radius: 10px;
  }

  .v-card-title,
  .dialog-title {
    background-color: #f0f0f0;
    padding: 16px;
    font-weight: 600;
    border-bottom: 1px solid #e0e0e0;
  }

  .v-dialog .v-card {
    border-radius: 12px;
  }

  .v-btn {
    text-transform: capitalize;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  .border-bottom {
    border-bottom: 1px solid #e0e0e0;
  }
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ChangeOrderService from "@/services/ChangeOrder/ChangeOrderService";
import { tableHeaders } from '@/constant/dashboardTableHeaders'

const coList = ref([]);
const search = ref('');
const loading = ref(false);
const itemsPerPage = 10;

const showFilterDialog = ref(false);
const startDate = ref('');
const endDate = ref('');

onMounted(async () => {
  try {
    loading.value = true;
    coList.value = await ChangeOrderService.fetchImplementedCOs();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const filteredCoList = computed(() => {
  if (!startDate.value || !endDate.value) {
    return coList.value;
  }

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  end.setHours(23, 59, 59, 999);

  return coList.value.filter(item => {
    if (!item.date) return false;
    const [day, month, year] = item.date.split('.');
    const itemDate = new Date(`${year}-${month}-${day}`);
    return itemDate >= start && itemDate <= end;
  });
});

const filteredItems = computed(() => filteredCoList.value);

</script>
