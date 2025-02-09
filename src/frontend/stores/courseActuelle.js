import { ref, watch } from 'vue'
import { currentTrail, currentTrailName } from './utils'
import { useFetchApiCrud } from '../composables/useFetchApiCrud'
import { username, resultats } from './user'
import SimpleModal from '../components/SimpleModal.vue'

export const depart = ref(false)
export const nbPostesParcourus = ref(0)
export const nbPostesTotal = ref(0)
export const endTimer = ref(3)
export const postesActifs = ref([])
export const finParcours = ref(false)
export const parcoursSaved = ref(false)
export const failedSave = ref(false)


/**
 * Gestion du Timer
 * 
 * Le timer est un composant qui permet de mesurer le temps écoulé depuis le départ de la course.
 * 
 * Le timer est composé de 3 parties :
 * - isTimerRunning : un boolean qui indique si le timer est actuellement en cours
 * - timerValue : une string qui contient la valeur actuelle du timer sous la forme HH:MM:SS
 * - timerInterval : un interval qui permet de mettre à jour la valeur du timer toutes les secondes
 * 
 * Le timer démarre automatiquement lorsque la course démarre et s'arrête lorsque la course est terminée.
 */
export const isTimerRunning = ref(false)
export const timerValue = ref('00:00:01')
let timerInterval

watch(depart, (newValue) => {
  if (newValue && !isTimerRunning.value) {
    startTimer()
  }
})

function startTimer() {
  isTimerRunning.value = true
  let seconds = 0
  
  timerInterval = setInterval(() => {
    seconds++
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    
    timerValue.value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }, 1000)
}



function convertTimeToSeconds(time) {
  const [h, m, s] = time.split(':')
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s)
}

export function saveResult() {
  const resultatCrud = useFetchApiCrud('resultats', import.meta.env.VITE_API_URL);
  const formData = {temps: endTimer.value, trailID: currentTrail.value};
  const {data, error, loading} = resultatCrud.create(formData);
  watch(data, () => {
    parcoursSaved.value = true;
    resultats.value.push({
      id : data.value.id,
      parcours : {
        id : currentTrail.value,
        nom : currentTrailName.value
      },
      temps : data.value.temps
    });
  });
  watch(error, () => {
    failedSave.value = true;
  });
}

export function stopTimer() {
  isTimerRunning.value = false
  endTimer.value = convertTimeToSeconds(timerValue.value)
  timerValue.value = '00:00:01'
  clearInterval(timerInterval)
}