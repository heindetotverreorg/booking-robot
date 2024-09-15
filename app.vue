<template>
  <div>
    <h1>Padel boeken</h1>
    <button @click="onClick()">Boek baan</button>
    <p>{{ response }}</p>
  </div>
</template>
<script setup>
  const response = ref(null)

  const onClick = async () => {
    console.log('Boek baan');
    const { data, error } = await fetch('http://localhost:3000/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'Padel' })
    })

    if(!error) {
      response.value = data
    }
  }
</script>