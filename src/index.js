try {
  const pid = process.env.projectId
  console.log(`using project ${pid}`)
} catch (error) {
  throw error
}