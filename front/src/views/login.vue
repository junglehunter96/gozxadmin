<template>
	<div class="flex flex-col items-center justify-center h-screen">
		<n-form class="w-full max-w-sm" :model="loginForm" :rules="loginRules">
			<n-form-item label="用户账号" path="username">
				<n-input v-model:value="loginForm.username" placeholder="请输入账号" />
			</n-form-item>
			<n-form-item label="密码" path="password">
				<n-input type="password" v-model:value="loginForm.password" placeholder="请输入密码" />
			</n-form-item>
			<n-form-item>
				<n-button type="primary" block @click="handleLogin">登录</n-button>
			</n-form-item>
		</n-form>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAdminStore, type AdminState } from '@/store/modules/useAdminStore'; // 假定你有一个用于状态管理的 store
import { request } from '@/request'; // 假定你有一个封装的 request 函数
import { useRouter } from 'vue-router';
import { NForm, NFormItem, NInput, NButton, type FormInst } from 'naive-ui';

const adminStore = useAdminStore();
const router = useRouter();
const loginForm = ref({
	username: '',
	password: '',
});
// 创建对应的登陆规则
const loginRules = {
	username: [
		{
			required: true,
			message: '请输入用户名',
			trigger: ['input', 'blur'],
		},
	],
	password: [
		{
			required: true,
			message: '请输入密码',
			trigger: ['input', 'blur'],
		},
	],
};
const loginFormRef = ref<FormInst | null>(null);

const handleLogin = async (e: Event) => {
	console.log('handleLogin')
	e.preventDefault(); // 防止默认的表单提交
	if (!loginFormRef.value) return;

	const { validate } = loginFormRef.value;
	validate(async (errors) => {
		if (errors) {
			return;
		}
		const [response, error] = await request<AdminState>({
			method: 'post',
			url: '/api/v1/login', // 请根据实际 API 地址修改
			data: loginForm.value,
		});
		console.log('response', response)
		if (error === null) {
			adminStore.login({
				token: response?.token,
				username: response?.username,
			});
			router.push('/');
		}
		else {
			// 显示错误信息...
			console.error(error || '登录失败');
		}
	});

} 
</script>

<style scoped>
/* 添加页面和组件的适当样式 */
</style>
