<template>

  <div class="">
    <!-- Header and User Button Section -->
    <div class="flex">
        <Header />
        <UserBtn />
    </div>
  
    <!-- Title Section -->
    <div class="flex flex-col mt-18 justify-center font-bold text-center">
        <h1 class="text-4xl">Exploration Permit</h1>
        <h2 class="text-2xl pt-2">SUMMARY</h2>
    </div>

    <div v-if="viewDetail">
      <viewdetail :detail_id="detail_id" />
    </div>

    <!-- Charts for summary  -->
    <div class="flex flex-row justify-center top-0 left-0 right-0 w-auto mt-8">
      <Pie class="w-1/5 ml-12" :application="application" />
      <BarChart class="ml-8" :application="application" />
    </div>

    <!-- Table list -->
    <div class="w-screen"> 
      <Tableview />
    </div>
  </div>
</template>

<script setup>
import viewdetail from '../../../views/asChief/modal_details/EP-details.vue'
import Header from '../../../components/header.vue'; 
import UserBtn from '../../../components/user-dbbtn.vue'; 
import Pie from '../../../components/MTES/charts/Pie.vue'
import BarChart from '../../../components/MTES/charts/bar.vue'
import Tableview from '../../asChief/tables/EP-table.vue'
import axios from 'axios';
import { API_BASE_URL } from '../../../config'

import { ref, onMounted } from 'vue'

const user = ref();
onMounted(async () => {
  const data = await axios.get(`${API_BASE_URL}/get_accounts/`)
  user.value = data;
})


</script>
<script>
import { ref } from 'vue';

const detail_id = ref('')
const application = 'ep'

const viewDetail = ref(false)
const viewToggle = () => {
  viewDetail.value = true
};

export { viewDetail, viewToggle, detail_id }

</script>

<style scoped>
.textz {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  margin-top: 6%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  font-size: 20px;
}

.text1 {
  align-items: center;
  margin-bottom: 30px;
  font-weight: 700;
}

.text2 {
  font-weight: 00;
}

</style>