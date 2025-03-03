import React, { useState, useEffect, useCallback, useMemo } from 'react'
import errors from '@twreporter/errors'
import { GCP_PROJECT_ID, ENV } from '../config/index.mjs'
import { useMembership } from '../context/membership'
import Layout from '../components/shared/layout'
import axios from 'axios'

import { setPageCache } from '../utils/cache-setting'
import { fetchHeaderDataInDefaultPageLayout } from '../utils/api'
import styled from 'styled-components'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useWindowDimensions from '../hooks/use-window-dimensions'

const SlotContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
`

const Banner = styled.div`
  margin: 0 auto;
  width: 760px;
  height: 250px;
  position: relative;
`

const BannerLink = styled(Banner)`
  width: 300px;
  ${({ theme }) => theme.breakpoint.xl} {
    width: 760px;
  }
  &:hover {
    cursor: pointer;
  }
`

/**
 *
 * @param {Object} props
 * @param {any} props.headerData
 * @returns {JSX.Element}
 */
export default function Slot({ headerData = {} }) {
  const { isLoggedIn, userEmail, firebaseId } = useMembership()
  const { sectionsData = [], topicsData = [] } = headerData
  const router = useRouter()
  const { width } = useWindowDimensions()
  const isMobile = useMemo(() => width < 1200, [width])
  const [isHover, setIsHover] = useState(false)

  const [status, setStatus] = useState({
    loading: true,
    hasError: false,
    isLoggedIn,
    hasPlayed: false,
  })
  const [probabilities, setProbabilities] = useState({
    prize100: 0,
    prize50: 0,
  })
  const [winPrize, setWinPrize] = useState(null)

  const getSlotSheetDataByUserEmail = async (userFirebaseId) => {
    const { data: sheetData } = await axios.post(
      `${window.location.origin}/api/slot-sheet`,
      { dispatch: 'LOAD_SHEET', userFirebaseId }
    )
    console.log({ sheetData })
    if (sheetData.status !== 'success') {
      return setStatus({
        ...status,
        loading: false,
        hasError: true,
      })
    }
    const { hasPlayed, probabilities } = sheetData.data
    setStatus({
      ...status,
      loading: false,
      hasPlayed,
    })
    setProbabilities({ ...probabilities })
  }

  const handleClickSlot = (e) => {
    e.preventDefault()
    const randomValue = Math.random()
    if (randomValue < probabilities.prize100) {
      setWinPrize(100)
    } else if (randomValue < probabilities.prize50) {
      setWinPrize(50)
    } else {
      setWinPrize('0')
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return setStatus({ ...status, loading: false })
    // fetch data
    getSlotSheetDataByUserEmail(firebaseId)
  }, [isLoggedIn])

  useEffect(() => {
    if (!winPrize) return
    axios.post(`${window.location.origin}/api/slot-sheet`, {
      dispatch: 'WRITE_NEW_LINE',
      userEmail,
      prize: winPrize,
      userFirebaseId: firebaseId,
    })
  }, [winPrize])

  const slotComponent = useCallback(() => {
    if (status.loading) return null
    if (!firebaseId) {
      return (
        <BannerLink
          onClick={() =>
            router.push(`/login?destination=${router.asPath || '/'}`)
          }
        >
          <Image
            src={`https://storage.googleapis.com/statics.mirrormedia.mg/campaigns/slot2023/not-login-${
              isMobile ? 'mobile' : 'desktop'
            }.gif`}
            alt="請登入"
            fill={true}
          />
        </BannerLink>
      )
    } else if (status.hasPlayed) {
      return (
        <Banner>
          <Image
            src="https://storage.googleapis.com/statics.mirrormedia.mg/campaigns/slot2023/has-played.jpg"
            alt="明天再試"
            fill={true}
          />
        </Banner>
      )
    } else if (!winPrize) {
      return (
        <BannerLink onClick={handleClickSlot}>
          <Image
            src={`https://storage.googleapis.com/statics.mirrormedia.mg/campaigns/slot2023/default-${
              isMobile ? 'mobile' : 'desktop'
            }.gif`}
            alt="抽獎"
            fill={true}
          />
        </BannerLink>
      )
    }
    switch (winPrize) {
      case '0': {
        return (
          <Banner>
            <Image
              src="https://storage.googleapis.com/statics.mirrormedia.mg/campaigns/slot2023/has-played.jpg"
              alt="明天再試"
              fill={true}
            />
          </Banner>
        )
      }
      case '50':
      case '100': {
        return (
          <BannerLink
            onClick={handleClickSlot}
            onMouseEnter={() => {
              setIsHover(true)
            }}
            onMouseLeave={() => {
              setIsHover(false)
            }}
          >
            <Image
              src={`https://storage.googleapis.com/statics.mirrormedia.mg/campaigns/slot2023/win-${
                isHover ? 'hover-' : ''
              }${isMobile ? 'mobile' : 'desktop'}.gif`}
              alt="抽獎"
              fill={true}
            />
          </BannerLink>
        )
      }
    }
  }, [status, winPrize, isLoggedIn, router, width])

  return (
    <Layout
      head={{ title: `拉霸機測試` }}
      header={{
        type: 'default',
        data: { sectionsData: sectionsData, topicsData },
      }}
      footer={{ type: 'default' }}
    >
      <SlotContainer>{slotComponent()}</SlotContainer>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ req, res }) {
  if (ENV === 'prod' || ENV === 'staging') {
    return {
      notFound: true,
    }
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  const traceHeader = req.headers?.['x-cloud-trace-context']
  let globalLogFields = {}
  if (traceHeader && !Array.isArray(traceHeader)) {
    const [trace] = traceHeader.split('/')
    globalLogFields[
      'logging.googleapis.com/trace'
    ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
  }
  let headerData
  try {
    headerData = await fetchHeaderDataInDefaultPageLayout()
  } catch (err) {
    const { graphQLErrors, clientErrors, networkError } = err
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while getting story page data'
    )

    const errorMessage = errors.helpers.printAll(
      annotatingError,
      {
        withStack: true,
        withPayload: true,
      },
      0,
      0
    )
    console.log(
      JSON.stringify({
        severity: 'ERROR',
        message: errorMessage,
        debugPayload: {
          graphQLErrors,
          clientErrors,
          networkError,
        },
        ...globalLogFields,
      })
    )
    throw new Error(errorMessage)
  }
  return {
    props: {
      headerData,
    },
  }
}
