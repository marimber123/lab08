const debug = require("debug")("app:error"); debug.color = 196
const log = require("debug")("app:log")

import { config } from "../../config"

const errorFormats = {
    development: (status, message) => ({
        error: true,
        status,
        body: message,
    }),
    production: () => "Error ocurred while handling the request.",
}

const errorHandler = (
    err, _, res,
) => {
    const status = err.status || 500
    const message = err.message || "Internal Error"
    let format = null

    if (config.dev) {
        format = err.format || "development"
        if (status === 500) {
            debug("[error]", err) // print with stack
        } else {
            log(`[error ${status}]`, message)
            console.log(err)
        }
    } else { // production
        format = err.format || "production"
    }

    res.status(status)
    res.json(errorFormats[format](status, message))
}
export default errorHandler
