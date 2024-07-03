import { useApi } from "@directus/extensions-sdk";
import { ref } from "vue";

export function useVoidReservation() {
  const api = useApi();
  const reservationLoading = ref<boolean>(false);
  const reservationError = ref<boolean>(false);

  const voidReservation = async (id: string) => {
    reservationLoading.value = true;
    reservationError.value = false;
    try {
      const { data } = await api.get(
        `/booking-endpoints/reservations/${id}/void`
      );

      if (!data) {
        reservationError.value = true;
        return data;
      }
    } catch (e) {
      reservationError.value = true;
    } finally {
      reservationLoading.value = false;
    }
  };

  return {
    reservationLoading: reservationLoading,
    reservationError: reservationError,
    voidReservation,
  };
}
