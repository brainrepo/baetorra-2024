import { useApi } from "@directus/extensions-sdk";
import { ref } from "vue";

export function useGetReservation() {
  const api = useApi();
  const reservationLoading = ref<boolean>(false);
  const reservationError = ref<boolean>(false);
  const reservation = ref();

  const loadData = async (id: string) => {
    reservationLoading.value = true;
    reservationError.value = false;
    try {
      const fields = [
        "booking_date",
        "seller.company",
        "seller.address",
        "seller.phone_number",
        "service.supplier.company",
        "service.supplier.address",
        "service.supplier.phone_number",
        "service.description",
        "service.memo",
        "service.links",
        "service.name",
        "service.contract",
        "booking_date",
        "booked_date",
        "shift.name",
        "shift.from",
        "shift.to",
        "status",
        "variants.variant.name",
        "variants.amount",
        "variants.balance",
        "variants.deposit",
        "variants.total",
        "customer_name",
        "customer_email",
        "customer_phone",
      ];

      const fieldString = fields.map((f) => `fields[]=${f}`).join("&");

      const { data } = await api.get(
        `/items/reservations/${id}?${fieldString}`
      );

      if (!data) {
        reservationError.value = true;
        return;
      }
      reservation.value = data;
    } catch (e) {
      reservationError.value = true;
    } finally {
      reservationLoading.value = false;
    }
  };

  return {
    reservation: reservation,
    reservationLoading: reservationLoading,
    serviceError: reservationError,
    loadData,
  };
}
