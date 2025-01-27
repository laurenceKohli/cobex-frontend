<script setup>
import BaseButton from './BaseButton.vue';
import { ref } from 'vue';

const emit = defineEmits(['close']);

const props = defineProps({
    modalContent : String,
    modalCondition : Boolean,
    modalCloser : {
        type : Boolean,
        default : false
    }
})
</script>

<template>
    <div v-if="modalCondition" class="modalBackdrop" @click="closeModal">
        <div class="modal">
            <div class="modalContent">
                <div class="modalHeader">
                    <h3>{{ modalContent }}</h3>
                </div>
                <div v-if="modalCloser" class="modalFooter">
                    <BaseButton @click="$emit('close')">Fermer</BaseButton>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.modal {
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
}

.modalContent {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
}

.modalBackdrop {
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #00000080;
    overflow: auto;
}

</style>