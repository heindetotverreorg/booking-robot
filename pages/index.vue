<template>
    <div 
        :class="[
            'main',
            isLoading ? 'main--loading' : ''
        ]"
    >
        <SetBookingData @submit="onSubmit"/>
    </div>
    <Loader class="spinner" v-if="isLoading"/>
    <p>{{ response }}</p>
</template>
<script setup lang="ts">
    const response = ref(null)
    const isLoading = ref(false)

    const onSubmit = async (form : Record<string, any>) => {
        isLoading.value = true
        response.value = null
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
        isLoading.value = false
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