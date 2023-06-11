<template>
    <div>
      <div class="trigger-button">
        <button v-if="reservationLoading">loading</button>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useVoidReservation } from "../composables/useVoidReservation";
import QrcodeVue from "qrcode.vue";

export default defineComponent({
  components: { QrcodeVue },
  props: ["reservationId"],
  setup(props) {
    const { voidReservation, reservationLoading } = useVoidReservation();

    voidReservation(props.reservationId).then(e => {
      window.location.replace(`/admin/content/reservations/${props.reservationId}`); 
    })

    return { reservationLoading};
  },
});
</script>

