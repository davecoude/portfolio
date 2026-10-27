// GET /api/activity → repo del portafolio con el push más reciente
export default defineEventHandler(() => useProjectSource().getLatestActivity())
