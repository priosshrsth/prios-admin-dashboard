import jquery from 'jquery-slim'

import 'toastr/build/toastr.min.css'

const toastr = require('toastr')

export const $ = jquery
toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    onclick: null,
    // "showDuration": "300",
    // "hideDuration": "1000",
    // "timeOut": "5000",
    // "extendedTimeOut": "1000",
    // "showEasing": "swing",
    // "hideEasing": "linear",
    // "showMethod": "fadeIn",
    // "hideMethod": "fadeOut"
}

window.$ = $
window.toastr = toastr
