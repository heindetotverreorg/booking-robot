<template>
    <div class="main">
        <SetBookingData @submit="onSubmit"/>
    </div>
    <p>{{ response }}</p>
</template>
<script setup lang="ts">
    const response = ref(null)

    const onSubmit = async (form : Record<string, any>) => {
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
    }
</script>
<style>
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
    max-width: 380px;
    padding: 2rem 0;

}
</style>