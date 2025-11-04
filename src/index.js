import fs from "fs"
import { chromium } from "playwright"
try {
  const pid = process.env.PROJECT_ID || "pid not set"
  const banner = process.env.BANNER || ""
  const src=process.env.SRC
  const dst=process.env.DST
  const token=process.env.CCW_TOKEN
  const uid=token.slice(16)
  console.log(`using file: ${dst} in project ${pid}`)
  console.log(`src: ${src}`)
  console.log(`inject banner:${banner}`)
  console.log(`uid: ${uid}`)
  let dat=fs.readFileSync(src)
  start(pid,dat,dst,token,uid)
} catch (error) {
  throw error
}

function getExit(browser,ctx,page){
  return async function(code=0,msg="exited successfully!"){
    await page.close();
    await ctx.close();
    await browser.close();
    console.log(msg);
    process.exit(code);
  }
}

async function start(pid,dat,dst,token,uid){
  const browser = await chromium.launch()
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  const exit = getExit(browser,ctx,page)
  await exit()
}
