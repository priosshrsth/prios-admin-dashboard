<template>
    <div ref="window" class="prios-dropzone-container">
        <div
            class="vue-dropzone"
            :class="{ 'drag-on': dragActive, resizable }"
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
                    <div class="span" @click="minimize"></div>
                    <div class="span" @click="maximize"></div>
                    <div class="span"></div>
                </div>
            </div>

            <div class="prios-card-container-outer">
                <div
                    class="prios-card-container-inner"
                    @click="$refs.fallback.click()"
                >
                    <div
                        class="prios-file-holder"
                        @click.prevent="manageFile($event)"
                        v-for="(file, key) in files"
                        :key="key"
                    >
                        <div
                            class="prios-img"
                            :style="`background-image: url(${file.src})`"
                        ></div>
                        <div class="prios-file-name">{{ file.name }}</div>
                    </div>
                    <div
                        class="empty-file-overlay"
                        :class="{ 'display-on': files.length < 1 }"
                    >
                        <div class="fallback-helper-text">
                            <em>Drag & Drop</em> your files here. Or Just
                            <a
                                href="javascript:void(0)"
                                @click.prevent="$refs.fallback.click"
                            >
                                <em @click="$refs.fallback.click()"
                                    >Click Anywhere</em
                                ></a
                            >
                        </div>
                    </div>
                </div>
            </div>
            <input
                ref="fallback"
                class="fallback"
                type="file"
                :name="name"
                @change="filesDropped($event)"
                :multiple="multiple"
            />
        </div>
    </div>
</template>

<script>
import CustomFileReader from '../src/CustomFileReader'

let FILES = []

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
            default: true,
        },
        types: {
            type: [Array],
            default() {
                return ['images']
            },
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
            //max allowed size(MB) of the files
            type: Number,
            validator(size) {
                return size > 0
            },
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
        count: {
            //exact numbers of files
            type: Number,
            validator: function(value) {
                return value > 0
            },
        },
        extensions: {
            //list of allowed extension. this is prioritized over types
            type: [Array, String],
        },
    },
    data: function() {
        return {
            draggable: true,
            fileReadable: true,
            dragActive: false,
            localErrors: {
                files: [],
                extensions: [],
                types: [],
                imageSize: [],
                maxSize: [],
                fileSize: [],
            },
            localWarnings: {
                multiple: [],
                files: [],
                min: [],
                max: [],
            },
            files: [],
        }
    },
    computed: {
        numberOfFiles() {
            return FILES.length + this.files.length
        },
        localInfo() {
            let info = {}
            if (this.extensions || this.types) {
                info.types = {
                    label: 'Allowed Types',
                    text: '',
                }
            }
            return info
        },
        totalSize() {
            let sum = 0
            for (var i = 0; i < FILES.length; i++) {
                sum += FILES[0].size
            }
            return sum
        },
    },
    watch: {
        files(files) {
            this.$emit('value', files)
        },
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
            try {
                let files = event.target.files || event.dataTransfer.files
                for (let i = 0; i < files.length; i++) {
                    FILES.push(files[i])
                }
                this.validateFiles()
                this.$emit('getOriginalFiles', FILES)
                this.processFiles()
            } catch (error) {
                console.log(error)
                this.errorMessages.push('Invalid objects provided!')
            }
            this.$emit('filesDropped')
        },
        dragLeft(event) {
            preventDefaults(event)
            this.dragActive = false
            this.$emit('dragLeft')
        },
        async processFiles() {
            let self = this
            self.files = new CustomFileReader(FILES).files
            console.log(self.files)
            FILES = []
            //this.validateFiles(files)
            //reader.readAsDataURL(files)
        },
        filesCounter() {
            if (!this.multiple && this.numberOfFiles > 1) {
                FILES = [FILES[0]]
                this.warnings.multiple.push('Multiple Files are not allowed!')
            }
            if (this.multiple) {
                if (this.count) {
                    //files prop comes into play here
                    if (this.numberOfFiles !== this.count) {
                        if (this.numberOfFiles > this.count) {
                            FILES = FILES.slice(0, this.count)
                        }
                        this.localWarnings.files.push(
                            `Exactly ${this.count} files are required!`
                        )
                    }
                } else {
                    if (this.min && this.numberOfFiles < this.min) {
                        this.localWarnings.min.push(
                            `${this.min - this.count} more files needed!`
                        )
                    }
                    if (this.max && this.numberOfFiles > this.max) {
                        FILES = FILES.slice(0, this.max)
                        this.localWarnings.max.push(
                            `Only upto ${this.max} files is needed!`
                        )
                    }
                }
            }
        },
        manageFile(event) {
            preventDefaults(event)
        },
        sizeChecker() {},
        validateTypes() {},
        async validateFiles() {
            await this.filesCounter()
            await this.validateTypes()
            await this.sizeChecker()
        },
        handleFiles(files) {
            console.log(files)
        },

        //window related functinos
        minimize() {},
        maximize() {
            let zone = this.$refs.window
            console.log(zone)
            let width = document.getClientWidth + 'px'
            console.log(width)
            let height = window.getClientHeight + 'px'
            zone.style = `position: absolute;width: ${width}; height: ${height}`
        },
    },
}

function limitFiles(files, count) {
    return files.slice(0, count)
}

function preventDefaults(event) {
    event.preventDefault()
    event.stopImmediatePropagation()
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
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
