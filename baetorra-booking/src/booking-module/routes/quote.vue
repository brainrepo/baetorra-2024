<template>
  <private-view
    title="Errore nel servizio"
    small-header="Small header"
    v-if="serviceError || !service"
  >
    <template #navigation>
      <Sidebar />
    </template>
    error
  </private-view>
  <private-view
    title="Loading"
    small-header="Small header"
    v-if="serviceLoading"
  >
    <v-skeleton-loader type="list-item-icon" />
  </private-view>
  <private-view
    :title="service?.name ?? 'Booking'"
    small-header="Small header"
    v-if="!serviceLoading && !serviceError && service"
  >
    <template #navigation>
      <Sidebar />
    </template>

    <div class="main-quote">
      <div>
        <v-sheet class="fieldgroup">
          <v-date-picker
            type="date"
            v-model="request.date"
            v-if="request?.date"
          />

          <div class="form-field-container">
            <v-text-overflow text="Shift"></v-text-overflow>

            <v-select
              v-if="request?.shift"
              :items="service?.shifts ?? []"
              itemText="name"
              itemValue="id"
              v-model="request.shift"
            ></v-select>
          </div>
        </v-sheet>

        <v-sheet class="fieldgroup" v-if="request?.variants">
          <div
            class="form-field-container"
            v-for="(variant, index) in service?.variants"
          >
            <Variant
              type="number"
              :variant="variant"
              v-model="request.variants[variant.id]"
              :prices="quote?.prices?.[variant.id]"
            />
          </div>
        </v-sheet>
   
      </div>
      <div>
        <ErrorNotice
          :error-code="quote.code"
          v-if="quote.status === 'error'"
        ></ErrorNotice>


        <QuotePrice 
          v-if="quote && quote.status === 'success' && request && isRequestValid(request)" :prices="quote.prices" />

  

        <v-sheet class="form-field-container">
          <div>Customer name</div>

          <div class="inline">
            <v-input
              v-model="customer.name"
            ></v-input></div
        >
        <div>Phone</div>

          <div class="inline">
            <v-input
              v-model="customer.phone"
            ></v-input></div
        >

        <div>Email</div>

          <div class="inline">
            <v-input
              v-model="customer.email"
            ></v-input></div
        ></v-sheet>
        <div>
          <v-button
          :disabled="
            !request ||
            !isRequestValid(request) ||
            !quote ||
            quote.status === 'error'
          "
          :loading="quoteLoading"
          >Book</v-button
        ></div>
      </div>
    </div>
    <template #sidebar>
      <sidebar-detail
        icon="info_outline"
        title="info"
        close
        v-if="service?.seller_helper_notice"
      >
        <div v-md="service?.seller_helper_notice" class="page-description" />
      </sidebar-detail>
    </template>
    {{ request }} 
        {{ quote }} {{customer}}
  </private-view>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import Sidebar from "../components/Sidebar.vue";
import ErrorNotice from "../components/ErrorNotice.vue";
import QuotePrice from "../components/QuotePrice.vue";
import { useRoute } from "vue-router";
import { parse } from "marked";
import Variant from "../components/Variant.vue";
import { useApi, useStores } from "@directus/extensions-sdk";

import {
  Request,
  initializeRequestByService,
  isRequestValid,
} from "../utils/index";
import { useGetService } from "../composables/useGetService";
import { useGetQuote } from "../composables/useGetQuote";

export default defineComponent({
  components: { Sidebar, Variant, ErrorNotice, QuotePrice },
  props: ["serviceId"],
  setup({ serviceId }) {
    const route = useRoute();
    const { useUserStore } = useStores();
    const { currentUser } = useUserStore();
    const customer = ref({name: '', phone: '', email: ''});

    const { service, serviceLoading, serviceError, loadData } = useGetService();
    const { quote, quoteLoading, quoteError, getQuote } = useGetQuote();
    const request = ref<Request>();

    watch(service, (s) => {
      if (!s) return;
      request.value = initializeRequestByService(s, currentUser.id);
    });
    watch(
      () => route.params.serviceId,
      (newId) => {
        if (typeof newId === "undefined") {
          return;
        }
        if (Array.isArray(newId)) {
          newId = newId[0];
        }
        loadData(newId);
      },
      { immediate: true }
    );

    watch(
      request,
      () => {
        if (service.value && request.value) {
          getQuote(service.value.id, request.value);
        }
      },
      { deep: true }
    );

    return {
      service,
      request,
      parse,
      serviceLoading,
      serviceError,
      isRequestValid,
      quoteLoading,
      quote,
      customer
    };
  },
});
</script>
<style>
.main-quote {
  display: flex;
}
.main-quote > div {
  padding: 0 20px;
  width: 50%;
  flex-shrink: 1;
}

.fieldgroup {
  background-color: var(--background-subdued);
  margin: 10px 0;
}

@media only screen and (max-width: 600px) {
  .main-quote {
    padding: 20px;
    flex-direction: column;
  }
  .main-quote > div {
    width: 100%;
    padding: 0;
  }
}
.error-color {
  color: var(--danger);
}
.form-field-container {
  margin: 10px 0;
}
</style>
