const { Router } = require('express')
const routerInfo = new Router()
const numCPUs = require('os').cpus().length
const { logger } = require("../../logger")

/* ------------------ Rutas Info -------------------- */

routerInfo.get('/', (req,res)=> {
    logger.info(`[${req.method}] => ${req.path}`)
    console.log({
        Arg: process.argv.slice(2), 
        SO: process.platform,
        Node: process.version,       
        Memoria: process.memoryUsage().rss,
        execPath: process.execPath,
        PID: process.pid, 
        ProjectFolder: process.cwd(),
        NroSrv: numCPUs
    })
    res.json(
        {
            Arg: process.argv.slice(2), 
            SO: process.platform,
            Node: process.version,       
            Memoria: process.memoryUsage().rss,
            execPath: process.execPath,
            PID: process.pid, 
            ProjectFolder: process.cwd(),
            NroSrv: numCPUs
        }
    )
})

module.exports= { routerInfo }