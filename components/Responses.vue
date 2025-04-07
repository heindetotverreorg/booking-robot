<template>
    <div
        :class="[
            'response',
            responseHasError ? 'response--error' : '',
        ]"
    >
        <p>{{ humanReadableResponse }}</p>
        <MeshButton
            label="sluit"
            id="closemessage"
            name="closemessage"
            variant="tertiary"
            @click="emit('closemessage')"
        />
    </div>
</template>

<script setup lang="ts">
    const {
        response,
        responseHasError,
    } = defineProps<{
        response: string,
        responseHasError: boolean,
    }>()

    const emit = defineEmits([
        'closemessage'
    ])

    const humanReadableResponse = computed(() => {
        if (response.includes('"key":"loginSubmit"')) {
            return 'Account naam of wachtwoord onjuist'
        }

        if (response.includes('key":"personOne"')) {
            return 'Mede speler 1 naam onjuist'
        }

        if (response.includes('key":"personTwo"')) {
            return 'Mede speler 2 naam onjuist'
        }

        if (response.includes('key":"personThree"')) {
            return 'Mede speler 3 naam onjuist'
        }

        if (response.includes('"key":"timeCourtSelect"')) {
            return 'Baan niet beschikbaar op deze tijd'
        }

        return response
    })
</script>


<style scoped>
/* Your styles here */
</style>