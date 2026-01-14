<template>
    <Header></Header>
    <UserBtn/>

    <div class="flex w-full justify-center items-start">  
        <!-- Accomplishment Reports Section -->
        <div class="flex flex-col items-center p-8 bg-green-800 mt-18 m-4 rounded-3xl">
            <div class="flex mb-4">
                <img src="../../assets/icons/ar.png" alt="MGBLogo" class="flex justify-center w-24">
                <h1 class="font-bold text-white">Accomplishment Reports</h1>
            </div>
            <div class="flex flex-col">
                <button @click="redirectToOSTC" class="hover:bg-amber-200 bg-amber-400 text-lg mb-4 rounded-xl p-3 cursor-pointer">OSTC</button>
                <button @click="redirectToInventory" class="hover:bg-amber-200 bg-amber-400 text-lg mb-4 rounded-xl p-3 cursor-pointer">Inventory</button>
                <button @click="redirectToWPM" class="hover:bg-amber-200 bg-amber-400 text-lg mb-4 rounded-xl p-3 cursor-pointer">Work Program Monitoring</button>
                <button @click="redirectToMBM" class="hover:bg-amber-200 bg-amber-400 text-lg mb-4 rounded-xl p-3 cursor-pointer">Minahang Bayan Monitoring</button>
                <button @click="redirectToInvestigation" class="hover:bg-amber-200 bg-amber-400 text-lg mb-4 rounded-xl p-3 cursor-pointer">Investigation</button>
                <button @click="redirectToAI" class="hover:bg-amber-200 bg-amber-400 text-lg mb-4 rounded-xl p-3 cursor-pointer">Anti-Illegal</button>
                <button @click="redirectToDMPF" class="hover:bg-amber-200 bg-amber-400 text-lg mb-4 rounded-xl p-3 cursor-pointer">DMPF</button>
                <button @click="redirectToPCMRB" class="hover:bg-amber-200 bg-amber-400 text-lg mb-4 rounded-xl p-3 cursor-pointer">PCMRB Meetings</button>
            </div>
        </div>

        <!-- Databases Section -->
        <div class="flex flex-col items-center p-8 bg-green-800 mt-18 m-4 rounded-3xl">
            <div class="flex mb-4">
                <img src="../../assets/icons/db.png" alt="MGBLogo" class="flex justify-center w-24">
                <h1 class="font-bold text-white">Databases</h1>
            </div>
            <div class="flex flex-col">
                <button @click="redirectToMPSA" class="hover:bg-amber-200 bg-amber-400 w-64 text-lg mb-4 rounded-xl p-3 cursor-pointer">MPSA</button>
                <button @click="redirectToISAG" class="hover:bg-amber-200 bg-amber-400 w-64 text-lg mb-4 rounded-xl p-3 cursor-pointer">ISAG</button>
                <button @click="redirectToEP" class="hover:bg-amber-200 bg-amber-400 w-64 text-lg mb-4 rounded-xl p-3 cursor-pointer">EP</button>
                <button @click="redirectToMPP" class="hover:bg-amber-200 bg-amber-400 w-64 text-lg mb-4 rounded-xl p-3 cursor-pointer">MPP</button>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../../components/header.vue'; // Import Header component
import UserBtn from '../../components/user-dbbtn.vue';
import router from '../../router'; // Import your Vue Router instance

export default {
    components: {
        Header,
        UserBtn,
    },
    methods: {
        redirectToOSTC() {
            router.push('/mtss/ostc');
        },
        redirectToInventory() {
            router.push('/mtss/inventory');
        },
        redirectToWPM() {
            router.push('/mtss/wpm');
        },
        redirectToMBM() {
            router.push('/mtss/mbm');
        },
        redirectToInvestigation() {
            router.push('/mtss/investigation');
        },
        redirectToAI() {
            router.push('/mtss/anti-illegal');
        },
        redirectToDMPF() {
            router.push('/mtss/dmpf');
        },
        redirectToPCMRB() {
            router.push('/mtss/pcmrb');
        },
        redirectToMPSA() {
            router.push('/mtss/mpsa');
        },
        redirectToISAG() {
            router.push('/mtss/isag');
        },
        redirectToEP() {
            router.push('/mtss/ep');
        },
        redirectToMPP() {
            router.push('/mtss/mpp');
        }
    }
}
</script>

<style scoped>
.button-styled {
    background: linear-gradient(to top, #e6b980, #eacda3, #e6b980);
    transition: background-color 0.3s ease;
}

.button-styled:hover {
    background: white;
}



</style>