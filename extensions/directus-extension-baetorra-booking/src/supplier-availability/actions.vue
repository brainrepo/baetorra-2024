<template>
	<transition name="fade">
		<span v-if="itemCount" class="item-count">
			{{ showingCount }}
		</span>
	</transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	inheritAttrs: false,
	props: {
		itemCount: {
			type: Number,
			default: null,
		},
		showingCount: {
			type: String,
			required: true,
		},
	},
});
</script>


