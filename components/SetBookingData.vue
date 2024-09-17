<template>
    <div>
      <h1>Padel boeken</h1>
      <input type="date" v-model="date">
      <select v-model="time">
        <option v-for="timeOption in timeOptions" :key="timeOption" :value="timeOption">
          {{ timeOption }}
        </option>
      </select>
      <select v-model="court">
        <option v-for="courtOption in courtOptions" :key="courtOption" :value="courtOption">
          {{ courtOption }}
        </option>
      </select>
      <button @click="$emit('submit', form)">Boek baan</button>
    </div>
</template>

<script lang="ts" setup>
    const court : Ref<string> = ref('4')
    const date : Ref<string> = ref(new Date().toISOString().split('T')[0])
    const time: Ref<string> = ref('20:30');

    const form = reactive({
        court: court,
        date: date,
        time: time
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