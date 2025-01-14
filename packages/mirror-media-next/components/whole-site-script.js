import GPTScript from './ads/gpt/gpt-script'
import AvividScript from './ads/avivid/avivid-script'
import { useDisplayAd } from '../hooks/useDisplayAd'

export default function WholeSiteScript() {
  const shouldShowAd = useDisplayAd()
  return (
    <>
      <GPTScript />
      {shouldShowAd && <AvividScript />}
    </>
  )
}
