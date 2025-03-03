import { MICRO_AD_UNITS, POP_IN_IDS } from '../constants/ads'
import { SECTION_IDS } from '../constants/index'

/**
 * Determining whether to insert a `Micro` advertisement after a specific post index.
 *
 * @param {number} index
 * @returns {boolean}
 */
const needInsertMicroAdAfter = (index = 0) => {
  if (typeof index !== 'number') {
    console.error(
      `The value for 'index' is not of the correct data type 'number'. Please check the data type of the value being passed.`
    )
    return false
  }

  return index === 1 || index === 3 || index === 5
}

/**
 * @typedef {'HOME' | 'LISTING' | 'STORY' } MicroAdType
 * @typedef {'PC' | 'MB' | 'RWD' } Device
 *
 * Determining which Micro advertisement ID to take based on the `index`.
 *
 * @param {number} index
 * @param {MicroAdType} microAdType
 * @param {Device} device
 * @returns {string | null}
 */
const getMicroAdUnitId = (
  index = 0,
  microAdType = 'LISTING',
  device = 'RWD'
) => {
  let unitId = null

  if (typeof index !== 'number') {
    console.error(
      `The value for 'index' is not of the correct data type 'number'. Please check the data type of the value being passed.`
    )
    return null
  }

  if (microAdType === 'LISTING') {
    const unitIndex = Math.floor((index - 1) / 2)
    unitId = MICRO_AD_UNITS.LISTING[device][unitIndex]?.id || null
  } else if (microAdType === 'HOME') {
    const unitIndex = Math.floor((index - 1) / 2)
    unitId = MICRO_AD_UNITS.HOME[device][unitIndex]?.id || null
  }

  return unitId
}

/**
 * Returns the GPT pageKey associated with partner's showOnIndex.
 *
 * @param {boolean} partnerShowOnIndex - The showOnIndex of the partner.
 * @return {string} - The GPT pageKey associated with the partner showOnIndex.
 * Returns 'SECTION_IDS.news' if partnerShowOnIndex is valid, otherwise returns 'other'.
 */
function getPageKeyByPartnerShowOnIndex(partnerShowOnIndex) {
  return partnerShowOnIndex
    ? SECTION_IDS['news'] ?? 'other'
    : SECTION_IDS['life'] ?? 'other'
}

/**
 * Returns the GPT pageKey associated with section's slug.
 *
 * @param {string} sectionSlug
 * @returns {string | undefined}
 */
const getSectionGPTPageKey = (sectionSlug) => {
  if (!sectionSlug || typeof sectionSlug !== 'string') {
    return
  }

  let GptPageKey

  //if sectionSlug is `論壇(mirrorcolumn)` or `新聞深探(timesquare)`, use the `culture` ad unit.
  const invalidSections = ['mirrorcolumn', 'timesquare']

  if (invalidSections.includes(sectionSlug)) {
    GptPageKey = SECTION_IDS['culture']
  } else if (SECTION_IDS.hasOwnProperty(sectionSlug)) {
    GptPageKey = SECTION_IDS[sectionSlug]
  } else {
    //if SECTION_IDS doesn't include `sectionSlug` ad units, use `other` ad units
    GptPageKey = 'other'
  }

  return GptPageKey
}

/**
 * Determining whether to insert a `PopIn` advertisement after a specific post index.
 *
 * @param {number} index
 * @returns {boolean}
 */
const needInsertPopInAdAfter = (index = 0) => {
  if (typeof index !== 'number') {
    console.error(
      `The value for 'index' is not of the correct data type 'number'. Please check the data type of the value being passed.`
    )
    return false
  }

  return index === 1 || index === 2
}

/**
 *
 * Determining which PopIn advertisement ID to take based on the `index`.
 *
 * @param {number} index
 * @returns {string | null}
 */
const getPopInId = (index = 0) => {
  let popInId = null

  if (typeof index !== 'number') {
    console.error(
      `The value for 'index' is not of the correct data type 'number'. Please check the data type of the value being passed.`
    )
    return null
  }

  if (index === 1) {
    return POP_IN_IDS.HOT[0]
  } else if (index === 2) {
    return POP_IN_IDS.HOT[1]
  }

  return popInId
}

/**
 * TODO: the logic of selecting amp-gpt-ad unit is different from gpt-ad in normal page.
 * Should refactor to prevent logic inconsistent.
 *
 * Retrieves the data slot section for a given section name.
 *
 * @param {Object} section - The section object containing a name property.
 * @param {string} section.name - The name of the section.
 * @param {boolean} isMemberArticle - The name of the section.
 * @return {string} The corresponding data slot section for the given section name.
 */
function getAmpGptDataSlotSection(section, isMemberArticle) {
  if (isMemberArticle) {
    return 'member'
  }
  const name = section?.name

  switch (true) {
    case name?.includes('時事'):
      return 'news'
    case name?.includes('娛樂'):
      return 'ent'
    case name?.includes('財經理財'):
      return 'fin'
    case name?.includes('人物'):
      return 'peo'
    case name?.includes('國際'):
      return 'int'
    case name?.includes('瑪法達'):
      return 'mafa'
    case name?.includes('文化'):
      return 'cul'
    case name?.includes('汽車鐘錶'):
      return 'wat'
    case name?.includes('美食旅遊'):
      return 'tra'
    case name?.includes('生活'):
      return 'life'
    default:
      return 'oth'
  }
}

export {
  needInsertMicroAdAfter,
  getMicroAdUnitId,
  getPageKeyByPartnerShowOnIndex,
  getSectionGPTPageKey,
  needInsertPopInAdAfter,
  getPopInId,
  getAmpGptDataSlotSection,
}
