<template>
    <h1>Padel boeken</h1>
    <PeopleInput
        :login-name="loginName"
        :login-password="loginPassword"
        :person-one="personOne"
        :person-two="personTwo"
        :person-three="personThree"
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
    <div class="buttons">
        <MeshButton
            id="submit"
            label="Boek baan"
            name="submit"
            @click="$emit('submit', form)"
        />
        <MeshButton
            v-if="isJobRunning"
            id="jobCheck"
            label="Annuleer boeking"
            variant="secondary"
            @click="$emit('cancel')"
        />
    </div>
</template>

<script lang="ts" setup>
    import type { Reactive } from "vue";
    import BookingInput from "./BookingInput.vue";

    const props = defineProps<{
        isJobRunning: boolean
    }>()

    const emit = defineEmits([
        'cancel',
        'submit',
    ])

    const court : Ref<string> = ref('4')
    const date : Ref<string> = ref(new Date().toISOString().split('T')[0])
    const loginName : Ref<string> = ref('mpoortvliet8570')
    const loginPassword : Ref<string> = ref('10*Matthias')
    const personOne : Ref<string> = ref('Jonathan Ouwehand')
    const personTwo : Ref<string> = ref('Patrick Gieling')
    const personThree : Ref<string> = ref('Ricky de Haan')
    const time: Ref<string> = ref('20:30');

    const form : Reactive<Record<string, any>> = reactive({
        court,
        date,
        loginName,
        loginPassword,
        personOne,
        personTwo,
        personThree,
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

    const onInput = (event : { key : string, value : any }) => {
        const {
            key,
            value
        } = event

        form[key] = value
    }

    const courtOptions = computed(() => ['1', '2', '3', '4', '5', '6', '7', '8']);
    const timeOptions = computed(() => generateTimeOptions());
</script>
<style lang="scss">
.input input,
.select select {
    border-width: 1px;
    border-bottom-width: 3px;
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
button,
.button {
    transition-property: border-bottom-width, transform;
    transition-duration: .2s;
    transition-behavior: ease;
    width: 100%;

    &--primary {
        background-color: white;
        border: 2px solid black;
        border-color: green;
        color: green;
    }

    &--secondary {
        background-color: white;
        border: 2px solid grey;
        color: darkorange;
        border-color: darkorange;
    }
}

button {
    &:hover,
    &:focus,
    &:active {
        border-bottom-width: 7px;
        cursor: pointer;   
        transform: translateY(-3px);    
    }
}

.buttons {
    display: flex;
    justify-content: space-between;
    height: 90px;

    .button-wrapper:nth-of-type(2) {
        margin-left: 10px;
    }
}
</style>