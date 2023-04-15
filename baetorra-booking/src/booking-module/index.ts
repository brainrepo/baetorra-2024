import { defineModule } from "@directus/extensions-sdk";
import IndexComponent from "./routes/index.vue";
import QuoteComponent from "./routes/quote.vue";

export default defineModule({
  id: "booking-module",
  name: "Booking",
  icon: "box",
  routes: [
    {
      path: "",
      component: IndexComponent,
      props: true,
    },
    {
      path: "quote/:serviceId",
      component: QuoteComponent,
      props: true,
    },
  ],
});
