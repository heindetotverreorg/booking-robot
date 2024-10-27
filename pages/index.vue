<template>
    <div 
        :class="[
            'main',
            isLoading ? 'main--loading' : ''
        ]"
    >
        <SetBookingData
            :is-job-running="isJobRunning"  
            @cancel="stopJob"  
            @submit="onSubmit"
        />
        <p v-if="isJobRunning">Actieve boeking: {{ jobInfo }}</p>
        <div>
            <MeshInput
                id="isTest"
                name="isTest"
                type="checkbox"
                :model-value="isTest"
                @input="isTest = !isTest"
            >
                <template #label>Toon configuratie</template>
            </MeshInput>
        </div>
        <div v-if="isTest">
            <MeshInput
                id="cronTestTime"
                name="cronTestTime"
                type="time"
                v-model="cronTestTime"
            >
                <template #label>Test tijd voor geplande boeking</template>
            </MeshInput>
            <MeshButton
                id="report"
                label="Haal rapport op"
                variant="secondary"
                name="report"
                @click="getReport"
            />
            <MeshInput
                v-if="report"
                id="showRapport"
                name="showRapport"
                type="checkbox"
                :model-value="!!report"
                @input="report = ''"
            >
                <template #label>Toon rapport</template>
            </MeshInput>
            <img v-if="report" :src="report" alt="report" />
        </div>
    </div>
    <p>{{ response }}</p>
    <Loader class="spinner" v-if="isLoading"/>
</template>
<script setup lang="ts">
    import { MeshInput } from 'mesh-ui-components';

    const response = ref('')
    const isLoading = ref(false)
    const isJobRunning = ref(false)
    const jobInfo = ref('')
    const isTest = ref(false)
    const cronTestTime = ref('')
    const report = ref('')

    const getReport = async () => {
        const data = await $fetch(`/api/get-report`, {
            method: 'GET'
        })

        report.value = `data:image/png;base64,${data}`
    }

    const checkJob = async ({ noResponse } : { noResponse?: boolean }) => {
        isLoading.value = true
        if(!noResponse) {
            response.value = ''
        }
        const data : string = await $fetch(`/api/check-job`, {
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

    const stopJob = async () => {
        isLoading.value = true
        response.value = ''
        response.value = await $fetch(`/api/stop-job`, {
            method: 'DELETE'
        })
        await checkJob({ noResponse: true })
        isLoading.value = false
    }

    const onSubmit = async (form : Record<string, any>) => {
        isLoading.value = true
        response.value = ''
        response.value  = await $fetch(`/api/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                targetFlow: 'bent-sports-padel-robot',
                config: {
                    isTest: isTest.value,
                    cronTestTime: cronTestTime.value || '',
                    isRepeatedFlow: form.repeat
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
            })
        })
        await checkJob({ noResponse: true })
        isLoading.value = false
    }

    onMounted(() => {
        checkJob({ noResponse: true })
    })
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
    position: relative;
    transition: all 0.5s;
    max-width: 380px;

    &--loading {
        filter: blur(3px);
    }

}

.spinner {
    display: block;
    height: 60px;
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    top: 40%;
    width: 60px;
}

.input input,
.select select {
    border-width: 1px;
    border-bottom-width: 3px;
    border-top: 0;
    padding: .75rem .5rem;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    &::before, 
    &::after {
        display: none;
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
        background-color: white;
        border: 2px solid black;
        border-color: green;
        color: green;
    }

    &--secondary {
        background-color: white;
        border: 2px solid grey;
        color: darkorange;
        border-color: darkorange;
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