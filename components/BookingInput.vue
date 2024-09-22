<template>
    <MeshInput
        id="date"
        :highlight-validation="true"
        name="date"
        :required="true"
        type="date"
        :validators="[notempty]"
        v-model="date"
    >
        <template #label>Datum waarop je wilt spelen</template>
    </MeshInput>
    <MeshSelect 
        id="time"
        :highlight-validation="true"
        :default="time"
        name="time"
        :options="timeOptions"
        :required="true"
        type="select"
        v-model="time"
        :validators="[notempty]"
    >
        <template #label>Tijd waarop je wilt spelen</template>
    </MeshSelect>
    <MeshSelect 
        id="court"
        :highlight-validation="true"
        :default="court"
        name="court"
        :options="courtOptions"
        :required="true"
        type="select"
        v-model="court"
        :validators="[notempty]"
    >
        <template #label>Baan waarop je wilt spelen</template>
    </MeshSelect>
</template>

<script setup lang="ts">
    import { validators } from "mesh-ui-components"

    const {
        notempty
    } = validators

    const props = defineProps<{
        courtOptions: string[],
        timeOptions: string[],
        date: string,
        court: string,
        time: string,
    }>()

    const date = computed({
        get: () => props.date,
        set: (value: string) => emit('input', { key: 'date', value })
    })

    const court = computed({
        get: () => props.court,
        set: (value: string) => emit('input', { key: 'court', value })
    })

    const time = computed({
        get: () => props.time,
        set: (value: string) => emit('input', { key: 'time', value })
    })

    const emit = defineEmits([
        'input'
    ])

</script>