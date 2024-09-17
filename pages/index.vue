<template>
    <div>
        <SetBookingData @submit="onSubmit"/>
        <p>{{ response }}</p>
    </div>
</template>
<script setup lang=ts>
    const response = ref(null)

    const form = ref({})

    const onSubmit = async (form : Record<string, any>) => {
        response.value  = await $fetch('http://localhost:8000/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                targetFlow: 'bent-sports-padel-robot',
                flowParams: {
                    email: {
                        value: 'mpoortvliet8570'
                    },
                    password:  {
                        value: '10*Matthias'
                    },
                    sportSelect: {
                        value: 'sport/1280'
                    },
                    dateSelect: {
                        value: form.date
                    },
                    timeCourtSelect: {
                        value: [form.time, form.court]
                    }
                }
            })
        })
    }
</script>