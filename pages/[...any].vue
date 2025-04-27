<template>
    <div>
        <h1>Error: page not found</h1>
        <p>Current route: {{ $route.params.any }}</p>
        <a href="/">Go back to home</a>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
</style>