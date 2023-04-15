<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Variant",
  props: {
    variant: { type: Object, required: true },
    prices: { type: Object },
    modelValue: Number,
  },
  emits: ["update:modelValue"],
  setup() {
    return { console };
  },
});
</script>

<template>
  <v-sheet class="form-field-container">
    <div>{{ variant.name }}</div>

    <div class="inline">
      <v-input
        type="number"
        :min="0"
        :step="1"
        placeholder="0"
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
      >
        <template #append v-if="prices && prices.type === 'price'">
          <v-menu>
            <template #activator="{ toggle }">
              <div clickable @click="toggle">{{ prices.total }} &euro;</div>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-icon>Valore: </v-list-item-icon>
                <v-list-item-content>
                  {{ prices.value }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon> Fees: </v-list-item-icon>
                <v-list-item-content>
                  {{ prices.fees }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon> Totale: </v-list-item-icon>
                <v-list-item-content>
                  {{ prices.total }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template #append v-if="prices && prices.type === 'error'">
          <v-menu>
            <template #activator="{ toggle }">
              <div clickable @click="toggle">
                <v-icon small name="error" class="error-color" />
              </div>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  {{ prices.message }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-input>
    </div>
  </v-sheet>
</template>
<style scoped>
.error-color {
  color: var(--danger);
}
.form-field-container {
  margin: 10px 0;
}
</style>
