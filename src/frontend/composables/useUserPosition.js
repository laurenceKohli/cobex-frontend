import { ref } from "vue";

export const position = ref(null);
export const error = ref(null);
    
    // Demande au navigateur de détecter la position actuelle de l'utilisateur et retourne une Promise
    // et retourne un objet {lat: x, long: y} en format WGS84 
   export function getPosition() {
        return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
            position.value = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            };
            resolve(pos);
            },
            (err) => {
            error.value = err;
            reject(err);
            }
        );
        });
    }