
function prettyPrint(data) {
    var formatted = JSON.stringify(data, null, 4);
    console.log(formatted);
}

module.exports = {
    printPretty: prettyPrint
}