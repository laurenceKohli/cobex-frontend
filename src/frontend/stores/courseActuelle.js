import { ref, watch } from 'vue'
import { currentTrail } from './utils'
import { useFetchApiCrud } from '../composables/useFetchApiCrud'
import { username } from './user'

export const depart = ref(false)
export const nbPostesParcourus = ref(0)
export const endTimer = ref(3)


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
export const timerValue = ref('01:00:00')
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

const resultatCrud = useFetchApiCrud('resultats', import.meta.env.VITE_API_URL);

function convertTimeToSeconds(time) {
  const [h, m, s] = time.split(':')
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s)
}

function saveResult() {
  console.log('Enregistrement du résultat');
  console.log(username.value);
  const formData = {temps: endTimer.value, trailID: currentTrail.value}; 
  console.log('Donnees :', formData);
  const {data, error} = resultatCrud.create(formData);
  watch(data, () => {
    console.log('Resultat enregistré');
    console.log(data.value);
  });
  watch(error, () => {
    console.error('Error while creating resultat', error.value);
  });
}

export function stopTimer() {
  isTimerRunning.value = false
  endTimer.value = convertTimeToSeconds(timerValue.value)
  saveResult()
  timerValue.value = '00:00:00'
  clearInterval(timerInterval)
}