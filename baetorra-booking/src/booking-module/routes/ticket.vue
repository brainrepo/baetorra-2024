<template>
  <private-view :title="Ticket" small-header="Small header">
    <template #navigation> actions </template>

    <div>
      <button @click="print">print</button>
      <div :class="{ document: true, isFullscreen: isFullscreen }" id="ticket">
        <div class="header">
          <div class="title">Boarding Pass</div>
          <div>
            <div class="reservation-id">{{ reservationId }}</div>
            <div class="reservation-date">{{ reservation.date }}</div>
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
                  <div class="big-value">24 June 2023</div>
                  <div class="big-value-2">9:00 - 18:00</div>
                </div>
                <div>
                  <div class="subject">Passenger</div>
                  <div class="big-value-1">Mario Maria Ernandez Rossi</div>
                  <div class="normal-text">marioernandez@pipposadasdsa.it</div>
                  <div class="normal-text">+39 3492977246</div>
                </div>
              </div>
            </div>
            <div class="variants block">
              <div class="big-value-1 padding-y">Prenotazione</div>
              <table class=" normal-text-plus">
                <tr>
                  <td>Adulti</td>
                  <td class="center padding-x">2</td>
                  <td>200.00&euro;</td>
                </tr>
                <tr>
                  <td>Bambini</td>
                  <td class="center padding-x">1</td>
                  <td>79.40&euro;</td>
                </tr>
                <tr>
                  <td>Bambini</td>
                  <td class="center padding-x">1</td>
                  <td>79.40&euro;</td>
                </tr>
                <tr>
                  <td>Bambini</td>
                  <td class="center padding-x">1</td>
                  <td>79.40&euro;</td>
                </tr>
                <tr>
                  <td>Bambini</td>
                  <td class="center padding-x">1</td>
                  <td>79.40&euro;</td>
                </tr>
                <tr>
                  <td>Bambini</td>
                  <td class="center padding-x">1</td>
                  <td>79.40&euro;</td>
                </tr>
                <tr>
                  <td colspan="2">Totale</td>
                  <td>79.40&euro;</td>
                </tr>
                <tr>
                  <td colspan="2" class="subject">Saldato alla prenotazione</td>
                  <td>79.40&euro;</td>
                </tr>
                <tr>
                  <td colspan="2" class="subject">Da saldare alla partenza</td>
                  <td>394.10&euro;</td>
                </tr>
              </table>
            </div>
            <div class="qr-codes ">
              <div class="big-value-1">Link utili</div>
              <div class="qr-grid">
                <div class="qr-frame">
                <qrcode-vue
                  value="https://goo.gl/maps/JKDpz7mBfCAB3RKbA"
                  :size="60"
                  level="H"
                  render-as="svg"
                />
                <div class="subject">Boarding dock</div>
              </div>
              <div class="qr-frame">
                <qrcode-vue
                  value="https://goo.gl/maps/JKDpz7mBfCAB3RKbA"
                  :size="60"
                  level="H"
                  render-as="svg"
                />
                <div class="subject">Boarding dock</div>
              </div>
              </div>
            
            </div>
            <div class="block">
              <div class="big-value-1 padding-y">Contract</div> 
              <div class="normal-text">
                Scopri le meraviglie naturali dell’Arcipelago di La Maddalena con le nostre crociere esclusive, il nostro obiettivo è quello di regalarvi una giornata indimenticabile in uno dei posti più belli al mondo. Pensiamo a tutto noi: vi coccoliamo a bordo, lunghe soste in spiaggia, tuffi dalla b
              </div>
            </div>
          </div>
          <div class="sidebar">
            <div class="block">
              <div class="big-value padding-y">Festina Lente</div> 
              <div class="normal-text">
                Scopri le meraviglie naturali dell’Arcipelago di La Maddalena con le nostre crociere esclusive, il nostro obiettivo è quello di regalarvi una giornata indimenticabile in uno dei posti più belli al mondo. Pensiamo a tutto noi: vi coccoliamo a bordo, lunghe soste in spiaggia, tuffi dalla barca. Ma non solo, perché vi faremo gustare anche un ottimo pranzo a base di prodotti tipici locali. E abbiamo anche soluzioni per vegani e vegetariani.
              </div>
              <div class="padding-y">
                <div class="subject">Operato da</div>
                <div class="normal-text">
                  Riviera di Gallura <br>Regione Guardioli, <br>La Maddalena OT
                </div>
              </div>
              <div>
                <div class="subject">Venduto da</div>
                <div class="normal-text">
                  Baetorra <br>Via nazionale, 123 <br>Budoni OT
                </div>
              </div>
              
            </div>
            <div class="block">
              <div class="big-value-1 padding-y">Ricordati</div> 
              <div class="normal-text">
              <ol>
                <li>Prepara l'equipaggiamento adeguato: Assicurati di portare con te tutto il necessario per l'escursione, come scarponi da trekking adatti, abbigliamento adeguato alle condizioni meteorologiche, zaino, acqua, cibo leggero, kit di pronto soccorso e una mappa o una bussola.</li>
                <li>
Informa qualcuno del tuo itinerario: Prima di partire, assicurati di comunicare a qualcuno il tuo itinerario, inclusi il punto di partenza, i punti di arrivo previsti, i tempi approssimativi di cammino e il momento in cui prevedi di ritornare. In questo modo, se si verifica un imprevisto, qualcuno sa dove cercarti.</li>
              </ol>
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
import { defineComponent, ref, watch } from "vue";
import QrcodeVue from "qrcode.vue";

export default defineComponent({
  components: { QrcodeVue },
  props: ["reservationId"],
  setup({ reservationId }) {
    const isFullscreen = ref(false);

    const print = () => {
      isFullscreen.value = true;
    };

    const reservation = {
      date: "12 August 2023 11:00",
    };

    return { reservation, print, isFullscreen };
  },
});
</script>
<style scope lang="scss">
@import "https://cdn.tailwindcss.com";
.document {
  width: 100%;
  display: flex;
  flex-direction: column;
  > * + * {
    margin-top: 20px;
  }
  &.isFullscreen {
    position: fixed;
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
          padding-top:15px;
            > * + * {
          margin-left: 10px;
        }
      .qr-frame{
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
      div{
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
ol, li {
  padding: 5px;
  margin: 5px;
  text-indent: 0;
   list-style-type: 0;
}
</style>
