export default class CustomFileReader {
    files = []
    constructor(files) {
        if (files instanceof Array) {
            let self = this
            files.forEach(function(file) {
                self.processFile(file)
            })
        } else {
            this.processFile(files)
        }
    }

    processFile(file) {
        if (file instanceof File) {
            let reader = new FileReader()
            let self = this
            reader.onload = function(e) {
                self.files.push({
                    src: e.target.result,
                    name: file.name,
                    size: file.size,
                    alt_text: '',
                })
            }
            try {
                reader.readAsDataURL(file)
            } catch (error) {
                console.log(error)
            }
        }
    }
}
