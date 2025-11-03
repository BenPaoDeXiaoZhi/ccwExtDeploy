
try {
  const pid = process.env.projectId
  core.info(`using project ${pid}`)
} catch (error) {
  throw error
}