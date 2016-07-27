var mount = document.createElement('div')
mount.style.width = '100%'
mount.style.height = '100%'

var demoAppElement = require('./demo-app.js')().element

mount.insertBefore(demoAppElement, mount.children[0])
document.body.appendChild(mount)

// Set page styles
document.querySelector('html').style.height = '100%'
document.body.style.height = '100%'
document.body.style.margin = 0
