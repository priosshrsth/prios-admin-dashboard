<template>
    <div>
        <v-container>
            <v-layout pt-5 align-contetn-center justify-center row wrap>
                <v-flex xs12>
                    <vue-dropzone></vue-dropzone>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import VueDropzone from '../../src/plugins/VueDropzone/components/Dropzone'
export default {
    name: 'Media',
    components: { VueDropzone },
}
</script>

<style scoped></style>
