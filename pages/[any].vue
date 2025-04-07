<template>
    <div>
        <h1>Error: page not found</h1>
        <p>Current route: {{ $route.params.any }}</p>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
</style>