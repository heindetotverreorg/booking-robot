<template>
  <div>
    <h1>Padel boeken</h1>
    <input type="date" v-model="date">
    <button @click="onClick()">Boek baan</button>
    <p>{{ response }}</p>
  </div>
</template>
<script setup lang=ts>
  const response = ref(null)

  const date : Ref<string> = ref(new Date().toISOString().split('T')[0])

  const onClick = async () => {
    response.value  = await $fetch('http://localhost:3000/api/book', {
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
          }
        }
      })
    })
  }
</script>