<template>
  <div class="flex h-2">
      <Header />
      <UserBtn />
  </div>

  <div class="background-container flex justify-center items-center">
    <div
          class="flex justify-center items-center w-[92%] md:w-[75%] lg:w-[60%] xl:w-[50%]
              bg-white/30 backdrop-blur-sm border border-white/10
              rounded-2xl shadow-2xl p-10">
      <div class="new-app-content">
        <!-- <h1 style="font-size: 50px; margin-bottom: 30px; margin-top: -150px;">New Applications</h1> -->
        <h1 class="text-5xl md:text-6xl font-extrabold tracking-wide text-green-900 drop-shadow-lg mb-10 -mt-44">
                    New Application
        </h1>
        <div style="display: flex; justify-content: center;">

          <div class="button-container1">
            <button @click="navigateToFTTAdashboard()" class="button1 text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 p-5 m-2 h-auto text-base rounded cursor-pointer font-normal mb-5">
              Financial or Technical Assistance Agreement
            </button>
            <button @click="navigateToMPSAdashboard()" class="button1 text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 p-5 m-2 h-auto text-base rounded cursor-pointer font-normal mb-5">
              Mineral Production Sharing Agreement
            </button>
            <button @click="navigateToEPdashboard()" class="button1 text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 p-5 m-2 h-auto text-base rounded cursor-pointer font-normal mb-5">
              Exploration Permit
            </button>
            <button @click="navigateToMPPdashboard()" class="button1 text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 p-5 m-2 h-auto text-base rounded cursor-pointer font-normal mb-5">
              Mineral Processing Permit
            </button>
            <button @click="navigateToISAGdashboard()" class="button1 text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 p-5 m-2 h-auto text-base rounded cursor-pointer font-normal mb-5">
              Industrial Sand and Gravel Permit
            </button>
            <button @click="navigateToOTPdashboard()" class="button1 text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 p-5 m-2 h-auto text-base rounded cursor-pointer font-normal mb-5">
              Ore Transport Permit
            </button>
          </div>

          <div class="button-container2">
            <button @click="navigateToMBdashboard()" class="button1 text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 p-5 m-2 h-auto text-base rounded cursor-pointer font-normal mb-5">
              Declaration of Minahang Bayan
            </button>
            <button @click="navigateToSSMCdashboard()" class="button1 text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 p-5 m-2 h-auto text-base rounded cursor-pointer font-normal mb-5">
              Small-Scale Mining Contract
            </button>
            <button @click="navigateToMPLdashboard()" class="button1 text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 p-5 m-2 h-auto text-base rounded cursor-pointer font-normal mb-5">
              Mineral Processor’s License
            </button>
            <button @click="navigateToAMTRDdashboard()" class="button1 text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 p-5 m-2 h-auto text-base rounded cursor-pointer font-normal mb-5">
              Accreditation as Mineral Trader, Retailer, and Dealer
            </button>
            <button @click="navigateToMOEPdashboard()" class="button1 text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 p-5 m-2 h-auto text-base rounded cursor-pointer font-normal mb-5">
              Mineral Ore Export Permit
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import Header from '../../components/header.vue'
import UserBtn from '../../components/user-dbbtn.vue'
</script>

<script>
import router from '../../router/index';

export default {
  methods: {
    navigateToFTTAdashboard() {
      router.push('/mmd/mtes/new-application/ftta');
    },
    navigateToEPdashboard() {
      router.push('/mmd/mtes/new-application/ep');
    },
    navigateToMPSAdashboard() {
      router.push('/mmd/mtes/new-application/mpsa');
    },
    navigateToISAGdashboard() {
      router.push('/mmd/mtes/new-application/isag');
    },
    navigateToMBdashboard() {
      router.push('/mmd/mtes/new-application/mb');
    },
    navigateToMPLdashboard() {
      router.push('/mmd/mtes/new-application/mpl');
    },
    navigateToMPPdashboard() {
      router.push('/mmd/mtes/new-application/mpp');
    },
    navigateToOTPdashboard() {
      router.push('/mmd/mtes/new-application/otp');
    },
    navigateToSSMCdashboard() {
      router.push('/mmd/mtes/new-application/ssmc');
    },
    navigateToAMTRDdashboard() {
      router.push('/mmd/mtes/new-application/amtrd');
    },
    navigateToMOEPdashboard() {
      router.push('/mmd/mtes/new-application/moep');
    },
  }
};
</script>

<style scoped>
.background-container {
  background-image: url('/src/assets/bg-img.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh;
}

.panel {
  display: flex;
  justify-content: center;
  align-items: center;
}

.new-app-content {
  text-align: center;
  margin-top: 200px;
}

.new-app-content h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.button-container1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 50px;
}

.button-container2 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button1 {
  width: 100%;
  max-width: 415px;
  border: none;
  transition: all 0.3s ease;
}

</style>
