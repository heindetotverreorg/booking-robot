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
        <template #label>Herhaal boeking</template>
    </MeshInput>
    <MeshSelect
        v-if="repeat"
        id="repeatValue"
        :highlight-validation="true"
        :default="repeatValue"
        name="time"
        :options="repeatOptions"
        :required="true"
        type="select"
        v-model="repeatValue"
        :validators="[notempty]"
    >
        <template #label>Herhaal:</template>
    </MeshSelect>
    <div v-if="showValidation">
        <p class="validation"
            v-for="result in validationResults"
        >{{ result }} is niet goed ingevuld</p>
    </div>
    <div class="buttons">
        <MeshButton
            :disabled="disabled"
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
    import { validators } from "mesh-ui-components"
    import { RepeatValues } from "@/types/flow";

    const {
        notempty
    } = validators

    defineProps<{
        isJobRunning: boolean,
        disabled: boolean,
    }>()

    const emit = defineEmits([
        'cancel',
        'submit',
        'validation'
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
    const repeatValue: Ref<string> = ref('Elke week');

    const peopleInputRef = useTemplateRef('people-input')

    const validationConfig : Record<string, any> = ref({})
    const showValidation : Ref<boolean> = ref(false)
    const validationResults : Ref<string[]> = ref([])

    onMounted(() => {
        validationConfig.value = {
            validateStrict: false
        }

        const form = localStorage.getItem('form');

        if (form) {
            const parsedForm = JSON.parse(form);

            loginName.value = parsedForm.loginName;
            // loginPassword.value = parsedForm.loginPassword;
            personOne.value = parsedForm.personOne;
            personTwo.value = parsedForm.personTwo;
            personThree.value = parsedForm.personThree;
            repeat.value = parsedForm.repeat;
        }

        nextTick(() => {
            checkValidation()
        })
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
        repeat,
        repeatValue
    });

    const checkValidation = () => {
        if (peopleInputRef.value) {
            const inputs = peopleInputRef.value.$refs;
            Object.values(inputs).forEach((input : any) => {
                const validators = input.$props.validators;
                validators.forEach(({validate} : any) => {
                    const isValid = validate(input.modelValue);
                    if (!isValid) {
                        validationResults.value.push(input.id);
                    }
                })
            })
        }
        emit('validation', validationResults.value, { soft: true })
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
        validationResults.value = [];

        const {
            key,
            value
        } = event

        form[key] = value

        checkValidation()
    }

    const onSubmit = () => {
        validationResults.value = []

        switch (repeatValue.value) {
            case 'Elke dag':
                form.repeatValue = RepeatValues.DAILY;
                break;
            case 'Om de dag':
                form.repeatValue = RepeatValues.EVERY_OTHER_DAY;
                break;
            case 'Elke week':
                form.repeatValue = RepeatValues.WEEKLY;
                break;
            case 'Elke twee weken':
                form.repeatValue = RepeatValues.BI_WEEKLY;
                break;
            case 'Elke maand':
                form.repeatValue = RepeatValues.MONTHLY;
                break;
        }

        checkValidation()
        if (!validationResults.value.length) {
            emit('submit', form)
        } else {
            validationConfig.value = {
                validateStrict: true
            }
            showValidation.value = true
        }
    }

    const courtOptions = computed(() => ['1', '2', '3', '4', '5', '6', '7', '8']);
    const timeOptions = computed(() => generateTimeOptions());
    const repeatOptions = computed(() => ['Elke dag', 'Om de dag', 'Elke week', 'Elke twee weken', 'Elke maand']);
</script>
<style lang="scss">
.validation {
    color: red
}
</style>