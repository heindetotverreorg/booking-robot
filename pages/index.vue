<template>
    <div 
        :class="[
            'main',
            isLoading ? 'main--loading' : ''
        ]"
    >
        <SetBookingData
            :disabled="isDisabled"
            :is-job-running="isJobRunning"
            @validation="onValidate"
            @cancel="stopJob"  
            @submit="onSubmit"
        />
        <p v-if="isJobRunning">Actieve boeking: {{ jobInfo }}</p>
        <MeshInput
            id="isTest"
            name="isTest"
            type="checkbox"
            :model-value="isTest"
            @input="isTest = !isTest"
        >
            <template #label>Toon configuratie opties</template>
        </MeshInput>
        <Config v-if="isTest"
            @set-config="setConfig"
        />
    </div>
    <div v-if="response"
        :class="[
            'response',
            responseHasError ? 'response--error' : '',
        ]"
    >
        <p>{{ response }}</p>
        <MeshButton
            label="sluit"
            name="closemessage"
            variant="tertiary"
            @click="response = ''"
        />
    </div>
    <Loader class="spinner" v-if="isLoading"/>
</template>
<script setup lang="ts">
    import { MeshInput } from 'mesh-ui-components';

    const response = ref('')
    const responseHasError = ref(false)
    const isLoading = ref(false)
    const isJobRunning = ref(false)
    const jobInfo = ref('')
    const isTest = ref(false)
    const isDisabled = ref(false)
    const config = reactive({
        cronTestTime: '',
        customCronString: ''
    })

    onMounted(() => {
        checkJob({ noResponse: true })
    })

    const checkJob = async ({ noResponse } : { noResponse?: boolean }) => {
        isLoading.value = true
        if(!noResponse) {
            response.value = ''
        }
        const data = await $fetch<string>(`/api/check-job`, {
            method: 'GET'
        })
        if (data.includes('no job')) {
            isJobRunning.value = false
        }
        if (data.includes(' : ')) {
            isJobRunning.value = true
        }
        if (!noResponse) {
            response.value = data
        }
        jobInfo.value = data
        isLoading.value = false
    }

    const onSubmit = async (form : Record<string, any>) => {
        responseHasError.value = false
        isLoading.value = true
        response.value = ''
        
        const payload = {
            targetFlow: 'bent-sports-padel-robot',
            config: {
                isTest: isTest.value,
                cronTestTime: config.cronTestTime || '',
                isWeeklyRepeatedFlow: form.repeat,
                repeatValue: form.repeatValue,
                customCronString: config.customCronString
            },
            flowParams: {
                email: {
                    value: form.loginName
                },
                password:  {
                    value: form.loginPassword
                },
                sportSelect: {
                    value: 'sport/1280'
                },
                dateSelect: {
                    value: form.date
                },
                timeCourtSelect: {
                    value: [form.time, form.court]
                },
                personOne: {
                    value: form.personOne
                },
                personTwo: {
                    value: form.personTwo
                },
                personThree: {
                    value: form.personThree
                }
            }
        }

        response.value  = await $fetch<string>(`/api/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if (response.value.includes('Error ')) {
            responseHasError.value = true
        }

        await checkJob({ noResponse: true })

        localStorage.setItem('form', JSON.stringify(form));

        isLoading.value = false
    }

    const setConfig = (incomingConfig : Record<string, any>) => {
        config.cronTestTime = incomingConfig.cronTestTime
        config.customCronString = incomingConfig.customCronString
    }

    const stopJob = async () => {
        isLoading.value = true
        response.value = ''
        await $fetch<string>(`/api/stop-job`, {
            method: 'DELETE'
        })
        await checkJob({ noResponse: true })
        isLoading.value = false
    }

    const onValidate = (
        errors : string[]
    ) => {
        if (!errors.length) {
            isDisabled.value = false
        } else {
            isDisabled.value = true
        }
    }
</script>
<style lang="scss">
* {
    box-sizing: border-box;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}

label {
    font-size: small;
}

label, select {
    display: block;
    margin-bottom: 2px;
}

div {
    margin-bottom: 1rem;
}

input, select {
    padding: 4px;
    width: 100%;
}

input[type="checkbox"] {
    width: auto;
}

.main {
    margin: 0 auto;
    padding: 0 1.5rem 0 .5rem;
    position: relative;
    transition: all 0.5s;
    max-width: 380px;

    &--loading {
        filter: blur(3px);
    }
}

.response {
    background-color: green;
    color: white;
    position: fixed;
    left: 10px;
    right: 10px;
    top: 50%;
    padding: 20px;
    transform: translateY(-50%);

    &--error {
        background-color: red;
    }
}

.spinner {
    display: block;
    height: 60px;
    transform: translate(-50%, -50%);
    position: fixed;
    left: 50%;
    top: 40%;
    width: 60px;
}

.input input,
.select select {
    border-width: 1px;
    border-bottom-width: 4px;
    border-top: 0;
    padding: .75rem .5rem;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.input, .select {
    position: relative;

    &::after {
        border-radius: 50%;;
        bottom: 19px;
        content: '';
        left: calc(100%  + 12px);
        display: block;
        position: absolute;
        height: 5px;
        width: 5px;
    }

    &--validated {
        &::after {
            background-color: green;
        }
    }

    &--warning {
        &::after {
            background-color: orange;
        }
    }

    &--error {
        &::after {
            background-color: red;
        }
    }

}

.button-wrapper,
button,
.button {
    transition-property: border-bottom-width, transform;
    transition-duration: .2s;
    transition-behavior: ease;
    width: 100%;

    &--primary {
        background-color: transparent;
        border: 2px solid black;
        border-color: green;
        color: green;
    }

    &--secondary {
        background-color: transparent;
        border: 2px solid grey;
        color: darkorange;
        border-color: darkorange;
    }

    &--tertiary {
        background-color: transparent;
        border: 2px solid white;
        color: white;
    }
}

.button {
    padding: 1rem 1rem;

    &--tertiary {
        &:hover,
        &:focus,
        &:active {
            border-bottom-width: 2px;
            transform: translateY(0);    

        }
    }
}

button {
    &:hover,
    &:focus,
    &:active {
        border-bottom-width: 7px;
        cursor: pointer;   
        transform: translateY(-3px);    
    }

    &[disabled] {
        border-color: lightgrey;
        color: lightgrey;
    }
}

.buttons {
    display: flex;
    justify-content: space-between;
    height: 90px;

    .button-wrapper:nth-of-type(2) {
        margin-left: 10px;
    }
}

img {
    width: 100%;
    height: auto;
}
</style>