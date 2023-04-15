import { useApi } from "@directus/extensions-sdk";
import {
  Service,
  initializeRequestByService,
  isServiceValid,
} from "../utils/index";
import { ref, watch } from "vue";

export function useGetService() {
  const api = useApi();
  const serviceLoading = ref<boolean>(false);
  const serviceError = ref<boolean>(false);
  const service = ref<Service>();

  const loadData = async (id: string) => {
    serviceLoading.value = true;
    serviceError.value = false;
    try {
      const { data } = await api.get<Service[]>(
        `/booking-endpoints/services/${id}`
      );
      const s = data?.[0];
      if (!s || !isServiceValid(s)) {
        serviceError.value = true;
        return;
      }
      service.value = s;
    } catch (e) {
      serviceError.value = true;
    } finally {
      serviceLoading.value = false;
    }
  };

  return { service, serviceLoading, serviceError, loadData };
}
