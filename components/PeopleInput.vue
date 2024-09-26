<template>
    <MeshInput
        id="loginName"
        :highlight-validation="true"
        name="loginName"
        :required="true"
        type="text"
        :validators="[notempty, nospecialchar]"
        v-model="loginName"
    >
        <template #label>Account naam</template>
    </MeshInput>
    <MeshInput
        id="loginPassword"
        :highlight-validation="true"
        name="loginPassword"
        :required="true"
        type="password"
        :validators="[notempty]"
        v-model="loginPassword"
    >
        <template #label>Account password</template>
    </MeshInput>
    <Divider />
    <div v-for="_, index of people" :key="`person_${index + 1}`">
        <MeshInput
            :id="`person_${index + 1}`"
            :highlight-validation="true"
            :name="`person_${index + 1}`"
            :required="true"
            type="text"
            :validators="[notempty, nospecialchar, nonumber]"
            :model-value="people[index]"
            @input="onInput($event, index)"
        >
            <template #label>Medespeler {{ index + 1 }}</template>
        </MeshInput>
    </div>
</template>

<script setup lang="ts">
    import { validators } from "mesh-ui-components"

    const {
        notempty,
        nonumber,
        nospecialchar
    } = validators

    const props = defineProps<{
        loginName: string,
        loginPassword: string,
        people: string[]
    }>()

    const loginName = computed({
        get: () => props.loginName,
        set: (value: string) => emit('input', { key: 'loginName', value })
    })

    const loginPassword = computed({
        get: () => props.loginPassword,
        set: (value: string) => emit('input', { key: 'loginPassword', value })
    })

    const emit = defineEmits([
        'input'
    ])

    const onInput = (event: Event, index: number) => {
        const value = (event.target as HTMLInputElement).value
        emit('input', { key: 'people', value, index })
    }

</script>
<style lang="scss">

</style>