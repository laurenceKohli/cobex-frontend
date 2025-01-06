export function useUserPosition(){
    const position = ref(null);
    const error = ref(null);
    
    // Demande au navigateur de détecter la position actuelle de l'utilisateur et retourne une Promise
    // et retourne un objet {lat: x, long: y} en format WGS84 
    function getPosition() {
        return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
            position.value = {
                lat: pos.coords.latitude,
                long: pos.coords.longitude
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

    function getSwissPosition(){
        return getPosition().then((pos) => {
            console.log(pos);
            const swissPos = convertCoordonate(pos.coords.latitude, pos.coords.longitude);
            position.value = {
                x: swissPos.x,
                y: swissPos.y
            };
        });
    }
    
    return {
        position,
        error,
        getSwissPosition
    };
}

function convertCoordonate(lat, long){
    //convert to sexagesimal
    const lat2 = (convertDecimalToSexagesimal(lat)- 169028.66)/10000; 
    const long2 = (convertDecimalToSexagesimal(long)- 26782.5)/10000;
    console.log(lat2, long2);
    //convert to CH1903
    const x = 200147.07 + 308807.95 * lat2 + 3745.25 * lat2 * lat2 + 76.63 * long2 * long2 - 194.56 * lat2 * lat2 * long2 + 119.79 * long2 * long2 * long2;
    const y = 600072.37 + 211455.93 * long2 - 10938.51 * lat2 * long2 - 0.36 * long2 * lat2 * lat2 - 44.54 * long2 * long2 * long2;
    return {x, y}; 
}

function convertDecimalToSexagesimal(decimal){
    console.log(decimal);
    const deg = Math.floor(decimal);
    console.log(deg);
    const min = Math.floor((decimal - deg) * 60);
    const sec =((decimal - deg - min / 60) * 3600);
    const nombre = deg +"°"+ min +"'"+ sec + "''";
    console.log(nombre);
    return {nombre};
}