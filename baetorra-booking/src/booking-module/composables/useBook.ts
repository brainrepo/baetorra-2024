import { useApi } from "@directus/extensions-sdk";
import { ref } from "vue";
import { Service, Request } from "../utils/index";

export function useBook() {
  const api = useApi();
  const bookLoading = ref<boolean>(false);
  const bookError = ref<boolean>(false);
  const reservationId = ref();

  const book = async (
    id: string,
    data: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
    } & Partial<Request>
  ) => {
    bookLoading.value = true;
    bookError.value = false;
    try {
      const resp = await api.post(
        `/booking-endpoints/services/${id}/book`,
        data
      );

      bookError.value = resp.data;
    } catch (e) {
      bookError.value = true;
    } finally {
      bookLoading.value = false;
    }
  };

  return { book, bookLoading, bookError, reservationId };
}
