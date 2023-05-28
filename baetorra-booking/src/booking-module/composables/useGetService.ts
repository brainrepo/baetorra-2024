import { useApi } from "@directus/extensions-sdk";
import { Service, isServiceValid } from "../utils/index";
import { ref } from "vue";

export function useGetService() {
  const api = useApi();
  const serviceLoading = ref<boolean>(false);
  const serviceError = ref<boolean>(false);
  const service = ref<Service>();

  const loadData = async (id: string) => {
    serviceLoading.value = true;
    serviceError.value = false;
    try {
      const { data } = await api.get<Service>(
        `/booking-endpoints/services/${id}`
      );

      if (!data || !isServiceValid(data)) {
        serviceError.value = true;
        return;
      }
      service.value = data;
    } catch (e) {
      serviceError.value = true;
    } finally {
      serviceLoading.value = false;
    }
  };

  return { service, serviceLoading, serviceError, loadData };
}
