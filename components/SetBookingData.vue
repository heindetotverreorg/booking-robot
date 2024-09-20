<template>
    <div>
        <h1>Padel boeken</h1>
        <PeopleInput
            :login-name="loginName"
            :login-password="loginPassword"
            :people="people"
        />
        <div>
            <label for="date">Datum waarop je wilt spelen</label>
            <input id="date" type="date" v-model="date">
        </div>
        <div>
            <label for="time">Tijd waarop je wilt spelen</label>
            <select id="time" v-model="time">
              <option v-for="timeOption in timeOptions" :key="timeOption" :value="timeOption">
                  {{ timeOption }}
              </option>
            </select>
        </div>
        <div>
            <label for="court">Baan waarop je wilt spelen</label>
            <select id="court" v-model="court">
          <option v-for="courtOption in courtOptions" :key="courtOption" :value="courtOption">
              {{ courtOption }}
          </option>
            </select>
        </div>
        <div>
            <button @click="$emit('submit', form)">Boek baan</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const court : Ref<string> = ref('4')
    const date : Ref<string> = ref(new Date().toISOString().split('T')[0])
    const loginName : Ref<string> = ref('mpoortvliet8570')
    const loginPassword : Ref<string> = ref('10*Matthias')
    const people : Ref<string[]> = ref(['Jonathan Ouwehand', 'Patrick Gieling', 'Ricky de Haan'])
    const time: Ref<string> = ref('20:30');

    const form = reactive({
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

    const courtOptions = computed(() => ['1', '2', '3', '4', '5', '6', '7', '8']);
    const timeOptions = computed(() => generateTimeOptions());
</script>