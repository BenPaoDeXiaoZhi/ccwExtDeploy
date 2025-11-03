try {
  const pid = process.env.PROJECT_ID || "pid not set"
  console.log(`using project ${pid}`)
} catch (error) {
  throw error
}