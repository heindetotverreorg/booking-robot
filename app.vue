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
    <button @click="onClick()">Boek baan</button>
    <p>{{ response }}</p>
  </div>
</template>
<script setup lang=ts>
    const response = ref(null)

    const court : Ref<string> = ref('4')
    const date : Ref<string> = ref(new Date().toISOString().split('T')[0])
    const time: Ref<string> = ref('20:30');

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

    const onClick = async () => {
        response.value  = await $fetch('http://localhost:8000/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                targetFlow: 'bent-sports-padel-robot',
                flowParams: {
                    email: {
                        value: 'mpoortvliet8570'
                    },
                    password:  {
                        value: '10*Matthias'
                    },
                    sportSelect: {
                        value: 'sport/1280'
                    },
                    dateSelect: {
                        value: unref(date)
                    },
                    timeCourtSelect: {
                        value: [unref(time), unref(court)]
                    }
                }
            })
        })
    }
</script>