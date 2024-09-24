<template>
    <h1>Padel boeken</h1>
    <PeopleInput
        :login-name="loginName"
        :login-password="loginPassword"
        :people="people"
        @input="onInput"
    />
    <Divider />
    <BookingInput
        :courtOptions="courtOptions"
        :timeOptions="timeOptions"
        :date="date"
        :court="court"
        :time="time"
        @input="onInput"
    />
    <Divider />
    <MeshButton
        id="submit"
        label="Boek baan"
        name="submit"
        @click="$emit('submit', form)"
    />
</template>

<script lang="ts" setup>
    import type { Reactive } from "vue";
    import BookingInput from "./BookingInput.vue";


    const emit = defineEmits([
        'submit',
    ])


    const court : Ref<string> = ref('4')
    const date : Ref<string> = ref(new Date().toISOString().split('T')[0])
    const loginName : Ref<string> = ref('mpoortvliet8570')
    const loginPassword : Ref<string> = ref('10*Matthias')
    const people : Ref<string[]> = ref(['Jonathan Ouwehand', 'Patrick Gieling', 'Ricky de Haan'])
    const time: Ref<string> = ref('20:30');

    const form : Reactive<Record<string, any>> = reactive({
        court,
        date,
        loginName,
        loginPassword,
        people,
        time
    });

    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const formattedHour = hour.toString().padStart(2, '0');
                const formattedMinute = minute.toString().padStart(2, '0');
                times.push(`${formattedHour}:${formattedMinute}`);
            }
        }
        return times;
    };

    const onInput = (event : { key : string, value : any, index: number }) => {
        const {
            key,
            value,
            index
        } = event

        if (Array.isArray(form[key]) && index !== undefined) { 
            form[key][index] = value
            return
        }
        form[key] = value
    }

    const courtOptions = computed(() => ['1', '2', '3', '4', '5', '6', '7', '8']);
    const timeOptions = computed(() => generateTimeOptions());
</script>
<style lang="scss">
    .input.input__text input,
    .input.input__password input,
    .input.input__date input,
    .select select {
        border-width: 1px;
        border-top: 0;
        padding: .75rem .5rem;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;

        &::before, 
        &::after {
            display: none;
        }
    }

    .button-wrapper,
    button {
        width: 100%;;
    }

</style>