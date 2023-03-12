<script lang="ts">
    import { defineComponent, toRefs, watch, ref } from 'vue'
    import DayCell from './day-cell.vue';
    import {numDays, addDay} from '../utils/utils'


    export default defineComponent({
        name: 'v-timeline',
        components:{'v-daycell':DayCell},
        props: {"data": {
                type: Object
            },
            "minDate": {
                type: String,
                required: true
            },
            "maxDate": {
                type: String,
                required: true
            },
            "services": {
                type: Array,
                required: true
            }
        },
        setup(props) {
            // group -> date -> {id: value}
            const {minDate, maxDate, data, services} = toRefs(props);
            const calendar = ref<Array<Date>>([])

            watch(
                [minDate, maxDate, data],
                () => {
                    const days = numDays(maxDate.value, minDate.value)
                    calendar.value = Array(days).fill("-").map((e, i) => addDay(minDate.value, i))
                }, {
                    immediate: true
                }
            )

            return {calendar}
            
        }
    })
</script>

<template>
   ----------------------------------------------------- {{ services }}
    <div class="table">
      <table v-if="calendar.length">
        <tr>
            <th></th>
            <v-daycell v-for="(day, index) in calendar" :date="day"/>
           
        </tr>
        <template v-for="(service) in services">
            <tr>
                <td >{{ service.name }}</td>
                <td :colspan="calendar.length" style="background-color: gray"></td>
            </tr>
            <template v-for="(seller) in service.sellers">
            <tr>
            <td ><div style="sticky">{{ seller.directus_users_id.first_name }}</div></td>
            <td :colspan="calendar.length"  style="background-color: gray"></td>
            </tr>
            <tr v-for="(variant, index) in service.variants">
                <td>{{ variant.name }}</td>
                <td v-for="(day, index) in calendar" >
                    10
                </td>
            </tr>
            </template>
        </template>
    </table>
    </div>
  
   

</template>
<style lang="scss">
    .table table td:first-child{
        position: sticky;
        left: 0;
        background-color: var(--background-normal);
        font-size: 12px;
        padding: 6px;
        border-radius: 4px;
    }

    td {
        min-width: 80px;
        max-width: 80px;
    }

   
    table {
        table-layout: fixed;
    }

    .table {
        margin: 30px;
        overflow-x: scroll;
        position: relative;
        border: 1px solid var(--background-normal);
    }

</style>