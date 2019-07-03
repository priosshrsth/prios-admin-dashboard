import { VueDropzone as Component } from './components/Dropzone'
import './css/style.scss'

const VueDropzone = {
    install: function(Vue) {
        Vue.component(Component.name, Component),
            Vue.mixin({
                mounted() {
                    console.log('Custom dropzone is Mounted!')
                },
            })
    },
}

export default VueDropzone

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VueDropzone)
}
