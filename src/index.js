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

function trapVM({dst,dat}){
  if(window.vm){
    if(!every){
      return
    }
    log("trap again")
  }
  log("start trap vm")
  const pro = Function.prototype
  const orig = pro.bind
  pro.bind = function(self2,...args){
    if(self2?.runtime && self2?.on){
      let vm = self2
      ontrap(vm,dst,dat);
      window.vm=vm
      pro.bind=orig
    }
    return orig.call(this,self2,...args)
  }
  
  function ontrap(vm,dst,dat){
    log("vm trapped")
    vm.on("PROJECT_LOADED",()=>{
      log(vm.runtime.gandi.assets)
    })
    log("wait for loaded")
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
  const page = await ctx.newPage()
  const exit = getExit(browser,ctx,page)
  
  await ctx.exposeFunction("exit",exit)
  await ctx.exposeFunction("log",console.log)
  await ctx.addInitScript(()=>{
    setTimeout(async()=>{await exit(-1,"timeout!")},20000);
  })
  await ctx.addInitScript(trapVM,{dat,dst})
  page.on('console', msg => console.log(msg.text()));
  await page.goto("https://www.ccw.site/gandi/extension/"+pid)
  const buffer = await page.screenshot()
  console.log(buffer.toString("base64"))
}
