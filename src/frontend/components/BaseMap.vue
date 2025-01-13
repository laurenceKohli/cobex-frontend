<script setup>
import { ref, watch, onMounted, useTemplateRef } from 'vue';

const scale = ref(1);
const canvas = useTemplateRef('canvas');
const ctx = ref(null);
const image = new Image();

const lat1 = 46.786275;
const long1 = 6.639786;

const props = defineProps({
    points: {
        type: Array,
        required: true,
    },
    draggable: {
        type: Boolean,
        default: false,
        required: false,
    },
    width: {
        type: Number,
        default: 900,
        required: false,
    },
    height: {
        type: Number,
        default: 600,
        required: false,
    },
});

const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const offsetX = ref(0);
const offsetY = ref(0);

function handleMouseDown(e) {
    if (!props.draggable) return;
    isDragging.value = true;
    startX.value = e.clientX - offsetX.value;
    startY.value = e.clientY - offsetY.value;
}

function handleMouseMove(e) {
    if (!isDragging.value) return;
    offsetX.value = e.clientX - startX.value;
    offsetY.value = e.clientY - startY.value;
    redrawCanvas();
}

function handleMouseUp() {
    isDragging.value = false;
}

function drawPoint(geoloc, active) {
    if (!ctx.value) return;
    const x = Math.abs(long1 - geoloc.long)*40000;
    const y = Math.abs(lat1 - geoloc.lat)*61500;
    ctx.value.fillStyle = "red";
    ctx.value.fillRect(x, y, 10, 10);
    const pointImage = new Image();
    pointImage.src = active ? '/pin_active.png' : '/pin.png';
    pointImage.onload = () => {
        ctx.value.drawImage(pointImage, x, y, 30, 30);
    };
}

function redrawCanvas() {
    if (!ctx.value) return;

    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    ctx.value.save();
    ctx.value.translate(offsetX.value, offsetY.value);
    ctx.value.scale(scale.value, scale.value);
    ctx.value.drawImage(image, 0, 0);

    // Redessiner les points
    for (const poste of props.points) {
        drawPoint(poste.geoloc, poste.estAccessible);
    }
    ctx.value.restore();
}

function zoomIn() {
    scale.value = Math.min(scale.value * 1.2, 3);
    redrawCanvas();
}

function zoomOut() {
    scale.value = Math.max(scale.value / 1.2, 0.5);
    redrawCanvas();
}


onMounted(() => {
    ctx.value = canvas.value.getContext("2d");
    canvas.value.width = props.width;
    canvas.value.height = props.height;

    image.src = '/map/map_yverdon.jpg';
    image.onload = () => {
        redrawCanvas();
    };
});
</script>

<template>
    <div id="map">
        <canvas ref="canvas" id="mymap" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp" :style="{ cursor: draggable ? 'grab' : 'default' }">
        </canvas>
        <div v-if="draggable" class="zoom-controls">
            <button @click="zoomIn" class="zoom-btn">+</button>
            <button @click="zoomOut" class="zoom-btn">-</button>
        </div>
    </div>
</template>

<style scoped>
#map {
    position: relative;
}

.zoom-controls {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.zoom-btn {
    width: 30px;
    height: 30px;
    font-size: 20px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.zoom-btn:hover {
    background: #f0f0f0;
}

canvas {
    touch-action: none;
    user-select: none;
}
</style>