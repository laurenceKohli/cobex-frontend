<script setup>
    import { ref, watch, onMounted } from 'vue';
    import BasePoint from './BasePoint.vue';
    import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
    // import { useMap } from '../composables/useMap';

    
    const postesCrud = useFetchApiCrud('postes', import.meta.env.VITE_API_URL);
    
    const lat1 = 2538999.10;
    const long1 = 1182004.52;

    const props = defineProps({
        points: Array
    });
 
    // const {initMap} = useMap();

    onMounted(() => {
        const canvas = document.getElementById("mymap");
        const ctx = canvas.getContext("2d");
        canvas.width = 900;
        canvas.height = 600;
        const image = new Image();
        image.src = '/map/map_yverdon.jpg';

        image.onload = () => {
            ctx.drawImage(image, 0, 0);
        };

        for (const id of props.points) {
            const {data, error, loading} = postesCrud.read(id);
            watch(data, (newValue) => {
                console.log(newValue.geoloc.long);
                console.log(long1);
                const x = long1 - newValue.geoloc.long;
                const y = lat1 - newValue.geoloc.lat;
                console.log(x, y);
                ctx.fillStyle = "red";
                ctx.fillRect(x, y, 10, 10);
            });
        }
        // map.value = initMap(canvas.value);
    });
</script>

<template>
    <div id="map">
        <!-- <img src="/map/map_yverdon.jpg" alt="map"> -->
        <canvas id="mymap">
            
        </canvas>
    </div>
</template>

<style scoped>

</style>