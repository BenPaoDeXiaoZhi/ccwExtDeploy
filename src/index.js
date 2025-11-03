import fs from "fs"
try {
  const pid = process.env.PROJECT_ID || "pid not set"
  const banner = process.env.BANNER || ""
  const src=process.env.SRC
  let dat=fs.readFileSync(src)
  console.log(`using project ${pid}`)
  console.log(`src: ${src}`)
  console.log(`inject banner:${banner}`)
} catch (error) {
  throw error
}