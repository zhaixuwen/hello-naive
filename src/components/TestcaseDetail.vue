<template>
    <div class="detailOut">
        <div class="detailArea">
            <n-space vertical>
                <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto"
                    require-mark-placement="right-hanging">
                    <n-form-item label="标题" path="title">
                        <n-input v-model:value="model.title" />
                    </n-form-item>
                    <n-form-item label="描述" path="description">
                        <n-input type="textarea" v-model:value="model.description" />
                    </n-form-item>
                    <n-form-item label="运行环境" path="env_id">
                        <n-select v-model:value="model.env_id" :options="envDomainOptions"></n-select>
                    </n-form-item>
                    <n-form-item label="执行账户" path="execute_account_id">
                        <n-select v-model:value="model.execute_account_id" :options="exeAccountOptions"></n-select>
                    </n-form-item>
                    <n-form-item label="接口" path="interface_id">
                        <n-select v-model:value="model.interface_id" :options="interfaceOptions"></n-select>
                    </n-form-item>
                    <n-form-item label="请求头" path="header">
                        <n-dynamic-input v-model:value="model.header" preset="pair"></n-dynamic-input>
                    </n-form-item>
                    <n-form-item label="Params" path="params">
                        <n-dynamic-input v-model:value="model.params" preset="pair"></n-dynamic-input>
                    </n-form-item>
                    <n-form-item label="请求体" path="body">
                        <n-input type="textarea" v-model:value="model.body" placeholder="请输入JSON对象格式的报文" :rows="10" />
                    </n-form-item>
                </n-form>
            </n-space>
        </div>
        <div class="extraArea">
            <n-space vertical>
                <div>
                    <n-alert title="校验响应JSON填写提示" type="info" closable>
                        1. 输入格式为Json对象<br>
                        2. 包含expected_json(期望的响应Json)和ignore_paths(忽略校验的字段)<br>
                        3. 如无需校验可填写"{}"
                    </n-alert>
                </div>
                <div class="formAssert">
                    <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto"
                        require-mark-placement="right-hanging">
                        <n-form-item label="校验状态码" path="post_assert_code">
                            <n-input v-model:value="model.post_assert_code_show" />
                        </n-form-item>
                        <n-form-item label="校验响应JSON" path="post_assert_json">
                            <n-input type="textarea" v-model:value="model.post_assert_json_show" :rows="10" />
                        </n-form-item>
                    </n-form>
                </div>
                <div class="actions">
                    <n-space justify="end">
                        <n-button @click="saveTestcase">保存</n-button>
                        <n-button v-if="testcaseId" @click="queryTestcaseLogs(testcaseId)">最后一次执行结果</n-button>
                    </n-space>
                </div>
                <div>
                    <n-input v-if="showLog" type="textarea" v-model:value="logContent" :rows="5" disabled/>
                </div>
            </n-space>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import { NForm, NFormItem, NSelect, NSpace, FormInst, NInput, NDynamicInput, NButton, FormRules, NAlert } from 'naive-ui'
import { getEnvDomainListAPI } from '@/requests/env-domain';
import { getExecuteAccountListAPI } from '@/requests/execute-account';
import { getInterfaceListAPI } from '@/requests/interface';
import { createTestcaseAPI, getTestcaseDetailAPI, updateTestcaseAPI, getTestcaseLogAPI } from '@/requests/testcase';
import { useRoute } from 'vue-router';

const envDomainOptions = ref()
const exeAccountOptions = ref()
const interfaceOptions = ref()

const showLog = ref(false)
const logContent = ref('')

type tempObj = {
    id: number
    code: string
    name: string
    domain: string
    path: string
}

getEnvDomainListAPI(0, 0, '').then((resp) => {
    envDomainOptions.value = resp.data.data.map(
        (v: tempObj) => ({
            label: `${v.code} (${v.domain})`,
            value: v.id
        })
    )
})

getExecuteAccountListAPI(0, 0, '').then((resp) => {
    exeAccountOptions.value = resp.data.data.map(
        (v: tempObj) => ({
            label: v.code,
            value: v.id
        })
    )
})

getInterfaceListAPI(0, 0, '').then((resp) => {
    interfaceOptions.value = resp.data.data.map(
        (v: tempObj) => ({
            label: `${v.name} (${v.path})`,
            value: v.id
        })
    )
})

const formRef = ref<FormInst | null>(null)
const model = ref({
    title: '',
    description: '',
    env_id: null,
    execute_account_id: null,
    interface_id: null,
    header: ref([
        {
            key: 'content-type',
            value: 'application/json'
        }
    ]),
    params: ref([
        {
            key: '',
            value: ''
        }
    ]),
    body: ref(''),
    post_assert_code: 200,
    post_assert_json: {},
    post_assert_code_show: "200",
    post_assert_json_show:
        JSON.stringify({
            expected_json: {},
            ignore_paths: "xxx,yyy,zzz"
        }, null, 2)

})

const rules: FormRules = {
    title: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入用例标题'
    },
    env_id: {
        type: 'number',
        required: true,
        trigger: ['blur', 'input'],
        message: '请选择用例运行环境'
    },
    execute_account_id: {
        type: 'number',
        required: true,
        trigger: ['blur', 'input'],
        message: '请选择用例执行用户'
    },
    interface_id: {
        type: 'number',
        required: true,
        trigger: ['blur', 'input'],
        message: '请选择用例继承接口'
    },
    post_assert_code: {
        type: 'number',
        required: true,
        trigger: ['blur', 'input'],
        message: '请填写期望的响应状态码'
    }
}

// 获取路由传的用例id
const uRoute = useRoute();
const testcaseId = Number(uRoute.query.id);
console.log(testcaseId);
// 如果是编辑用例，获取详情并更新页面展示信息
if (testcaseId != undefined && !isNaN(testcaseId)) {
    getTestcaseDetailAPI(testcaseId).then((resp) => {
        console.log(resp.data);
        const detail = resp.data.data;
        model.value.title = detail.title;
        model.value.description = detail.description;
        model.value.env_id = detail.env_id;
        model.value.interface_id = detail.interface_id;
        model.value.execute_account_id = detail.execute_account_id;
        // 处理header
        const newHeader = []
        for (let obj of detail.header) {
            newHeader.push({
                key: obj.name,
                value: obj.value
            })
        }
        model.value.header = newHeader;
        // 处理params
        const newParams = []
        for (let k in detail.params) {
            newParams.push({ key: k, value: detail.params[k] });
        }
        model.value.params = newParams;
        model.value.body = JSON.stringify(detail.body, null, 2);
        model.value.post_assert_code_show = detail.post_assert_code.toString();
        model.value.post_assert_json_show = JSON.stringify(detail.post_assert_json, null, 2);
    })
}

function saveTestcase() {
    // 处理code
    const assertCode = Number(model.value.post_assert_code_show);
    // 处理json
    var assertJsonObj = JSON.parse(model.value.post_assert_json_show);
    if (assertJsonObj && assertJsonObj.attention != undefined) {
        delete assertJsonObj.attention;
    } else {
        assertJsonObj = {}
    }
    // 处理header（从array变为object）
    var headerObj = {}
    for (let h of model.value.header) {
        headerObj[h.key] = h.value;
    }
    // 处理params（从array变为object）
    if (model.value.params != { key: '', value: '' }) {
        var paramsObj = {}
        for (let p of model.value.params) {
            paramsObj[p.key] = p.value;
        }
    } else {
        paramsObj = {}
    }
    if (testcaseId == undefined || isNaN(testcaseId)) {
        createTestcaseAPI({
            title: model.value.title,
            description: model.value.description,
            env_id: model.value.env_id,
            execute_account_id: model.value.execute_account_id,
            interface_id: model.value.interface_id,
            header: headerObj,
            params: paramsObj,
            body: JSON.parse(model.value.body),
            post_assert_code: assertCode,
            post_assert_json: assertJsonObj
        }).then((resp) => {
            console.log(resp.data);
            router.push('/testcases');
        })
    } else {
        updateTestcaseAPI(
            testcaseId, {
            title: model.value.title,
            description: model.value.description,
            env_id: model.value.env_id,
            execute_account_id: model.value.execute_account_id,
            interface_id: model.value.interface_id,
            header: headerObj,
            params: paramsObj,
            body: JSON.parse(model.value.body),
            post_assert_code: assertCode,
            post_assert_json: assertJsonObj
        }).then((resp) => {
            console.log(resp.data);
            router.push('/testcases');
        })
    }
}

function queryTestcaseLogs(id: number) {
    getTestcaseLogAPI(id).then((resp) => {
        console.log(resp.data);
        showLog.value = true;
        logContent.value = JSON.stringify(resp.data.data[0].detail, null, 2);
    })
}

</script>

<style scoped>
.detailOut {
    width: 100%;
    display: flex;
}

.detailArea {
    width: 45%;
    padding: 20px;
    text-align: left;
}

.extraArea {
    width: 45%;
    padding: 20px;
    text-align: left;
}

.actions {
    text-align: right;
}
</style>