<template>
    <MeshInput
        id="cronTestTime"
        name="cronTestTime"
        type="text"
        v-model="customCronString"
        @input="onInput"
    >
        <template #label>Custom cron string</template>
    </MeshInput>
    <MeshInput
        id="cronTestTime"
        name="cronTestTime"
        type="time"
        v-model="cronTestTime"
        @input="onInput"
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
</template>
<script setup lang="ts">
    const cronTestTime = ref('')
    const report = ref('')
    const customCronString = ref('')

    const emit = defineEmits([
        'set-config',
    ])


    const onInput = () => {
        emit('set-config', {
            cronTestTime: cronTestTime.value,
            customCronString: customCronString.value
        })
    }

    const getReport = async () => {
        const data = await $fetch(`/api/get-report`, {
            method: 'GET'
        })

        report.value = `data:image/png;base64,${data}`
    }

</script>