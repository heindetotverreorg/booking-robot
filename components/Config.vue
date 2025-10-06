<template>
    <MeshInput
        id="isTestModeEnbaled"
        name="isTestModeEnbaled"
        type="checkbox"
        :model-value="isTestModeEnbaled"
        @input="[isTestModeEnbaled = !isTestModeEnbaled, onInput()]"
    >
        <template #label>Test modus</template>
    </MeshInput>
    <MeshInput
        id="isApiMethod"
        name="isApiMethod"
        type="checkbox"
        :model-value="isApiMethod"
        @input="[isApiMethod = !isApiMethod, onInput()]"
    >
        <template #label>Is api booking method</template>
    </MeshInput>
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
    <MeshSelect
        id="repeatValueTest"
        :default="repeatValueTest"
        name="repeatValueTest"
        :options="['Elke minuut']"
        :required="true"
        type="select"
        v-model="repeatValueTest"
        @update:modelValue="onInput"
    >
        <template #label>Test voor herhaling</template>
    </MeshSelect>
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
    const repeatValueTest = ref('')
    const isTestModeEnbaled = ref(false)
    const isApiMethod = ref(true)

    const emit = defineEmits([
        'set-config',
    ])

    const onInput = () => {
        emit('set-config', {
            cronTestTime: cronTestTime.value,
            customCronString: customCronString.value,
            repeatValueTest: repeatValueTest.value,
            isTestModeEnbaled: isTestModeEnbaled.value,
            isApiMethod: isApiMethod.value
        })
    }

    const getReport = async () => {
        const data = await $fetch(`/api/get-report`, {
            method: 'GET'
        })

        report.value = `data:image/png;base64,${data}`
    }

</script>