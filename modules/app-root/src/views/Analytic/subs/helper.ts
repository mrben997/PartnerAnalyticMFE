export const a11yProps = (name: string, index: number) => ({
  id: `${name}-tab-${index}`,
  'aria-controls': `${name}-tabpanel-${index}`
})
