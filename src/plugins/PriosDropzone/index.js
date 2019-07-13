import VueDropzone from './components/VueDropzone'
import './css/style.scss'
import { priosDropzoneBus } from './src/priosDropzoneBus'

let mixin = {
    data() {
        return {
            pendingMediaUploads: {},
        }
    },
    methods: {
        async mediaUploadPromise() {
            let self = this
            if (!self.pendingMediaUploads) {
                return false
            }
            let total = Object.keys(self.pendingMediaUploads).length
            if (total < 1) {
                return false
            }

            let promises = []

            for (let category in self.pendingMediaUploads) {
                if (self.pendingMediaUploads[category] === true) {
                    promises.push(
                        new Promise(async function(resolve, reject) {
                            self.$watch(
                                `pendingMediaUploads.${category}`,
                                function(pending) {
                                    if (pending === 'failed') {
                                        return reject(
                                            'Not all medias were uploaded!'
                                        )
                                    } else {
                                        return resolve(true)
                                    }
                                }
                            )
                        })
                    )
                }
            }
        },
    },
    created() {
        let self = this
        priosDropzoneBus.$on('filesDropped', function(subject) {
            if (self.pendingMediaUploads) {
                self.$set(
                    self.pendingMediaUploads,
                    subject.type + '_' + subject.category,
                    true
                )
            }
        })

        priosDropzoneBus.$on('filesUploaded', function(subject) {
            if (self.pendingMediaUploads) {
                self.pendingMediaUploads[
                    subject.type + '_' + subject.category
                ] = false
            }
        })

        priosDropzoneBus.$on('filesUploadFailed', function(subject) {
            if (self.pendingMediaUploads) {
                self.pendingMediaUploads[
                    subject.type + '_' + subject.category
                ] = 'failed'
            }
        })
    },
}

var PriosDropzone = {
    install: function install(Vue) {
        var opts =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {}

        if (this.installed) return
        this.installed = true
        checkVueVersion(Vue)
        Vue.mixin(mixin)
        Vue.component(VueDropzone.name, VueDropzone)
        Vue.prototype.$vueDropZone = new Vue({
            mixin: {
                created() {
                    console.info('Vue dropzone loaeed')
                },
            },
        })
    },

    version: '1.0.0',
}

function checkVueVersion(Vue, requiredVue) {
    var vueDep = requiredVue || '^2.5.18'
    var required = vueDep
        .split('.', 3)
        .map(function(v) {
            return v.replace(/\D/g, '')
        })
        .map(Number)
    var actual = Vue.version.split('.', 3).map(function(n) {
        return parseInt(n, 10)
    })
    // Simple semver caret range comparison
    var passes =
        actual[0] === required[0] && // major matches
        (actual[1] > required[1] || // minor is greater
            (actual[1] === required[1] && actual[2] >= required[2])) // or minor is eq and patch is >=
    if (!passes) {
        console.warn('Vue Dropzone requires Vue version ' + vueDep)
    }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(PriosDropzone)
}

export default PriosDropzone
