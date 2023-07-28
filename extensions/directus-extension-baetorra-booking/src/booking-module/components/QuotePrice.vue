<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
    name: 'ErrorNotice',
    props: {
        prices: { type: Object , required: true }
    },
    setup(props) {

  
    }
    })
</script>

<template>
    <v-notice type="info">Total price: {{  Object.keys(prices).reduce((acc, e) => acc += prices[e].total, 0) }} &euro;</v-notice>
</template>
