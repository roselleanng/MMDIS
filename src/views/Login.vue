<template>
    <taas />

    <div class="panel flex justify-center items-center ">
        <div class="panel1 h-auto flex flex-row justify-center items-center mt-32">
            <img :src="mgb" class="img123" style="width: 330px;" />
            <div class="login -ml-16 bg-green-800">
                <div style="margin-left: 40px;margin-top: 30px;margin-bottom: 20px;">
                    <h1 style="font-weight: 700; font-size: 25px;" class="text-white">Welcome Back!</h1>
                    <p style="font-size: 15px;" class="text-white">Login to access the MGB-X </p>
                    <p style="font-size: 15px;" class="text-white">MMD Information System:</p>
                </div>
                <form>
                    <div class="inputfield flex flex-col">
                        <input v-model="form.username" id="username" name="username" type="username"
                            autocomplete="username" placeholder="Username"
                            class="pl-2 drop-shadow-lg py-2 mx-10 mb-4 w-80 rounded-md" />
                        <div class="relative">
                            <input v-model="form.password" id="password" name="password" :type="passwordType"
                                autocomplete="password" placeholder="Password"
                                class="pl-2 drop-shadow-lg py-2 mx-10 mb-4 w-80 rounded-md pr-10"
                                @keyup.enter="handleLogin" />
                            <button type="button" @click="togglePasswordVisibility"
                                class="absolute right-12 top-[35%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </form>
                <div class="third flex flex-col items-center pt-16">
                    <button class="buttonlogin text-black bg-amber-400 hover:bg-amber-100 hover:text-gray-950 pl-12 pr-12 pb-2 pt-2" :disabled="submitting" @click="handleLogin">
                        <span v-if="submitting">
                            <!-- Loading Spinner (you can use any loading spinner here) -->
                            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                                <path d="M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0z" stroke="currentColor" stroke-width="4" class="opacity-75"></path>
                            </svg>
                        </span>
                        <span v-else>
                            LOGIN
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import taas from '../components/header.vue'
import mgb from '../assets/icons/mgb.png'
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { API_BASE_URL } from '../config'

const isValid = ref(false);
const isUsername = ref(false);
const pleaseWait = ref(false);
const submitting = ref(false);
const error = ref('');
const showPassword = ref(false);

const router = useRouter();
const form = ref({
    username: '',
    password: ''
});

const passwordType = computed(() => showPassword.value ? 'text' : 'password');

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};


/**
 * Handle user login
 * Note: Passwords should ideally be handled securely via hashed authentication in backend.
 */
const handleLogin = async () => {
    const passvalid = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-]{7,}$/;

    if (form.value.username === '' && form.value.password === '') {
        alert('Both username and password are required');
        return;
    }

    if (form.value.username === '') {
        alert('Input Username');
        return;
    }

    if (form.value.password === '') {
        alert('Input Password');
        return;
    }

    pleaseWait.value = true;
    submitting.value = true;

    try {
        const response = await axios.get(`${API_BASE_URL}/get_accounts/`);
        const account = response.data.find(acc => acc.username === form.value.username && acc.password === form.value.password);

        if (!account) {
            alert('The email or password you entered did not match our records. Please double-check and try again.');
            return;
        }

        // If the account is found, store the token and redirect
        localStorage.setItem('authToken', 'someGeneratedToken'); // Replace with real token from backend if available in future
        localStorage.setItem('username', form.value.username);

        pleaseWait.value = false;
        switch (account.section) {
            case 'asViewer':
                router.push("/asViewer");
                break;
            case 'mmd':
                router.push("/mmd");
                break;
            case 'mtes':
                router.push("/mtes");
                break;
            case 'mtss':
                router.push("/mmd/mtss");
                break;
            case 'mlss':
                router.push("/mmd/mlss");
                break;
            default:
                router.push("/default-page");
                break;
        }
    } catch (error) {
        console.error('Login error:', error);
        let errorMsg = 'Login error, please try again!';
        if (error.response) {
            errorMsg = `Login failed: ${error.response.data.message || JSON.stringify(error.response.data)}`;
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        } else if (error.request) {
            errorMsg = 'No response received from server.';
            console.error('No response received:', error.request);
        } else {
            errorMsg = `Error setting up request: ${error.message}`;
            console.error('Error setting up request:', error.message);
        }
        alert(errorMsg);
    } finally {
        pleaseWait.value = false;
        submitting.value = false;
    }
}
</script>


<style scoped>
.panel1 {
    width: 600px;
}

.login {
    width: 500px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    height: 450px;
   
}

.img123 {
    height: 450px;
    width: 300px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}


.buttonlogin {
    border-radius: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: bold;
}
</style>