<template>
    <main>
        <input data-test="gpx-file-input" ref="fileInput" type="file" @change="onFilesChanged" />
        <button data-test="upload-btn" @click="onFilesUpload">Upload Trip</button>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'


const fileInput = ref<HTMLInputElement | null>()
const files = ref<FileList | null>()


function uploadTrips(trips: FileList) {
  const formData = new FormData()

  for (const trip of trips) {
    formData.append('file[]', trip)
  }

  cy.intercept(
  {
    method: 'POST', // Route all GET requests
    url: 'http://localhost:3000/routes/gpx', // that have a URL that matches '/users/*'
  },
  [] // and force the response to be: []
).as('getUsers') // and assign an alias  

  axios.post('http://localhost:3000/routes/gpx', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}


function onFilesUpload() {
    if(!files.value)
    {
        return;
    }

    uploadTrips(files.value);
}

function onFilesChanged() {
    files.value = fileInput.value?.files
}


</script>
