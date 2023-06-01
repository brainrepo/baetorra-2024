<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
    name: 'ErrorNotice',
    props: {
        errorCode: { type: String , required: true }
    },
    setup(props) {
        
    }
    })
</script>

<template>
  <v-notice v-if="errorCode === 'price_error'" type="danger">No price configured! Contact the supplier.</v-notice>
  <v-notice v-if="errorCode === 'availability_error'" type="danger">No availability, try another date or shift.</v-notice>
</template>
