import { useApi } from "@directus/extensions-sdk";
import { Service, Request } from "../utils/index";
import { ref } from "vue";

export function useGetQuote() {
  const api = useApi();
  const quoteLoading = ref<boolean>(false);
  const quoteError = ref<boolean>(false);
  const quote = ref();

  const getQuote = async (id: string, data: Request) => {
    quoteLoading.value = true;
    quoteError.value = false;
    try {
      const resp = await api.post(
        `/booking-endpoints/services/${id}/quote`,
        data
      );

      quote.value = resp.data;
    } catch (e) {
      quoteError.value = true;
    } finally {
      quoteLoading.value = false;
    }
  };

  return { quote, quoteLoading, quoteError, getQuote };
}
