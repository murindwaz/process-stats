'use strict'

const prettyBytes = require('pretty-bytes')
const calcPercent = require('calc-percent')
const prettyMs = require('pretty-ms')

const round = n => Number(n.toFixed(2))

const µToMs = time => time / 1000

const getMemStats = (mem, memTotal) => ({
  value: mem,
  pretty: prettyBytes(mem),
  percent: calcPercent(mem, memTotal, {suffix: '%'})
})

const getMs = time => ({
  value: time,
  pretty: prettyMs(time)
})

const getLoadAvg = (collection, cpus) => {
  const value = collection.map(round)
  return {
    value,
    normalized: value.map(load => round(load / cpus))
  }
}

let previousUsage

const getCpuUsage = () => {
  if (!previousUsage) {
    previousUsage = process.cpuUsage()
    return round(µToMs(previousUsage.user))
  }
  const cpuUsage = process.cpuUsage(previousUsage)
  previousUsage = cpuUsage
  return round(µToMs(cpuUsage.user))
}

module.exports = {
  getCpuUsage,
  getMemStats,
  getLoadAvg,
  getMs
}