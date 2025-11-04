import fs from "fs"
import { chromium } from "playwright"
try {
  const pid = process.env.PROJECT_ID || "pid not set"
  const banner = process.env.BANNER || ""
  const src=process.env.SRC
  const dst=process.env.DST
  console.log(`using file: ${dst} in project ${pid}`)
  console.log(`src: ${src}`)
  console.log(`inject banner:${banner}`)
  let dat=fs.readFileSync(src)
  start()
} catch (error) {
  throw error
}

function getExit(browser,ctx,page){
  return async function(){
    await page.close();
    await ctx.close();
    await browser.close();
    console.log("exited successfully!");
    process.exit(0);
  }
}

async function start(pid,dat,dst){
  const browser = await chromium.launch()
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  const exit = getExit(browser,ctx,page)
  await exit()
}
