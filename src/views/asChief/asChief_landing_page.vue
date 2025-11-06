<template>

    <div class="flex h-2">
        <Header />
        <UserBtn />
    </div>
      <div class="background-container flex justify-center items-center ">
        <div class="flex flex-row justify-center items-center gap-10 p-5">
            <!-- Monitoring and Technical Services Section -->
            <button
              class="flex flex-col justify-center items-center text-center gap-3 text-xl font-medium rounded-lg h-60 w-72 text-white bg-green-800 hover:bg-green-700 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
              @click="navigateToMTSS">
              <!-- Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3v18h18V3H3zm3 14h12M6 10h12M6 6h12"/>
              </svg>
              <!-- Text -->
              <span>Monitoring and Technical Services Section</span>
            </button>

            <!-- Mining Tenement Evaluation Section -->
            <button
              class="flex flex-col justify-center items-center text-center gap-3 text-xl font-medium rounded-lg h-60 w-72 text-white bg-green-800 hover:bg-green-700 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
              @click="navigateToMTES">
              <!-- Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2l4-4m1-5H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z"/>
              </svg>
              <!-- Text -->
              <span>Mining Tenement Evaluation Section</span>
            </button>

            <!-- Mineral Lands Survey Section -->
            <button
              class="flex flex-col justify-center items-center text-center gap-3 text-xl font-medium rounded-lg h-60 w-72 text-white bg-green-800 hover:bg-green-700 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
              @click="navigateToMLSS">
              <!-- Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 6l9 6l9-6M3 6v12h18V6M3 18l9-6l9 6"/>
              </svg>
              <!-- Text -->
              <span>Mineral Lands Survey Section</span>
            </button>

            </div>
      </div>
    </template>
    
    <script setup>
    import Header from '../../components/header.vue'
    import UserBtn from '../../components/user-dbbtn.vue'
    </script>
    
    <script>
    
    export default {
      methods: {
        navigateToMTSS() {
          // Use router.push to navigate to '/applicationpage'
          window.location.href = 'mmd/mtss';
        },
        navigateToMTES() {
          // Use router.push to navigate to '/permitpage'
          window.location.href = 'mmd/mtes';
        },
        navigateToMLSS() {
          // Use router.push to navigate to '/permitpage'
          window.location.href = 'mmd/mlss';
        },
      }
    };
    </script>
    
    <style>
    .title {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }
    
    .button {
      padding: 0.5rem 1rem;
      width: 1000px;
      border: none;
      flex: 1 2 8rem;
    
    }
    
    .button:hover {
      transition: 0.3s;
    }
  
    .background-container {
    background-image: url('/src/assets/bg-img.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    min-height: 100vh;
  }
    </style>