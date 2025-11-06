<template>

    <div class="flex h-2">
        <Header />
        <UserBtn />
    </div>
      <div class="background-container flex justify-center items-center ">
        <div class="justify-center items-center flex">
          <div class="flex flex-col justify-center content-center p-5" style="border-radius: 25px; width: 80vw; max-width: 700px; height: 300px;">
              <div class="flex justify-center mb-6">
                  <button class="button text-2xl rounded h-24 text-white bg-green-800 hover:bg-green-300 hover:text-gray-950 cursor-pointer ease-in-out duration-300  " @click="navigateToMTSS">Monitoring and Technical Services Section</button>
              </div>
              <div class="flex justify-center mb-6">
                  <button class="button text-2xl rounded h-24 text-white bg-green-800 hover:bg-green-300 hover:text-gray-950 cursor-pointer ease-in-out duration-300 " @click="navigateToMTES">Mining Tenement Evaluation Section</button>
              </div>
              <div class="flex justify-center mb-6">
                  <button class="button text-2xl rounded h-24 text-white bg-green-800 hover:bg-green-300 hover:text-gray-950 cursor-pointer ease-in-out duration-300  " @click="navigateToMLSS">Mineral Lands Survey Section</button>
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

    export default {
      methods: {
        navigateToMTSS() {
          // Use router.push to navigate to '/applicationpage'
          window.location.href = '#';
        },
        navigateToMTES() {
          // Use router.push to navigate to '/permitpage'
          window.location.href = '/asViewer/mtes';
        },
        navigateToMLSS() {
          // Use router.push to navigate to '/permitpage'
          window.location.href = '#';
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
