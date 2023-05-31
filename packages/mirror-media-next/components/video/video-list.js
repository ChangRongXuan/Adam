import styled from 'styled-components'
import VideoListItem from '../shared/video-list-item'

const Wrapper = styled.div`
  margin-top: 20px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 40px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 28px;
  }
`

const Videos = styled.div`
  display: grid;
  grid-template-columns: 288px;
  justify-content: center;
  row-gap: 16px;
  margin: 16px auto 0;
  padding: 0 16px;
  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: repeat(3, 186px);
    gap: 19px 20px;
    padding: unset;
    margin: 14px auto 0;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: 238px;
    column-gap: unset;
    row-gap: 16px;
    padding: 0 31px;
  }
`

const Title = styled.h2`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.15;
  padding: 0 16px;
  ${({ theme }) => theme.breakpoint.md} {
    padding: unset;
    font-size: 20px;
    font-weight: 600;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 0 31px;
  }
`

/**
 * @param {Object} props
 * @param {import('../../type/youtube').YoutubeVideo[]} props.videos
 * @returns {React.ReactElement}
 */
export default function VideoList({ videos }) {
  return (
    <Wrapper>
      <Title>最新影音</Title>
      <Videos>
        {videos.map((video) => (
          <VideoListItem key={video.id} video={video} />
        ))}
      </Videos>
    </Wrapper>
  )
}