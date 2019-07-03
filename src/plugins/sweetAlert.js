import swal from 'sweetalert'

const defaults = {
    closeOnClickOutside: false,
    closeOnEsc: true,
}
swal.setDefaults(defaults)

let deleteOptions = {
    text: 'Are you sure?',
    icon: 'error',
    buttons: {
        cancel: {
            text: 'Cancel',
            value: false,
            visible: true,
            className: 'primary',
        },
        delete: {
            text: 'Delete',
            value: true,
            visible: true,
            className: 'error',
        },
    },
    dangerMode: true,
}

let updateOptions = {
    text: 'Do you want to update data?',
    icon: 'warning',
    buttons: {
        cancel: {
            text: 'Cancel',
            value: false,
            visible: true,
            className: 'error',
        },
        delete: {
            text: 'Update',
            value: true,
            visible: true,
            className: 'primary',
        },
    },
}

let createOptions = {
    text: 'Do you want to save data?',
    icon: 'warning',
    buttons: {
        cancel: {
            text: 'Cancel',
            value: false,
            visible: true,
            className: 'error',
        },
        delete: {
            text: 'Create',
            value: true,
            visible: true,
            className: 'primary',
        },
    },
    dangerMode: true,
}

function handleArguements(arguements, defaultOptions) {
    let options = Object.assign({}, arguements, defaultOptions)
    if (options.hasOwnProperty(1) && typeof options[1] === 'string') {
        options.text = options[1]
        options.title = options[0]
        delete options[0]
        delete options[1]
    } else if (options.hasOwnProperty(0)) {
        if (typeof options[0] === 'string') {
            options.text = options[0]
        } else if (typeof options[0] === 'object') {
            options = Object.assign(options, options[0])
        }
        delete options[0]
    }
    return options
}

export const confirmDelete = function() {
    let options = handleArguements(arguments, deleteOptions)
    return swal(options)
}

export const confirmUpdate = function() {
    let options = handleArguements(arguments, updateOptions)
    return swal(options)
}

export const confirmCreate = function() {
    let options = handleArguements(arguments, createOptions)
    return swal(options)
}

export default swal
