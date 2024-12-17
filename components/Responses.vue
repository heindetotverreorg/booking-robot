<template>
    <div
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
</script>


<style scoped>
/* Your styles here */
</style>