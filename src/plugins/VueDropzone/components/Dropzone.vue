<template>
    <div>
        <div
            class="vue-dropzone"
            :class="{ 'drag-on': dragActive }"
            @dragover="draggedOver"
            @dragenter="dragEntered"
            @dragleave="dragLeft"
            @drop.prevent="filesDropped"
        >
            <div class="toolbar-panel bg-success bg-primary-gradient">
                <div class="panel">
                    <div class="dropzone-title">
                        Dropzone with no name
                    </div>
                </div>
                <div class="window-actions">
                    <div class="span"></div>
                    <div class="span"></div>
                    <div class="span"></div>
                </div>
            </div>

            <div class="card-container">
                Hello
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VueDropzone',
    props: {
        toolbar: {
            type: Boolean,
            default: true,
        },
        windowControl: {
            type: [Boolean, Array],
            default: true,
        },
        toolbarClasses: {
            type: String,
            default: '',
        },
        errorMessages: {
            type: Array,
            default() {
                return []
            },
        },
        name: {
            type: String,
            default: '',
        },
        label: {
            type: String,
            default: '',
        },
        hint: {
            type: String,
            default: '',
        },
        persistentHint: {
            type: Boolean,
            default: false,
        },
        multiple: {
            type: Boolean,
            default: true,
        },
        ajaxURL: {
            type: String,
        },
        minCount: {
            type: Number,
            default: 0,
        },
        required: {
            type: Boolean,
            default: false,
        },
        value: {
            type: [Array, String],
            default: '',
        },
        resizable: {
            type: Boolean,
            default: false,
        },
        types: {
            type: [Array, String],
            default: 'images',
        },
        filesize: {
            //size(bytes) for each file
            type: [Object],
            validator: function(size) {
                if (!(size.min > 0 || size.max > 0)) {
                    throw 'No min: or max: property provided to filesize props - dropzone'
                }
                if (size.max && size.min && size.max < size.min) {
                    throw 'max filesize should be greater than min filesize - dropzone'
                }
                return true
            },
        },
        maxSize: {
            //max allowed size(bytes) of the files
        },
        imageSize: {
            //imageDimension
            type: String,
            validator: function(size) {
                size = size.split('*')
                if (!(size.length === 2 && size[0] > 10 && size[1] > 10)) {
                    throw 'Invalid image size sent to dropzone'
                }
                return true
            },
        },
        min: {
            //this is minimum number of files
            type: Number,
            validator: function(value) {
                return value > 0
            },
        },
        max: {
            //this is max number of files
            type: Number,
            validator: function(value) {
                return value > 0
            },
        },
        files: {
            //exact numbers of files
            type: Number,
            validator: function(value) {
                return value > 0
            },
        },
        extensions: {
            type: [Array, String],
        },
    },
    data: function() {
        return {
            draggable: true,
            fileReadable: true,
            dragActive: false,
        }
    },
    created() {
        let self = this
        let div = document.createElement('div')
        self.draggable =
            'draggable' in div || ('ondragstart' in div && 'ondrop' in div)
        self.fileReadable = 'FileReader' in window
    },
    methods: {
        dragEntered(event) {
            preventDefaults(event)
            this.$emit('dragEntered')
        },
        draggedOver(event) {
            preventDefaults(event)
            this.dragActive = true
            this.$emit('draggedOver')
        },
        filesDropped(event) {
            preventDefaults(event)
            this.dragActive = false
            this.handleFilesDropEvent(event)
            this.$emit('filesDropped')
        },
        dragLeft(event) {
            preventDefaults(event)
            this.dragActive = false
            this.$emit('dragLeft')
        },
        handleFilesDropEvent(event) {
            try {
                let files = event.dataTransfer.files
                let reader = new FileReader()

                this.handleFiles(files)
            } catch (error) {
                console.log(error)
                this.errorMessages.push('Invalid objects provided!')
            }
        },
        handleFiles(files) {
            console.log(files)
        },
    },
}

function preventDefaults(event) {
    event.preventDefault()
    event.stopPropagation()
}

// function handleTypes(t) {
//     let accept = []
//     let txtAccept = []
//     if (t === 'image' || t === 'images') {
//         accept.push('image/*')
//         txtAccept.push('Images')
//     } else if (t === 'video' || t === 'videos') {
//         accept.push('video/*')
//         txtAccept.push('Videos')
//     } else if (t === 'audio' || t === 'audios') {
//         accept.push('audio/*')
//         txtAccept.push('Audios')
//     } else if (t === 'pdf' || t === 'pdfs') {
//         accept.push('application/pdf')
//         txtAccept.push('Pdfs')
//     } else if (t === 'msword' || t === 'mswords') {
//         accept.push('application/msword')
//         txtAccept.push('MS-Word')
//     } else if (t === 'excel' || t === 'excels') {
//         accept.push('application/vnd.ms-excel')
//         txtAccept.push('Excel files')
//     } else if (t === 'powerpoint' || t === 'powerpoints') {
//         accept.push('application/vnd.ms-powerpoint')
//         txtAccept.push('Powerpoints')
//     } else if (t === 'text' || t === 'texts') {
//         accept.push('text/plain')
//         txtAccept.push('Text Files')
//     }
// }
</script>

<style scoped></style>
