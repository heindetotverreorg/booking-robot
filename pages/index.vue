<template>
    <div 
        :class="[
            'main',
            isLoading ? 'main--loading' : ''
        ]"
    >
        <SetBookingData @submit="onSubmit"/>
        <p v-if="isJobRunning">Actieve boeking: {{ jobInfo }}</p>
        <p v-else>Er is geen actieve boeking</p>
        <MeshButton
            v-if="isJobRunning"
            id="jobCheck"
            label="Annuleer boeking"
            variant="secondary"
            @click="stopJob"
        />
    </div>
    <p>{{ response }}</p>
    <Loader class="spinner" v-if="isLoading"/>
</template>
<script setup lang="ts">
    const response = ref('')
    const isLoading = ref(false)
    const isJobRunning = ref(false)
    const jobInfo = ref('')

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
        if (data.includes('job information')) {
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
                        value: form.people[0]
                    },
                    personTwo: {
                        value: form.people[1]
                    },
                    personThree: {
                        value: form.people[2]
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
</style>