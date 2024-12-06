<template>
    <MeshInput
        :force-validation="{}"
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
    <MeshInput
        :force-validation="{}"
        id="personOne`"
        :highlight-validation="true"
        name="personOne"
        :required="true"
        type="text"
        :validators="[notempty, nospecialchar, nonumber]"
        v-model="personOne"
    >
        <template #label>Medespeler 1</template>
    </MeshInput>
    <MeshInput
        :force-validation="{}"
        id="personTwo"
        :highlight-validation="true"
        name="personTwo"
        :required="true"
        type="text"
        :validators="[notempty, nospecialchar, nonumber]"
        v-model="personTwo"
    >
        <template #label>Medespeler 2</template>
    </MeshInput>
    <MeshInput
        :force-validation="{}"
        id="personThree"
        :highlight-validation="true"
        name="personThree"
        :required="true"
        type="text"
        :validators="[notempty, nospecialchar, nonumber]"
        v-model="personThree"
    >
        <template #label>Medespeler 3</template>
    </MeshInput>
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
        personOne: string,
        personTwo: string,
        personThree: string,
    }>()

    const emit = defineEmits([
        'input'
    ])

    const loginName = computed({
        get: () => props.loginName,
        set: (value: string) => emit('input', { key: 'loginName', value })
    })

    const loginPassword = computed({
        get: () => props.loginPassword,
        set: (value: string) => emit('input', { key: 'loginPassword', value })
    })

    const personOne = computed({
        get: () => props.personOne,
        set: (value: string) => emit('input', { key: 'personOne', value })
    })

    const personTwo = computed({
        get: () => props.personTwo,
        set: (value: string) => emit('input', { key: 'personTwo', value })
    })

    const personThree = computed({
        get: () => props.personThree,
        set: (value: string) => emit('input', { key: 'personThree', value })
    })

</script>