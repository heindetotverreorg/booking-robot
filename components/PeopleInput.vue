<template>
    <MeshInput
        id="loginName"
        name="loginName"
        :required="true"
        type="text"
        :validators="[notempty]"
        :model-value="loginName"
        @input="emit('input', { key: 'loginName', value: $event.target.value })"
    >
        <template #label>Account naam</template>
    </MeshInput>
    <MeshInput
        id="loginPassword"
        name="loginPassword"
        :required="true"
        type="password"
        :validators="[notempty]"
        :model-value="loginPassword"
        @input="emit('input', { key: 'loginPassword', value: $event.target.value })"
    >
        <template #label>Account password</template>
    </MeshInput>
    <div v-for="person, index of proxyPeople" :key="person">
        <MeshInput
            :id="`person_${index + 1}`"
            :name="`person_${index + 1}`"
            :required="true"
            type="text"
            :validators="[notempty]"
            :model-value="people[index]"
            @input="onInput(index, $event.target.value)"
        >
            <template #label>Medespeler {{ index + 1 }}</template>
        </MeshInput>
    </div>
</template>

<script setup lang="ts">
    import { validators } from "mesh-ui-components"

    const {
        notempty
    } = validators


    const props = defineProps<{
        loginName: string,
        loginPassword: string,
        people: string[]
    }>()

    // const loginNameValue = computed({ 
    //     get: () => props.loginName, 
    //     set: (value  :string) => [emit('update:loginName', value)]
    // })

    const emit = defineEmits([
        'input'
    ])

    const onInput = (index : number, value : string) =>    {
        props.people[index] = value

        emit('input', { key: 'people', value: props.people})
    }

    const proxyPeople : string[] = [...props.people]

</script>