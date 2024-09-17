<template>
    <div>
        <label for="loginName">Account naam</label>
        <input
            id="loginName"
            :value="props.loginName"
            @input="emit('update:loginName', $event)"
            type="text"
        />
    </div>
    <div>
        <label for="loginPassword">Account password</label>
        <input
            id="loginPassword"
            :value="props.loginPassword"
            @input="emit('update:loginPassword', $event)"
            type="text"
        />
    </div>
    <div v-for="person, index of proxyPeople" :key="person">
        <label for="loginPassword">Medespeler {{ index + 1 }}</label>
        <input
            type="text"
            v-model="people[index]"
        />
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        loginName: string,
        loginPassword: string,
        people: string[]
    }>()

    const emit = defineEmits([
        'update:loginName',
        'update:loginPassword',
        'update:people'
    ])

    const proxyPeople : string[] = [...props.people]

</script>