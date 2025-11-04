import fs from "fs"
import { chromium } from "playwright"
try {
  const pid = process.env.PROJECT_ID || ""
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

function trapVM(onTrap){
  log("start trap vm")
  const pro = Function.prototype
  const orig = pro.bind
  pro.bind = function(self2,...args){
    if(self2?.runtime && self2?.on){
      let vm = self2
      log("vm trapped")
      window.vm=vm
      onTrap(vm)
      pro.bind=orig
    }
    return orig.call(this,self2,...args)
  }
}

async function start(pid,dat,dst,token,uid){
  const browser = await chromium.launch()
  const ctx = await browser.newContext()
  await ctx.addCookies([
    {
      name:"token",
      value:"token",
      domain:".ccw.site",
      path:"/"
    }, {
      name:"cookie-user-id",
      value:"uid",
      domain:".ccw.site",
      path:"/"
    }
  ]);
  await ctx.exposeFunction("exit",exit)
  await ctx.exposeFunction("log",console.log)
  await ctx.addInitScript(trapVM,(vm)=>console.log(vm))
  const page = await ctx.newPage()
  const exit = getExit(browser,ctx,page)
  await page.goto("https://ccw.site/gandi/extension/"+pid)
  const buffer = await page.screenshot()
  console.log(buffer.toString("base64"))
  await exit()
}
