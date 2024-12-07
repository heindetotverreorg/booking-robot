<template>
    <h1>Padel boeken</h1>
    <PeopleInput
        ref="people-input"
        :login-name="loginName"
        :login-password="loginPassword"
        :person-one="personOne"
        :person-two="personTwo"
        :person-three="personThree"
        :forceValidation="validationConfig"
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
    <MeshInput
        id="repeatBooking"
        name="repeatBooking"
        type="checkbox"
        :model-value="repeat"
        @input="repeat = !repeat"
    >
        <template #label>Herhaal boeking wekelijks</template>
    </MeshInput>
    <div class="buttons">
        <MeshButton
            id="submit"
            label="Boek baan"
            name="submit"
            @click="onSubmit"
        />
        <MeshButton
            v-if="isJobRunning"
            id="jobCheck"
            label="Annuleer boeking"
            name="jobCheck"
            variant="secondary"
            @click="$emit('cancel')"
        />
    </div>
</template>

<script lang="ts" setup>
    import type { Reactive } from "vue";
    import BookingInput from "./BookingInput.vue";
    import PeopleInput from "./PeopleInput.vue";

    defineProps<{
        isJobRunning: boolean
    }>()

    const emit = defineEmits([
        'cancel',
        'submit',
    ])

    const court : Ref<string> = ref('4')
    const date : Ref<string> = ref(new Date().toISOString().split('T')[0])
    const loginName : Ref<string> = ref('')
    const loginPassword : Ref<string> = ref('')
    const personOne : Ref<string> = ref('')
    const personTwo : Ref<string> = ref('')
    const personThree : Ref<string> = ref('')
    const time: Ref<string> = ref('20:00');
    const repeat: Ref<boolean> = ref(false);

    const peopleInputRef = useTemplateRef('people-input')

    const validationConfig : Record<string, any> = ref({})

    onMounted(() => {
        validationConfig.value = {
            validateStrict: false
        }
        const form = localStorage.getItem('form');

        if (form) {
            const parsedForm = JSON.parse(form);

            loginName.value = parsedForm.loginName;
            personOne.value = parsedForm.personOne;
            personTwo.value = parsedForm.personTwo;
            personThree.value = parsedForm.personThree;
            repeat.value = parsedForm.repeat;
        }
    })

    const form : Reactive<Record<string, any>> = reactive({
        court,
        date,
        loginName,
        loginPassword,
        personOne,
        personTwo,
        personThree,
        time,
        repeat
    });

    const checkValidation = () => {
        const invalidFields : string[] = [];
        if (peopleInputRef.value) {
            const inputs = peopleInputRef.value.$refs;
            Object.values(inputs).forEach((input : any) => {
                const validators = input.$props.validators;
                validators.forEach(({validate} : any) => {
                    const isValid = validate(input.modelValue);
                    if (!isValid) {
                        invalidFields.push(input.id);
                    }
                })
            })
        }
        return invalidFields;
    }

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

    const onSubmit = () => {
        const invalidFields = checkValidation()
        if (!invalidFields.length) {
            emit('submit', form)
        } else {
            validationConfig.value = {
                validateStrict: true
            }
            // invalidFields.forEach(field => {
            //     const inputs = peopleInputRef.value?.$refs as Record<string, any>;
            //     const invalidField = inputs[field]
            //     invalidField.forceValidation = {
            //         validateStrict: true
            //     }
            // })
        }
    }

    const courtOptions = computed(() => ['1', '2', '3', '4', '5', '6', '7', '8']);
    const timeOptions = computed(() => generateTimeOptions());
</script>
<style lang="scss">

</style>