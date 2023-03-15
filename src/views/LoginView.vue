<template>
    <div id="loginArea">
        <h1>Naive Test</h1>
        <n-form-item label="用户名" :rule="rule">
            <n-input v-model:value="formValue.email" placeholder="" />
        </n-form-item>
        <n-form-item label="密码" :rule="rule">
            <n-input type="password" show-password-on="mousedown" v-model:value="formValue.password" placeholder="" />
        </n-form-item>
        <n-form-item>
            <n-button @click="doLogin">登录</n-button>
        </n-form-item>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NInput, NButton, NFormItem } from "naive-ui";
import axios from '../axiosconfig'
import router from '../router/index'

const formValue = ref({
    email: "xuwen.zhai@cloudpense.com",
    password: "123456",
});

const rule = ref({
    required: true,
    trigger: ['blur', 'input'],
    message: '必填'
})

function doLogin() {
    axios.post('/users/login', formValue.value)
        .then(function (response) {
            // console.log(response.data)
            localStorage.setItem('access_token', response.data.access_token)
            router.push('/index')
        })
        .catch(function (response) {
            console.log(response)
        });
}
</script>

<style>
#loginArea {
    margin: 0 auto;
    padding-top: 100px;
    width: 300px;
    height: 500px;
    text-align: left;
}
</style>
