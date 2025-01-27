import readQR from "./readQR";
import { depart, nbPostesParcourus, stopTimer, endTimer, nbPostesTotal, saveResult, finParcours, parcoursSaved, failedSave } from '../stores/courseActuelle';
import { position } from '../composables/useUserPosition';
import { isAuth, addHookLogin } from '../stores/user';

export function analyseQRCode(imageData, postePosition) {
    const qrCode = readQR(imageData);
    if(compareLocalisations(postePosition, position.value)) {
        scan();
        return 'C\'est fait ' + qrCode;
    }else {
        return 'Vous n\'êtes pas à proximité du poste';
    }
}

export function compareLocalisations(postePosition, userPosition) {
    const distance = calculateDistance(postePosition, userPosition);
    return distance < 10;
}

//temporaire
export function scan () {
    if (!depart.value) {
        depart.value = true;
    } else if(nbPostesParcourus.value < nbPostesTotal.value) {
        nbPostesParcourus.value++;
    } else {
        stopTimer();
        nbPostesParcourus.value = 0;
        finParcours.value = true;
        depart.value = false;
        if(isAuth.value){
            finParcours.value = false;
            saveResult();
        } else {
            addHookLogin(saveResult);
            window.location.href='#profile';
        }
    }
}

const closeActiveModal = () => {
    parcoursSaved.value = false;
    failedSave.value = false;
};

export function quitTrail(){
    closeActiveModal();
    stopTimer();
    depart.value = false;
    nbPostesParcourus.value = 0;
    window.location.href='#';
}

function degToRad(degrees) {
    return degrees / 180 * Math.PI;
}

export function calculateDistance(src, dest) {
    const dlongitude = degToRad(dest.longitude - src.longitude);
    const dlatitude = degToRad(dest.latitude - src.latitude);
    const a = (Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2)) + Math.cos(degToRad(src.latitude)) * Math.cos(degToRad(dest.latitude)) * (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    const angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
}

