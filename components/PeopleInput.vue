<template>
    <MeshInput
        :force-validation="forceValidation"
        ref="login-name"
        id="login-name"
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
        :force-validation="forceValidation"
        ref="login-password"
        id="login-password"
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
        :force-validation="forceValidation"
        ref="person-one"
        id="person-one"
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
        :force-validation="forceValidation"
        ref="person-two"
        id="person-two"
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
        :force-validation="forceValidation"
        ref="person-three"
        id="person-hree"
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
        forceValidation: Record<string, unknown>
    }>()

    const emit = defineEmits([
        'input'
    ])

    const loginNameRef = useTemplateRef('login-name')

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

    defineExpose({
        loginNameRef
    })

</script>