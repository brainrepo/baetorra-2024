import { defineModule } from "@directus/extensions-sdk";
import IndexComponent from "./routes/index.vue";
import QuoteComponent from "./routes/quote.vue";
import TicketComponent from "./routes/ticket.vue";
import VoidComponent from "./routes/void.vue";

export default defineModule({
  id: "booking-module",
  name: "Booking",
  icon: "confirmation_number",
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
    {
      path: "ticket/:reservationId",
      component: TicketComponent,
      props: true,
    },
    {
      path: "void/:reservationId",
      component: VoidComponent,
      props: true,
    },
  ],
});
