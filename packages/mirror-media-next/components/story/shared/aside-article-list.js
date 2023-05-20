//TODOs:
// 1. add loading UI
// 2. adjust desktop style
import Link from 'next/link'
import styled from 'styled-components'
import { useEffect, useState, useRef, useCallback } from 'react'
import { getArticleHref } from '../../../utils'
import Image from '@readr-media/react-image'

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

/** @typedef {import('../../../apollo/fragments/post').AsideListingPost} ArticleData */

const Wrapper = styled.section`
  margin: 24px auto 0;
  width: 100%;
  max-width: 618px;
  ${({ theme }) => theme.breakpoint.xl} {
    min-width: 640px;
  }
`
const Heading = styled.h2`
  text-align: center;
  color: ${({ theme, color }) => theme.color.brandColor[color]};
  font-size: 21px;
  line-height: 1.5;
  ${({ theme }) => theme.breakpoint.md} {
    text-align: left;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    color: ${
      /**
       * @param {Object} props
       * @param {Theme} props.theme
       */
      ({ theme }) => theme.color.brandColor.darkBlue
    };
    font-size: 20px;
    position: relative;
    &::after {
      position: absolute;
      content: '';
      width: 528px;
      height: 1px;
      top: 50%;
      right: 0;
      background-color: ${({ theme }) => theme.color.brandColor.darkBlue};
    }
  }
`

const articleHeightMobile = 254 //px
const articleHeightTablet = 177 //px
const articleHeightDesktop = 22 //px
const articleMarginBottomMobile = 20 //px
const articleMarginBottomTablet = 36 //px
const articleMarginBottomDesktop = 24 //px
const ArticleWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  min-height: ${
    /**
     *
     * @param {Object} param
     * @param {number} param.renderAmount
     */
    ({ renderAmount }) =>
      `calc(${
        renderAmount * articleHeightMobile
      }px + ${articleMarginBottomMobile}px * ${renderAmount}) `
  };
  ${({ theme }) => theme.breakpoint.md} {
    min-height: ${({ renderAmount }) =>
      `calc(${
        renderAmount * articleHeightTablet
      }px + ${articleMarginBottomTablet}px * ${renderAmount}) `};
    margin-bottom: ${`${articleMarginBottomTablet}px`};
  }
  ${({ theme }) => theme.breakpoint.xl} {
    padding: 0;
    width: 100%;
    margin-top: 16px;

    min-height: ${({ renderAmount }) =>
      // 0px is padding-top and padding-bottom of articleWrapper
      `calc(0px + 0px + ${
        renderAmount * articleHeightDesktop
      }px + ${articleMarginBottomDesktop}px * ${renderAmount}) `};
    height: fit-content;
    margin-bottom: 0;
  }
`
const Article = styled.figure`
  display: flex;
  flex-direction: column;
  max-width: 276px;
  margin: 0 auto ${`${articleMarginBottomMobile}px`} auto;

  ${({ theme }) => theme.breakpoint.md} {
    flex-direction: row;
    height: ${`${articleHeightTablet}px`};
    max-width: 100%;
    justify-content: space-between;
    margin: 0 auto ${`${articleMarginBottomTablet}px`} 0;
    .article-image {
      height: 100%;
      min-width: 266px;
      max-width: 266px;
      margin-right: 28px;
    }
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 0 auto ${`${articleMarginBottomDesktop}px`} 0;

    height: ${`${articleHeightDesktop}px`};

    position: relative;
    padding-left: 24px;

    &::before {
      content: '';
      position: absolute;
      margin: 0 6px;
      top: 50%;
      left: 6px;
      width: 8px;
      height: 8px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background-color: rgba(74, 74, 74, 1);
    }
    &::after {
      content: '';
      position: absolute;

      bottom: -12px;
      left: 6px;
      width: 100%;
      height: 1px;
      background-color: #f4f5f6;
    }

    .article-image {
      display: none;
    }
  }
`
const FigureCaption = styled.figcaption`
  width: 100%;
`

const Title = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: ${({ theme, color }) => theme.color.brandColor[color]};
  font-size: 18px;
  line-height: 1.5;
  font-weight: 400;
  margin-top: 16px;
  height: 54px;
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 20px;
    line-height: 32px;
    margin-top: 0;
    height: auto;
    -webkit-line-clamp: 5;
    height: 100%;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    text-align: left;
    width: 100%;
    font-size: 16px;
    line-height: 1.375;

    font-weight: 400;
    color: rgba(74, 74, 74, 1);

    -webkit-line-clamp: 2;
  }
  :active,
  :hover {
    text-decoration: underline;
  }
`

const Loading = styled.div`
  height: 500px;
  margin: auto;
  width: 100%;
  background-color: pink;
`

/**
 *
 * @param {Object} props
 * @param {string} props.heading - heading of this components, showing user what kind of news is
 * @param {()=>Promise<ArticleData[] | []>} props.fetchArticle
 * - A Promise base function for fetching article.
 * - If fulfilled, it will return a array of object, which item is a article.
 * - If rejected, it will return an empty array
 * @param {number} [props.renderAmount]
 * - a number of article we want to render, it will determine the height of `ArticleWrapper` to prevent Cumulative Layout Shift (CLS) problem after article is loaded.
 * @returns {JSX.Element}
 */
export default function AsideArticleList({
  heading = '',
  fetchArticle,
  renderAmount = 6,
}) {
  const wrapperRef = useRef(null)
  const [item, setItem] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const handleLoadMore = useCallback(() => {
    fetchArticle().then((articles) => {
      if (articles.length && Array.isArray(articles)) {
        setItem(articles)
        setIsLoaded(true)
      } else {
        setIsLoaded(true)
      }
    })
  }, [fetchArticle])

  useEffect(() => {
    let callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (isLoaded) {
            observer.unobserve(entry.target)
          } else {
            handleLoadMore()
          }
        }
      })
    }
    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    })
    observer.observe(wrapperRef.current)

    return () => observer.disconnect()
  }, [isLoaded, handleLoadMore])
  const newsJsx = item.map((item) => {
    const articleHref = getArticleHref(item.slug, item.style, undefined)
    return (
      <li key={item.id}>
        <Article>
          <Link href={articleHref} target="_blank" className="article-image">
            <Image
              images={item?.heroImage?.resized}
              alt={item.title}
              loadingImage={'/images/loading.gif'}
              defaultImage={'/images/default-og-img.png'}
              rwd={{ mobile: '276px', tablet: '266px', desktop: '120px' }}
            />
          </Link>

          <FigureCaption>
            <Link href={articleHref} target="_blank">
              <Title color={heading === '熱門文章' ? 'darkBlue' : 'gray'}>
                {item.title}
              </Title>
            </Link>
          </FigureCaption>
        </Article>
      </li>
    )
  })

  return (
    <Wrapper>
      <Heading color={heading === '熱門文章' ? 'darkBlue' : 'gray'}>
        {heading}
      </Heading>
      <ArticleWrapper renderAmount={renderAmount} ref={wrapperRef}>
        {isLoaded ? newsJsx : <Loading>Loading...</Loading>}
      </ArticleWrapper>
    </Wrapper>
  )
}
