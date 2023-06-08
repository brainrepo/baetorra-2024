<template>
  <private-view :title="Ticket" small-header="Small header">
    <template #navigation> actions </template>

    <div>
      
      <button @click="print" v-if="reservationLoading">loading</button>
      <button @click="print" v-else>print</button>
      <div
        v-if="reservation"
        :class="{ document: true, isFullscreen: isFullscreen }"
        id="ticket"
      >
        <div class="header">
          <div class="title">Boarding Pass</div>
          <div>
            <div class="reservation-id">{{ reservationId }}</div>
            <div class="reservation-date">{{ reservation?.data.booking_date }}</div>
          </div>
        </div>
        <div class="body-container">
          <div class="main">
            <div class="general-info">
              <qrcode-vue
                :value="reservationId.slice(0, 8)"
                :size="180"
                level="H"
                render-as="svg"
              />
              <div class="info-block">
                <div>
                  <div class="subject">Reservation date</div>
                  <div class="big-value">{{ reservation.data.booked_date }}</div>
                  <div class="big-value-2" v-if="reservation.data.shift?.from">{{ reservation.data.shift?.from }} - {{ reservation.data.shift?.to }}</div>
                  

                </div>
                <div>
                  <div class="subject">Passenger</div>
                  <div class="big-value-1">{{ reservation.data.customer_name }}</div>
                  <div class="normal-text">{{ reservation.data.customer_email }}</div>
                  <div class="normal-text">{{ reservation.data.customer_phone }}</div>
                </div>
              </div>
            </div>
            <div class="variants block">
              <div class="big-value-1 padding-y">Prenotazione</div>
              <table class="normal-text-plus">
                <tr v-for="variant in reservation.data.variants">
                  <td>{{ variant.variant.name }}</td>
                  <td class="center padding-x">{{ variant.amount }}</td>
                  <td>{{variant.total}}&euro;</td>
                </tr>
                <tr>
                  <td colspan="2" class="subject">Totale</td>
                  <td>{{reservation.data.variants.reduce((a,e) => Number(a) + Number(e.total), 0)}}&euro;</td>
                </tr>
                <tr>
                  <td colspan="2" class="subject">Saldato alla prenotazione</td>
                  <td>//&euro;</td>
                </tr>
                <tr>
                  <td colspan="2" class="subject">Da saldare alla partenza</td>
                  <td>//&euro;</td>
                </tr>
              </table>
            </div>
            <div class="qr-codes">
              <div class="big-value-1">Link utili</div>
              <div class="qr-grid">
                <div class="qr-frame" v-for="qr in reservation.data.service.links">
                  <qrcode-vue
                    :value="qr.link"
                    :size="60"
                    level="H"
                    render-as="svg"
                  />
                  <div class="subject">{{ qr.description }}</div>
                </div>
              </div>
            </div>
            <div class="block">
              <div class="big-value-1 padding-y">Contract</div>
              <div class="normal-text" v-html="marked.parse(reservation.data.service.contract)">
              </div>
            </div>
          </div>
          <div class="sidebar">
            <div class="block">
              <div class="big-value padding-y">{{ reservation.data.service.name }}</div>
              <div class="normal-text">
                {{ reservation.data.service.description }}
              </div>
              <div class="padding-y">
                <div class="subject">Operato da</div>
                <div class="normal-text">
                  {{ reservation.data.service.supplier.company }} <br /><span v-html="reservation.data.service.supplier.address.replace('\n', '<br />')"></span><br />{{ reservation.data.service.supplier.phone }}
                </div>
              </div>
              <div>
                <div class="subject">Venduto da</div>
                <div class="normal-text">
                  {{ reservation.data.seller.company }} <br /><span v-html="reservation.data.seller.address.replace('\n', '<br />') "></span><br />{{ reservation.data.seller.phone }}
                </div>
              </div>
            </div>
            <div class="block">
              <div class="big-value-1 padding-y">Ricordati</div>
              <div class="normal-text" v-html="marked.parse(reservation.data.service.memo)">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #sidebar> other sidebar </template>
  </private-view>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from "vue";
import { useGetReservation } from "../composables/useGetReservation";
import QrcodeVue from "qrcode.vue";
import { useItems } from "@directus/extensions-sdk";
import * as marked from 'marked'

export default defineComponent({
  components: { QrcodeVue },
  props: ["reservationId"],
  setup(props) {
    const { collection, filter, search } = toRefs(props);


    const isFullscreen = ref(false);
    const { loadData, reservation, reservationLoading } = useGetReservation();

    loadData(props.reservationId);

    const print = () => {
      isFullscreen.value = true;
      setTimeout(() => {
        window.print()
      },100)
  
    };
    addEventListener("afterprint", (event) => {
      isFullscreen.value = false;  
    });

    // const reservation = {
    //   date: "12 August 2023 11:00",
    // };

    return { reservation, print, isFullscreen, marked, reservationLoading };
  },
});
</script>
<style scope lang="scss">
@import "https://cdn.tailwindcss.com";
.document {
  width: 100%;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  > * + * {
    margin-top: 20px;
  }
  &.isFullscreen {
    position: fixed;
    visibility: visible;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    background: white;
    padding: 0;
    margin: 0;
  }
  .header {
    background: #ebebeb;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex-grow: 0;
    flex-shrink: 0;
    min-height: 0;
    .title {
      font-weight: 700;
      font-size: 22px;
      line-height: 22px;
      color: #000000;
      flex-grow: 1;
    }
    div.reservation-id {
      font-style: bold;
      font-weight: 700;
      font-size: 12px;
      line-height: 14px;
      text-align: right;
      color: #000000;
    }
    div.reservation-date {
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      text-align: right;
      color: #000000;
    }
  }
  .body-container {
    > * + * {
      margin-left: 20px;
    }
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    align-items: stretch;
    .main {
      > * + * {
        margin-top: 20px;
      }
      flex: 4;
      display: flex;
      flex-direction: column;
      max-width: 60vw;
      .general-info {
        background: white;
        flex-grow: 1;
        flex-shrink: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        .info-block {
          padding: 20px;
          > * + * {
            margin-top: 20px;
          }
        }
      }
      .variants {
        table {
          tr {
            .center {
              text-align: center !important;
            }
            td {
              margin-left: 6px;
            }
            td:first-child {
              width: 100%;
            }

            td:not(:first-child) {
              text-align: right;
            }
          }
        }
      }
      .qr-codes {
        .qr-grid {
          padding-top: 15px;
          > * + * {
            margin-left: 10px;
          }
          .qr-frame {
            background: #ebebeb;
            padding: 5px;
            text-overflow: flex-wrap;
          }
          div {
            text-align: center;
          }
          display: flex;
          flex-wrap: wrap;
        }
      }
    }
    .sidebar {
      > * + * {
        margin-top: 20px;
      }
      display: flex;
      flex-direction: column;
      justify-content: stretch;
      flex: 3;
      flex-shrink: 0;
      flex-grow: 1;
      div {
        flex-grow: 1;
      }
    }
  }
}

.block {
  background: #ebebeb;
  padding: 15px;
}
.subject {
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 12px;
  color: #000000;
  text-transform: uppercase;
}
.big-value {
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  line-height: 28px;
}
.big-value-1 {
  font-size: 20px;
  line-height: 20px;
  font-weight: 700;
  color: #000000;
}
.big-value-2 {
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  font-size: 18px;
  color: #000000;
}
.normal-text {
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #000000;
}
.normal-text {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #000000;
}
.padding-y {
  padding: 10px 0;
}
.padding-x {
  padding: 0 10px;
}
ol,
li {
  padding: 5px;
  margin: 5px;
  text-indent: 0;
  list-style-type: 0;
}
</style>
